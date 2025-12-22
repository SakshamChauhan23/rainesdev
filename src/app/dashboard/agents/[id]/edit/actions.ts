'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type UpdateAgentState = {
    errors?: {
        title?: string[]
        price?: string[]
        _form?: string[]
    }
    message?: string
}

export async function updateAgent(
    agentId: string,
    prevState: UpdateAgentState,
    formData: FormData
): Promise<UpdateAgentState> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('🔍 Update Agent - User check:', { userId: user?.id, email: user?.email })

    if (!user) {
        return { message: 'You must be logged in to update an agent' }
    }

    // Verify ownership and editability
    const agent = await prisma.agent.findUnique({
        where: { id: agentId }
    })

    if (!agent) {
        return { message: 'Agent not found' }
    }

    if (agent.sellerId !== user.id) {
        return { message: 'You do not have permission to edit this agent' }
    }

    if (agent.status !== 'DRAFT' && agent.status !== 'REJECTED') {
        return { message: 'Agent cannot be edited in current state (' + agent.status + ')' }
    }

    // Extract and validate fields
    const title = formData.get('title') as string
    const categoryId = formData.get('categoryId') as string
    const shortDescription = formData.get('shortDescription') as string
    const price = parseFloat(formData.get('price') as string)
    const workflowOverview = formData.get('workflowOverview') as string
    const useCase = formData.get('useCase') as string
    const demoVideoUrl = formData.get('demoVideoUrl') as string

    // Simple validation
    if (!title || title.length < 3) {
        return { message: 'Title must be at least 3 characters' }
    }
    if (!categoryId) {
        return { message: 'Please select a category' }
    }
    if (isNaN(price) || price < 0) {
        return { message: 'Price must be a valid number' }
    }

    console.log('📝 Updating agent:', { agentId, title, categoryId })

    try {
        await prisma.agent.update({
            where: { id: agentId },
            data: {
                title,
                categoryId,
                shortDescription,
                price,
                workflowOverview,
                useCase,
                demoVideoUrl: demoVideoUrl || null,
                // Note: slug never changes, status stays the same
            }
        })

        console.log('✅ Agent updated successfully:', agentId)
    } catch (error) {
        console.error('Failed to update agent:', error)
        return { message: 'Database error: Failed to update agent' }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
