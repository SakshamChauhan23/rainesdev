import { logger } from '@/lib/logger'

import { prisma } from './prisma'
import { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * Sync or create user in Prisma database from Supabase Auth user
 * This ensures every authenticated user has a corresponding record in our database
 */
export async function syncUserToPrisma(supabaseUser: SupabaseUser) {
    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: supabaseUser.id }
        })

        if (existingUser) {
            // Update email or name if changed
            const needsUpdate =
                existingUser.email !== supabaseUser.email ||
                (supabaseUser.user_metadata?.name && existingUser.name !== supabaseUser.user_metadata.name)

            if (needsUpdate) {
                const updatedUser = await prisma.user.update({
                    where: { id: supabaseUser.id },
                    data: {
                        email: supabaseUser.email!,
                        name: supabaseUser.user_metadata?.name || existingUser.name
                    }
                })
                return updatedUser
            }
            return existingUser
        }

        // Create new user in Prisma
        const newUser = await prisma.user.create({
            data: {
                id: supabaseUser.id, // Use Supabase Auth UUID
                email: supabaseUser.email!,
                name: supabaseUser.user_metadata?.name || null,
                avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
                role: 'BUYER' // Default role
            }
        })

        logger.info('✅ New user synced to Prisma:', newUser.id)
        return newUser
    } catch (error) {
        logger.error('❌ Error syncing user to Prisma:', error)
        throw error
    }
}

/**
 * Get user with role from Prisma database
 */
export async function getUserWithRole(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                role: true,
                sellerProfile: {
                    select: {
                        id: true,
                        portfolioUrlSlug: true,
                        verificationStatus: true
                    }
                }
            }
        })

        return user
    } catch (error) {
        logger.error('❌ Error fetching user with role:', error)
        return null
    }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: 'BUYER' | 'SELLER' | 'ADMIN') {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role }
        })

        logger.info(`✅ User ${userId} role updated to ${role}`)
        return user
    } catch (error) {
        logger.error('❌ Error updating user role:', error)
        throw error
    }
}
