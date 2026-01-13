'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createTestPurchase } from '@/lib/purchases'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

/**
 * Process a test mode purchase (no Stripe)
 */
export async function processTestPurchase(
    agentId: string,
    assistedSetupRequested: boolean = false,
    bookCallRequested: boolean = false
) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login?next=/checkout/' + agentId)
    }

    logger.info('🛒 Processing test purchase:', { userId: user.id, agentId, assistedSetupRequested, bookCallRequested })

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
                assistedSetupPrice: true
            }
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

        // Create purchase with assisted setup flag
        const purchase = await prisma.purchase.create({
            data: {
                buyerId: user.id,
                agentId: agent.id,
                agentVersionId: agent.id, // Using agentId as versionId for now
                amountPaid: totalAmount,
                status: 'COMPLETED',
                source: 'TEST_MODE',
                assistedSetupRequested: assistedSetupRequested
            }
        })

        logger.info('✅ Test purchase created:', purchase.id)

        // Create SetupRequest if assisted setup was requested
        if (assistedSetupRequested) {
            const setupRequest = await prisma.setupRequest.create({
                data: {
                    purchaseId: purchase.id,
                    buyerId: user.id,
                    agentId: agent.id,
                    agentVersionId: agent.id,
                    setupType: 'ADMIN_ASSISTED',
                    setupCost: setupPrice,
                    status: 'PENDING',
                    bookCallRequested: bookCallRequested
                }
            })

            logger.info('✅ Setup request created:', setupRequest.id, 'bookCallRequested:', bookCallRequested)
        }

        // Revalidate paths
        revalidatePath(`/agents/${agent.slug}`)
        revalidatePath('/library')

        // Redirect to agent page with success param
        return {
            success: true,
            redirectUrl: `/agents/${agent.slug}?unlocked=true`
        }
    } catch (error) {
        logger.error('❌ Purchase failed:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Purchase failed'
        }
    }
}
