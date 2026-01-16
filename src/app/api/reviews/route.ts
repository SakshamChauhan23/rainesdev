import { logger } from '@/lib/logger'
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import DOMPurify from 'isomorphic-dompurify'
import { validateRating } from '@/lib/validation'

export const runtime = 'nodejs'
export const revalidate = 60 // Cache reviews for 1 minute

// Review configuration from environment variables (P2.10)
const REVIEW_ELIGIBILITY_DAYS = parseInt(process.env.REVIEW_ELIGIBILITY_DAYS || '14')
const MAX_COMMENT_LENGTH = parseInt(process.env.MAX_COMMENT_LENGTH || '1000')

// Pagination limits (P2.29)
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

// GET - Fetch reviews for an agent with cursor-based pagination (P2.29)
async function getHandler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const agentId = searchParams.get('agentId')
    const cursor = searchParams.get('cursor') // Review ID to start after
    const limitParam = parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE))
    const limit = Math.min(Math.max(1, limitParam), MAX_PAGE_SIZE)

    if (!agentId) {
      return NextResponse.json({ success: false, error: 'Missing agentId' }, { status: 400 })
    }

    // Build where clause
    const whereClause = {
      agentId: agentId,
      agent: {
        status: 'APPROVED' as const,
      },
    }

    // Run queries in parallel for better performance (P2.1)
    const [reviews, stats] = await Promise.all([
      // Get reviews for approved versions only with cursor-based pagination
      prisma.review.findMany({
        where: whereClause,
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit + 1, // Fetch one extra to check if there are more
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1, // Skip the cursor item itself
        }),
      }),
      // Calculate average rating and total count
      prisma.review.aggregate({
        where: whereClause,
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      }),
    ])

    // Check if there are more reviews
    const hasMore = reviews.length > limit
    const reviewsToReturn = hasMore ? reviews.slice(0, limit) : reviews
    const nextCursor = hasMore ? reviewsToReturn[reviewsToReturn.length - 1]?.id : null

    const response = NextResponse.json({
      success: true,
      data: reviewsToReturn,
      stats: {
        averageRating: stats._avg.rating ? parseFloat(stats._avg.rating.toFixed(1)) : 0,
        totalReviews: stats._count.id,
      },
      pagination: {
        hasMore,
        nextCursor,
        pageSize: limit,
      },
    })

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

    return response
  } catch (error) {
    logger.error('[Reviews API GET] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST - Submit a new review
async function postHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, agentId, rating, comment } = body

    // Validation
    if (!userId || !agentId || rating === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate rating constraints (P1.12)
    try {
      validateRating(rating)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Invalid rating' },
        { status: 400 }
      )
    }

    if (comment && comment.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Comment must be ${MAX_COMMENT_LENGTH} characters or less` },
        { status: 400 }
      )
    }

    // Sanitize comment to prevent XSS attacks
    const sanitizedComment = comment
      ? DOMPurify.sanitize(comment, {
          ALLOWED_TAGS: [], // Strip all HTML tags
          ALLOWED_ATTR: [], // Strip all attributes
          KEEP_CONTENT: true, // Keep text content
        }).trim()
      : null

    // Check if user exists and get their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Get agent and verify it's not the seller's own agent
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { sellerId: true, status: true },
    })

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 })
    }

    // Prevent sellers from reviewing their own agents
    if (agent.sellerId === userId) {
      return NextResponse.json(
        { success: false, error: 'You cannot review your own agent' },
        { status: 403 }
      )
    }

    // Find the user's completed purchase
    const purchase = await prisma.purchase.findFirst({
      where: {
        buyerId: userId,
        agentId: agentId,
        status: 'COMPLETED',
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    })

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: 'You must purchase this agent before reviewing it' },
        { status: 403 }
      )
    }

    // Check eligibility period (14 days)
    const eligibilityDate = new Date(purchase.purchasedAt)
    eligibilityDate.setDate(eligibilityDate.getDate() + REVIEW_ELIGIBILITY_DAYS)
    const now = new Date()

    if (now < eligibilityDate) {
      const daysRemaining = Math.ceil(
        (eligibilityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
      return NextResponse.json(
        {
          success: false,
          error: `You can review this agent in ${daysRemaining} days`,
          eligibilityDate: eligibilityDate.toISOString(),
        },
        { status: 403 }
      )
    }

    // Check for existing review for this version
    const existingReview = await prisma.review.findUnique({
      where: {
        agentVersionId_buyerId: {
          agentVersionId: purchase.agentVersionId,
          buyerId: userId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this version of the agent' },
        { status: 409 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        agentId: agentId,
        agentVersionId: purchase.agentVersionId,
        buyerId: userId,
        rating: rating,
        comment: sanitizedComment,
        verifiedPurchase: true, // Always true since we verified purchase above
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: review,
        message: 'Review submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    logger.error('[Reviews API POST] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 })
  }
}

// Apply rate limiting
// GET: Public API preset (30 req/min)
// POST: Review preset (5 reviews per 5 minutes to prevent spam)
export const GET = withRateLimit(RateLimitPresets.PUBLIC_API, getHandler)
export const POST = withRateLimit(RateLimitPresets.REVIEW, postHandler)
