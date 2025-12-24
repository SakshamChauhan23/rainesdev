import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const revalidate = 60

// GET - Fetch all reviews for a seller's agents
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sellerId = searchParams.get('sellerId')

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Missing sellerId' },
        { status: 400 }
      )
    }

    // Get all reviews for this seller's agents
    const reviews = await prisma.review.findMany({
      where: {
        agent: {
          sellerId: sellerId
        }
      },
      include: {
        agent: {
          select: {
            id: true,
            title: true,
            slug: true,
            version: true
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group reviews by agent
    const reviewsByAgent: Record<string, any[]> = {}
    reviews.forEach(review => {
      const agentId = review.agentId
      if (!reviewsByAgent[agentId]) {
        reviewsByAgent[agentId] = []
      }
      reviewsByAgent[agentId].push(review)
    })

    // Calculate stats per agent
    const agentStats = Object.entries(reviewsByAgent).map(([agentId, agentReviews]) => {
      const totalRating = agentReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / agentReviews.length

      return {
        agentId,
        agentTitle: agentReviews[0].agent.title,
        agentSlug: agentReviews[0].agent.slug,
        totalReviews: agentReviews.length,
        averageRating: parseFloat(averageRating.toFixed(1)),
        reviews: agentReviews
      }
    })

    // Overall stats
    const totalReviews = reviews.length
    const overallAverage = totalReviews > 0
      ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1))
      : 0

    const response = NextResponse.json({
      success: true,
      data: {
        reviews,
        agentStats,
        overallStats: {
          totalReviews,
          averageRating: overallAverage
        }
      }
    })

    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

    return response

  } catch (error) {
    console.error('[Seller Reviews API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch seller reviews' },
      { status: 500 }
    )
  }
}
