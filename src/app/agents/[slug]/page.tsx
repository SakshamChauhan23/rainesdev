import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { ProductGallery } from '@/components/agent/product-gallery'
import { ProductInfo } from '@/components/agent/product-info'
import { ProductSpecs } from '@/components/agent/product-specs'
import { ProductFeatures } from '@/components/agent/product-features'
import { CompareAgents } from '@/components/agent/compare-agents'
import { SimilarItemsSidebar } from '@/components/agent/similar-items-sidebar'
import { SellerCard } from '@/components/agent/seller-card'
import { LockedSetupGuide } from '@/components/agent/locked-setup-guide'
import { UnlockedSetupGuide } from '@/components/agent/unlocked-setup-guide'
import { PurchaseSuccessBanner } from '@/components/agent/purchase-success-banner'
import { getCachedAgentBySlug } from '@/lib/agents'
import { createClient } from '@/lib/supabase/server'
import { ReviewSection } from '@/components/reviews/review-section'
import { AssistedSetupConfig } from '@/components/admin/assisted-setup-config'
import { SetupStatus } from '@/components/agent/setup-status'
import { BookCallCard } from '@/components/agent/book-call-card'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import type { Review, ReviewStats, ReviewPagination } from '@/components/reviews/review-list'

// Force dynamic rendering since this page uses cookies() for auth
export const dynamic = 'force-dynamic'

interface AgentPageProps {
  params: {
    slug: string
  }
  searchParams?: {
    unlocked?: string
  }
}

// Server-side review data fetching (P2.27)
const REVIEW_PAGE_SIZE = 10

// Cached version of getInitialReviews
const getCachedInitialReviews = unstable_cache(
  async (agentId: string) => getInitialReviews(agentId),
  ['agent-reviews'],
  { revalidate: 60, tags: ['reviews'] }
)

// Cached version of getRecommendedAgents
const getCachedRecommendedAgents = unstable_cache(
  async (categoryId: string, currentAgentId: string) =>
    getRecommendedAgents(categoryId, currentAgentId),
  ['recommended-agents'],
  { revalidate: 120, tags: ['agents'] }
)

async function getInitialReviews(agentId: string): Promise<{
  reviews: Review[]
  stats: ReviewStats | null
  pagination: ReviewPagination
}> {
  const whereClause = {
    agentId: agentId,
    agent: {
      status: 'APPROVED' as const,
    },
  }

  // Fetch reviews and stats in parallel
  const [reviews, statsResult] = await Promise.all([
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
      orderBy: { createdAt: 'desc' },
      take: REVIEW_PAGE_SIZE + 1, // +1 to check if there are more
    }),
    prisma.review.aggregate({
      where: whereClause,
      _avg: { rating: true },
      _count: { id: true },
    }),
  ])

  const hasMore = reviews.length > REVIEW_PAGE_SIZE
  const reviewsToReturn = hasMore ? reviews.slice(0, REVIEW_PAGE_SIZE) : reviews
  const nextCursor = hasMore ? reviewsToReturn[reviewsToReturn.length - 1]?.id : null

  // Format reviews for client component
  const formattedReviews: Review[] = reviewsToReturn.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    verifiedPurchase: review.verifiedPurchase,
    createdAt: review.createdAt.toISOString(),
    buyer: {
      id: review.buyer.id,
      name: review.buyer.name,
      email: review.buyer.email,
    },
  }))

  const stats: ReviewStats | null =
    statsResult._count.id > 0
      ? {
          averageRating: statsResult._avg.rating
            ? parseFloat(statsResult._avg.rating.toFixed(1))
            : 0,
          totalReviews: statsResult._count.id,
        }
      : null

  return {
    reviews: formattedReviews,
    stats,
    pagination: {
      hasMore,
      nextCursor,
      pageSize: REVIEW_PAGE_SIZE,
    },
  }
}

// Fetch recommended agents from same/similar categories
async function getRecommendedAgents(categoryId: string, currentAgentId: string) {
  // Get agents from the same category first
  const sameCategory = await prisma.agent.findMany({
    where: {
      categoryId,
      status: 'APPROVED',
      id: { not: currentAgentId },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      price: true,
      thumbnailUrl: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      seller: {
        select: {
          name: true,
          avatarUrl: true,
        },
      },
    },
    take: 6,
    orderBy: [{ featured: 'desc' }, { purchaseCount: 'desc' }],
  })

  // Helper to convert Decimal price to number
  const convertPrice = (agent: (typeof sameCategory)[0]) => ({
    ...agent,
    price: Number(agent.price),
  })

  // If we have less than 6, fetch from other categories
  if (sameCategory.length < 6) {
    const otherAgents = await prisma.agent.findMany({
      where: {
        categoryId: { not: categoryId },
        status: 'APPROVED',
        id: { not: currentAgentId },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        price: true,
        thumbnailUrl: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        seller: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
      take: 6 - sameCategory.length,
      orderBy: [{ featured: 'desc' }, { purchaseCount: 'desc' }],
    })
    return [...sameCategory, ...otherAgents].map(convertPrice)
  }

  return sameCategory.map(convertPrice)
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = params
  const agent = await getCachedAgentBySlug(slug)

  if (!agent) {
    return {
      title: 'Agent Not Found',
    }
  }

  return {
    title: `${agent.title} | Rouze.ai`,
    description: agent.shortDescription,
  }
}

export default async function AgentPage({ params, searchParams }: AgentPageProps) {
  const { slug } = params
  const agent = await getCachedAgentBySlug(slug)

  if (!agent) {
    notFound()
  }

  // Check if user is logged in
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const showSuccessBanner = searchParams?.unlocked === 'true'

  // Fetch initial reviews and recommended agents server-side (cached)
  const [initialReviewData, recommendedAgents] = await Promise.all([
    getCachedInitialReviews(agent.id),
    getCachedRecommendedAgents(agent.categoryId, agent.id),
  ])

  // Optimize: Combine all user-related queries into one using Promise.all
  let isPurchased = false
  let userWithRole = null
  let setupRequest = null

  if (user) {
    const [purchaseData, userData, setupData] = await Promise.all([
      // Check if purchased
      prisma.purchase.findFirst({
        where: {
          buyerId: user.id,
          agentId: agent.id,
          status: 'COMPLETED',
        },
        select: { id: true },
      }),
      // Get user with role
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          sellerProfile: {
            select: {
              id: true,
              portfolioUrlSlug: true,
            },
          },
        },
      }),
      // Get setup request (only if conditions might be met)
      prisma.setupRequest.findFirst({
        where: {
          buyerId: user.id,
          agentId: agent.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])

    isPurchased = !!purchaseData
    userWithRole = userData
    // Only use setupRequest if user has actually purchased
    setupRequest = isPurchased ? setupData : null
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-6 md:py-10">
        {showSuccessBanner && isPurchased && <PurchaseSuccessBanner />}

        {/* Main Product Section - Amazon/Samsung Style */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <ProductGallery
                thumbnailUrl={agent.thumbnailUrl}
                demoVideoUrl={agent.demoVideoUrl}
                title={agent.title}
              />
            </div>
          </div>

          {/* Center Column - Product Info */}
          <div className="lg:col-span-4">
            <ProductInfo
              title={agent.title}
              shortDescription={agent.shortDescription}
              price={Number(agent.price)}
              category={agent.category}
              viewCount={agent.viewCount}
              purchaseCount={agent.purchaseCount}
              agentId={agent.id}
              agentSlug={agent.slug}
              isPurchased={isPurchased}
              isApproved={agent.status === 'APPROVED'}
              assistedSetupEnabled={agent.assistedSetupEnabled}
              reviewStats={initialReviewData.stats}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 lg:col-span-3">
            {/* Similar Items */}
            <SimilarItemsSidebar agents={recommendedAgents} />

            {/* Seller Card */}
            <SellerCard
              name={agent.seller.name || 'Anonymous Seller'}
              avatarUrl={agent.seller.avatarUrl}
              bio={agent.seller.sellerProfile?.bio || null}
              portfolioSlug={agent.seller.sellerProfile?.portfolioUrlSlug || '#'}
              socialLinks={
                agent.seller.sellerProfile?.socialLinks as import('@/types').SocialLinks | null
              }
            />

            {/* Book a Call - Show if purchased with assisted setup and book call requested */}
            {isPurchased && setupRequest && setupRequest.bookCallRequested && <BookCallCard />}

            {/* Admin: Assisted Setup Configuration */}
            {userWithRole?.role === 'ADMIN' && (
              <AssistedSetupConfig
                agentId={agent.id}
                currentEnabled={agent.assistedSetupEnabled}
                currentPrice={Number(agent.assistedSetupPrice)}
              />
            )}
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mt-10">
          <ProductSpecs
            category={agent.category.name}
            purchaseCount={agent.purchaseCount}
            assistedSetupEnabled={agent.assistedSetupEnabled}
            assistedSetupPrice={Number(agent.assistedSetupPrice)}
          />
        </div>

        {/* Compare with Similar Products */}
        <div className="mt-10">
          <CompareAgents agents={recommendedAgents} categoryName={agent.category.name} />
        </div>

        {/* Product Features Section */}
        <div className="mt-10">
          <ProductFeatures
            workflowOverview={agent.workflowOverview}
            useCase={agent.useCase}
            title={agent.title}
          />
        </div>

        {/* Setup Status - Show if purchased with assisted setup */}
        {isPurchased && setupRequest && (
          <div className="mt-10">
            <SetupStatus
              status={setupRequest.status}
              setupCost={Number(setupRequest.setupCost)}
              completedAt={setupRequest.completedAt}
              adminNotes={setupRequest.adminNotes}
            />
          </div>
        )}

        {/* Setup Guide - Locked or Unlocked */}
        <div className="mt-10">
          {isPurchased ? (
            <UnlockedSetupGuide setupGuide={agent.setupGuide} />
          ) : (
            <LockedSetupGuide agentId={agent.id} isApproved={agent.status === 'APPROVED'} />
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <ReviewSection
            agentId={agent.id}
            userId={user?.id || null}
            userRole={userWithRole?.role}
            initialReviews={initialReviewData.reviews}
            initialStats={initialReviewData.stats}
            initialPagination={initialReviewData.pagination}
          />
        </div>
      </Container>
    </div>
  )
}
