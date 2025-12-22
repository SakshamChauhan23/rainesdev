import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    // Find agent by ID or slug
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        status: 'APPROVED',
      },
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
                bio: true,
                portfolioUrlSlug: true,
                socialLinks: true,
              },
            },
          },
        },
      },
    })

    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Agent not found',
        },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.agent.update({
      where: { id: agent.id },
      data: { viewCount: { increment: 1 } },
    })

    // Check if user has purchased this agent
    let hasPurchased = false
    if (userId) {
      const purchase = await prisma.purchase.findFirst({
        where: {
          agentId: agent.id,
          buyerId: userId,
          status: 'COMPLETED',
        },
      })
      hasPurchased = !!purchase
    }

    // Prepare response
    const response: any = {
      id: agent.id,
      title: agent.title,
      slug: agent.slug,
      shortDescription: agent.shortDescription,
      workflowOverview: agent.workflowOverview,
      useCase: agent.useCase,
      price: agent.price,
      supportAddonPrice: agent.supportAddonPrice,
      demoVideoUrl: agent.demoVideoUrl,
      thumbnailUrl: agent.thumbnailUrl,
      featured: agent.featured,
      viewCount: agent.viewCount,
      purchaseCount: agent.purchaseCount,
      createdAt: agent.createdAt,
      category: agent.category,
      seller: agent.seller,
      hasPurchased,
    }

    // Only include locked content if user has purchased
    if (hasPurchased) {
      response.setupGuide = agent.setupGuide
      response.workflowDetails = agent.workflowDetails
    }

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch agent',
      },
      { status: 500 }
    )
  }
}
