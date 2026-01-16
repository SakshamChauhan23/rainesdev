/**
 * Shared review utilities (P2.28)
 * Consolidates review eligibility logic for use across API routes
 */

import { prisma } from '@/lib/prisma'

// Review configuration from environment variables (P2.10)
const REVIEW_ELIGIBILITY_DAYS = parseInt(process.env.REVIEW_ELIGIBILITY_DAYS || '14')

export interface EligibilityResult {
  eligible: boolean
  reason?: 'NO_PURCHASE' | 'ALREADY_REVIEWED' | 'TOO_SOON'
  message: string
  eligibilityDate?: string
  daysRemaining?: number
  agentVersionId?: string
  purchaseId?: string
  purchasedAt?: Date
}

/**
 * Check if a user is eligible to review an agent
 * Centralized logic used by both eligibility endpoint and review submission
 */
export async function checkReviewEligibility(
  userId: string,
  agentId: string
): Promise<EligibilityResult> {
  // Find the user's purchase for this agent
  const purchase = await prisma.purchase.findFirst({
    where: {
      buyerId: userId,
      agentId: agentId,
      status: 'COMPLETED',
    },
    orderBy: {
      purchasedAt: 'desc', // Most recent purchase
    },
  })

  if (!purchase) {
    return {
      eligible: false,
      reason: 'NO_PURCHASE',
      message: 'You need to purchase this agent before leaving a review.',
    }
  }

  // Check if review already exists for this version
  const existingReview = await prisma.review.findUnique({
    where: {
      agentVersionId_buyerId: {
        agentVersionId: purchase.agentVersionId,
        buyerId: userId,
      },
    },
  })

  if (existingReview) {
    return {
      eligible: false,
      reason: 'ALREADY_REVIEWED',
      message: 'You have already reviewed this version of the agent.',
    }
  }

  // Calculate eligibility date
  const eligibilityDate = new Date(purchase.purchasedAt)
  eligibilityDate.setDate(eligibilityDate.getDate() + REVIEW_ELIGIBILITY_DAYS)

  const now = new Date()
  const isEligible = now >= eligibilityDate

  if (!isEligible) {
    const daysRemaining = Math.ceil(
      (eligibilityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      eligible: false,
      reason: 'TOO_SOON',
      message: `Reviews unlock after you've had time to use this agent (${daysRemaining} days remaining).`,
      eligibilityDate: eligibilityDate.toISOString(),
      daysRemaining,
    }
  }

  return {
    eligible: true,
    message: 'You can now leave a review for this agent.',
    agentVersionId: purchase.agentVersionId,
    purchaseId: purchase.id,
    purchasedAt: purchase.purchasedAt,
  }
}

/**
 * Get review eligibility days from environment
 */
export function getReviewEligibilityDays(): number {
  return REVIEW_ELIGIBILITY_DAYS
}
