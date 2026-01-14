import { logger } from '@/lib/logger'
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Allow Next.js to cache responses for 60 seconds
export const revalidate = 60
// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

// Search parameter limits to prevent abuse
const MAX_LIMIT = 100
const MAX_SEARCH_LENGTH = 200
const MAX_PAGE = 1000

async function handler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse and validate parameters
    let page = parseInt(searchParams.get('page') || '1')
    let limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const categorySlug = searchParams.get('categorySlug') || ''
    const featured = searchParams.get('featured') === 'true'

    // Validate and enforce limits
    if (page < 1 || isNaN(page)) page = 1
    if (page > MAX_PAGE) {
      return NextResponse.json(
        { success: false, error: `Page number cannot exceed ${MAX_PAGE}` },
        { status: 400 }
      )
    }

    if (limit < 1 || isNaN(limit)) limit = 12
    if (limit > MAX_LIMIT) {
      return NextResponse.json(
        { success: false, error: `Limit cannot exceed ${MAX_LIMIT}` },
        { status: 400 }
      )
    }

    if (search.length > MAX_SEARCH_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Search query cannot exceed ${MAX_SEARCH_LENGTH} characters` },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: 'APPROVED',
      hasActiveUpdate: false, // Hide approved agents with pending updates
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { useCase: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    } else if (categorySlug) {
      // Support filtering by slug
      where.category = {
        slug: categorySlug
      }
    }

    if (featured) {
      where.featured = true
    }

    // Get total count for pagination
    const total = await prisma.agent.count({ where })

    // Get agents
    const agents = await prisma.agent.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            sellerProfile: {
              select: {
                portfolioUrlSlug: true,
              },
            },
          },
        },
      },
    })

    // Don't send locked content in list view
    const sanitizedAgents = agents.map(agent => ({
      id: agent.id,
      title: agent.title,
      slug: agent.slug,
      shortDescription: agent.shortDescription,
      price: agent.price,
      supportAddonPrice: agent.supportAddonPrice,
      thumbnailUrl: agent.thumbnailUrl,
      featured: agent.featured,
      viewCount: agent.viewCount,
      purchaseCount: agent.purchaseCount,
      createdAt: agent.createdAt,
      category: agent.category,
      seller: agent.seller,
    }))

    return NextResponse.json({
      success: true,
      data: sanitizedAgents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error('Error fetching agents:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch agents',
      },
      { status: 500 }
    )
  }
}

// Apply rate limiting (30 requests per minute for search/listing)
export const GET = withRateLimit(RateLimitPresets.SEARCH, handler)
