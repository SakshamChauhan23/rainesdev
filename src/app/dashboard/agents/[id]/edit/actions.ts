'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'
import { validatePrice } from '@/lib/validation'

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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  logger.info('🔍 Update Agent - User check:', { userId: user?.id, email: user?.email })

  if (!user) {
    return { message: 'You must be logged in to update an agent' }
  }

  // Verify ownership and editability
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
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
  if (isNaN(price)) {
    return { message: 'Price must be a valid number' }
  }

  // Validate price constraints (P1.11)
  try {
    validatePrice(price, 'price')
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Invalid price' }
  }

  logger.info('📝 Updating agent:', { agentId, title, categoryId })

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
      },
    })

    logger.info('✅ Agent updated successfully:', agentId)
  } catch (error) {
    logger.error('Failed to update agent:', error)
    return { message: 'Database error: Failed to update agent' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
