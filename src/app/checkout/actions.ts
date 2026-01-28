'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { validateAmountPaid } from '@/lib/validation'

// Validation schema for checkout actions
const ProcessPurchaseSchema = z.object({
  agentId: z.string().uuid('Invalid agent ID format'),
  assistedSetupRequested: z.boolean(),
  bookCallRequested: z.boolean(),
})

/**
 * Process a test mode purchase (no Stripe)
 */
export async function processTestPurchase(
  agentId: string,
  assistedSetupRequested: boolean = false,
  bookCallRequested: boolean = false
) {
  // Validate inputs
  const validationResult = ProcessPurchaseSchema.safeParse({
    agentId,
    assistedSetupRequested,
    bookCallRequested,
  })

  if (!validationResult.success) {
    logger.error('❌ Invalid purchase input:', validationResult.error.errors)
    return {
      success: false,
      error: 'Invalid input: ' + validationResult.error.errors[0].message,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/checkout/' + agentId)
  }

  logger.info('🛒 Processing test purchase:', {
    userId: user.id,
    agentId,
    assistedSetupRequested,
    bookCallRequested,
  })

  try {
    // Verify agent exists and is approved
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        status: true,
        assistedSetupEnabled: true,
        assistedSetupPrice: true,
      },
    })

    if (!agent) {
      throw new Error('Agent not found')
    }

    if (agent.status !== 'APPROVED') {
      throw new Error('This agent is not available for purchase')
    }

    // Validate assisted setup request
    if (assistedSetupRequested && !agent.assistedSetupEnabled) {
      throw new Error('Assisted setup is not available for this agent')
    }

    // Calculate total amount
    const agentPrice = Number(agent.price)
    const setupPrice = assistedSetupRequested ? Number(agent.assistedSetupPrice) : 0
    const totalAmount = agentPrice + setupPrice

    // Validate amount paid constraints (P1.13)
    try {
      validateAmountPaid(totalAmount)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Invalid payment amount')
    }

    // Use transaction to ensure purchase and setup request are created atomically (P2.6)
    const result = await prisma.$transaction(async (tx) => {
      // Create purchase with assisted setup flag
      const purchase = await tx.purchase.create({
        data: {
          buyerId: user.id,
          agentId: agent.id,
          agentVersionId: agent.id, // Using agentId as versionId for now
          amountPaid: totalAmount,
          status: 'COMPLETED',
          source: 'TEST_MODE',
          assistedSetupRequested: assistedSetupRequested,
        },
      })

      logger.info('✅ Test purchase created:', purchase.id)

      // Create SetupRequest if assisted setup was requested
      let setupRequest = null
      if (assistedSetupRequested) {
        setupRequest = await tx.setupRequest.create({
          data: {
            purchaseId: purchase.id,
            buyerId: user.id,
            agentId: agent.id,
            agentVersionId: agent.id,
            setupType: 'ADMIN_ASSISTED',
            setupCost: setupPrice,
            status: 'PENDING',
            bookCallRequested: bookCallRequested,
          },
        })

        logger.info(
          '✅ Setup request created:',
          setupRequest.id,
          'bookCallRequested:',
          bookCallRequested
        )
      }

      return { purchase, setupRequest }
    })

    // Revalidate paths
    revalidatePath(`/agents/${agent.slug}`)
    revalidatePath('/library')

    // Redirect to agent page with success param
    return {
      success: true,
      redirectUrl: `/agents/${agent.slug}?unlocked=true`,
    }
  } catch (error) {
    logger.error('❌ Purchase failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Purchase failed',
    }
  }
}
