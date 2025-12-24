import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const revalidate = 0 // Always fresh for eligibility checks

const REVIEW_ELIGIBILITY_DAYS = 14 // 14 days after purchase

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const agentId = searchParams.get('agentId')

    if (!userId || !agentId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or agentId' },
        { status: 400 }
      )
    }

    // Find the user's purchase for this agent
    const purchase = await prisma.purchase.findFirst({
      where: {
        buyerId: userId,
        agentId: agentId,
        status: 'COMPLETED'
      },
      orderBy: {
        purchasedAt: 'desc' // Most recent purchase
      }
    })

    if (!purchase) {
      return NextResponse.json({
        success: true,
        eligible: false,
        reason: 'NO_PURCHASE',
        message: 'You need to purchase this agent before leaving a review.'
      })
    }

    // Check if review already exists for this version
    const existingReview = await prisma.review.findUnique({
      where: {
        agentVersionId_buyerId: {
          agentVersionId: purchase.agentVersionId,
          buyerId: userId
        }
      }
    })

    if (existingReview) {
      return NextResponse.json({
        success: true,
        eligible: false,
        reason: 'ALREADY_REVIEWED',
        message: 'You have already reviewed this version of the agent.'
      })
    }

    // Calculate eligibility date (14 days after purchase)
    const eligibilityDate = new Date(purchase.purchasedAt)
    eligibilityDate.setDate(eligibilityDate.getDate() + REVIEW_ELIGIBILITY_DAYS)

    const now = new Date()
    const isEligible = now >= eligibilityDate

    if (!isEligible) {
      const daysRemaining = Math.ceil((eligibilityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      return NextResponse.json({
        success: true,
        eligible: false,
        reason: 'TOO_SOON',
        message: `Reviews unlock after you've had time to use this agent (${daysRemaining} days remaining).`,
        eligibilityDate: eligibilityDate.toISOString(),
        daysRemaining
      })
    }

    return NextResponse.json({
      success: true,
      eligible: true,
      agentVersionId: purchase.agentVersionId,
      purchaseId: purchase.id,
      purchasedAt: purchase.purchasedAt,
      message: 'You can now leave a review for this agent.'
    })

  } catch (error) {
    console.error('[Review Eligibility API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check review eligibility' },
      { status: 500 }
    )
  }
}
