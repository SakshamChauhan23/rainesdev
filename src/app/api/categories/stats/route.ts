import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache for 60 seconds

/**
 * GET /api/categories/stats
 * Returns agent counts for all categories in a single request
 * Replaces the inefficient 6 separate API calls from homepage
 */
async function handler(request: NextRequest) {
  try {
    // Get all categories with their agent counts
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        _count: {
          select: {
            agents: {
              where: {
                status: 'APPROVED',
                isLatestVersion: true
              }
            }
          }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    })

    // Transform to the format expected by the frontend
    const counts = categories.reduce((acc, category) => {
      acc[category.slug] = category._count.agents
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      counts
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category statistics',
        counts: {}
      },
      { status: 500 }
    )
  }
}

// Apply rate limiting (public API preset - 30 req/min)
export const GET = withRateLimit(RateLimitPresets.PUBLIC_API, handler)
