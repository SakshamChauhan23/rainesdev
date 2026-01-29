'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/user-sync'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

/**
 * Approve an agent
 */
export async function approveAgent(agentId: string) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login')
    }

    // Verify user is admin
    const prismaUser = await getUserWithRole(user.id)

    if (!prismaUser || prismaUser.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        await prisma.agent.update({
            where: { id: agentId },
            data: {
                status: 'APPROVED',
                approvedAt: new Date(),
                rejectionReason: null
            }
        })

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: user.id,
                action: 'APPROVE_AGENT',
                entityType: 'agent',
                entityId: agentId
            }
        })

        revalidatePath('/admin')
        revalidatePath('/agents')

        return { success: true }
    } catch (error) {
        logger.error('Error approving agent:', error)
        return { success: false, error: 'Failed to approve agent' }
    }
}

/**
 * Reject an agent
 */
export async function rejectAgent(agentId: string, reason: string) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login')
    }

    // Verify user is admin
    const prismaUser = await getUserWithRole(user.id)

    if (!prismaUser || prismaUser.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        await prisma.agent.update({
            where: { id: agentId },
            data: {
                status: 'REJECTED',
                rejectionReason: reason,
                approvedAt: new Date() // Track when action was taken
            }
        })

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: user.id,
                action: 'REJECT_AGENT',
                entityType: 'agent',
                entityId: agentId,
                metadata: { reason }
            }
        })

        revalidatePath('/admin')
        revalidatePath('/dashboard')

        return { success: true }
    } catch (error) {
        logger.error('Error rejecting agent:', error)
        return { success: false, error: 'Failed to reject agent' }
    }
}
