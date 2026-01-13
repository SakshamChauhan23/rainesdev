import { prisma } from './prisma'
import { logger } from './logger'

/**
 * Check if a buyer has purchased a specific agent version
 */
export async function hasPurchased(buyerId: string, agentId: string): Promise<boolean> {
    try {
        const purchase = await prisma.purchase.findFirst({
            where: {
                buyerId,
                agentId,
                status: 'COMPLETED'
            }
        })

        return !!purchase
    } catch (error) {
        logger.error('Error checking purchase:', error)
        return false
    }
}

/**
 * Check if a buyer has purchased a specific agent version ID
 */
export async function hasPurchasedVersion(buyerId: string, agentVersionId: string): Promise<boolean> {
    try {
        const purchase = await prisma.purchase.findFirst({
            where: {
                buyerId,
                agentVersionId,
                status: 'COMPLETED'
            }
        })

        return !!purchase
    } catch (error) {
        logger.error('Error checking version purchase:', error)
        return false
    }
}

/**
 * Get all purchases for a buyer
 */
export async function getBuyerPurchases(buyerId: string) {
    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                buyerId,
                status: 'COMPLETED'
            },
            orderBy: {
                purchasedAt: 'desc'
            },
            include: {
                agent: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnailUrl: true,
                        version: true,
                        price: true,
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })

        return purchases
    } catch (error) {
        logger.error('Error fetching buyer purchases:', error)
        return []
    }
}

/**
 * Create a test mode purchase
 */
export async function createTestPurchase(
    buyerId: string,
    agentId: string,
    agentVersionId: string,
    amount: number
) {
    try {
        // Check if already purchased
        const existing = await prisma.purchase.findFirst({
            where: {
                buyerId,
                agentVersionId
            }
        })

        if (existing) {
            throw new Error('You already own this agent')
        }

        // Create purchase
        const purchase = await prisma.purchase.create({
            data: {
                buyerId,
                agentId,
                agentVersionId,
                amountPaid: amount,
                source: 'TEST_MODE',
                status: 'COMPLETED',
                purchasedAt: new Date()
            }
        })

        // Increment purchase count
        await prisma.agent.update({
            where: { id: agentId },
            data: {
                purchaseCount: {
                    increment: 1
                }
            }
        })

        return purchase
    } catch (error) {
        logger.error('Error creating test purchase:', error)
        throw error
    }
}
