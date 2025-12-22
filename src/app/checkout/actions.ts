'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createTestPurchase } from '@/lib/purchases'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Process a test mode purchase (no Stripe)
 */
export async function processTestPurchase(agentId: string) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login?next=/checkout/' + agentId)
    }

    console.log('🛒 Processing test purchase:', { userId: user.id, agentId })

    try {
        // Verify agent exists and is approved
        const agent = await prisma.agent.findUnique({
            where: { id: agentId },
            select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                status: true
            }
        })

        if (!agent) {
            throw new Error('Agent not found')
        }

        if (agent.status !== 'APPROVED') {
            throw new Error('This agent is not available for purchase')
        }

        // Create purchase
        const purchase = await createTestPurchase(
            user.id,
            agent.id,
            agent.id, // Using agentId as versionId for now (latest approved version)
            Number(agent.price)
        )

        console.log('✅ Test purchase created:', purchase.id)

        // Revalidate paths
        revalidatePath(`/agents/${agent.slug}`)
        revalidatePath('/library')

        // Redirect to agent page with success param
        return {
            success: true,
            redirectUrl: `/agents/${agent.slug}?unlocked=true`
        }
    } catch (error) {
        console.error('❌ Purchase failed:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Purchase failed'
        }
    }
}
