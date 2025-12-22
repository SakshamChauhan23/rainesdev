import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const featured = searchParams.get('featured') === 'true'

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
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch agents',
      },
      { status: 500 }
    )
  }
}
