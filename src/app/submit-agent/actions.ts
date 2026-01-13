
'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { logger } from '@/lib/logger'

export type CreateAgentState = {
    errors?: {
        title?: string[]
        price?: string[]
        _form?: string[]
    }
    message?: string
}

export async function createAgent(prevState: CreateAgentState, formData: FormData): Promise<CreateAgentState> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    logger.info('🔍 Create Agent - User check:', { userId: user?.id, email: user?.email })

    if (!user) {
        logger.info('❌ No user found in session')
        return {
            message: 'You must be logged in to create an agent',
        }
    }

    // Validate fields
    const title = formData.get('title') as string
    const categoryId = formData.get('categoryId') as string
    const shortDescription = formData.get('shortDescription') as string
    const price = parseFloat(formData.get('price') as string)
    const workflowOverview = formData.get('workflowOverview') as string
    const useCase = formData.get('useCase') as string
    const demoVideoUrl = formData.get('demoVideoUrl') as string
    const thumbnailUrl = formData.get('thumbnailUrl') as string
    const setupGuide = formData.get('setupGuide') as string

    // Simple validation
    if (!title || title.length < 3) return { message: 'Title must be at least 3 characters' }
    if (!categoryId) return { message: 'Please select a category' }
    if (isNaN(price) || price < 0) return { message: 'Price must be a valid number' }
    if (!setupGuide || setupGuide.length < 10) return { message: 'Setup guide is required and must be at least 10 characters' }

    const slug = slugify(title) + '-' + Math.random().toString(36).substring(2, 7) // Ensure uniqueness

    logger.info('📝 Creating agent:', { title, slug, sellerId: user.id, categoryId })

    // First, verify the user exists in the database
    const userExists = await prisma.user.findUnique({
        where: { id: user.id }
    })

    if (!userExists) {
        logger.error('❌ User not found in database:', user.id)
        return {
            message: 'User account not found. Please contact support.',
        }
    }

    logger.info('✅ User exists in database:', userExists.email)

    try {
        const agent = await prisma.agent.create({
            data: {
                sellerId: user.id,
                categoryId,
                title,
                slug,
                shortDescription,
                price,
                workflowOverview,
                useCase,
                setupGuide,
                status: 'DRAFT', // Default to draft
                demoVideoUrl: demoVideoUrl || null,
                thumbnailUrl: thumbnailUrl || null,
            }
        })
        logger.info('✅ Agent created successfully:', agent.id)
    } catch (error) {
        logger.error('Failed to create agent:', error)
        return {
            message: 'Database error: Failed to create agent.',
        }
    }

    redirect('/dashboard?success=created')
}
