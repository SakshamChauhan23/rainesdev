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
import { prisma } from '@/lib/prisma'
import { getSubscriptionState } from '@/lib/subscription'
import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'

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

// Cached version of getRecommendedAgents
const getCachedRecommendedAgents = unstable_cache(
  async (categoryId: string, currentAgentId: string) =>
    getRecommendedAgents(categoryId, currentAgentId),
  ['recommended-agents'],
  { revalidate: 120, tags: ['agents'] }
)

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

  // Fetch recommended agents server-side (cached)
  const recommendedAgents = await getCachedRecommendedAgents(agent.categoryId, agent.id)

  // Check subscription access
  let hasAccess = false

  if (user) {
    const subState = await getSubscriptionState(user.id)
    hasAccess = subState.hasAccess
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-6 md:py-10">
        {showSuccessBanner && hasAccess && <PurchaseSuccessBanner />}

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
              category={agent.category}
              viewCount={agent.viewCount}
              purchaseCount={agent.purchaseCount}
              agentId={agent.id}
              agentSlug={agent.slug}
              hasAccess={hasAccess}
              isApproved={agent.status === 'APPROVED'}
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
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mt-10">
          <ProductSpecs category={agent.category.name} />
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

        {/* Setup Guide - Locked or Unlocked */}
        <div className="mt-10">
          {hasAccess ? (
            <UnlockedSetupGuide setupGuide={agent.setupGuide} />
          ) : (
            <LockedSetupGuide agentId={agent.id} isApproved={agent.status === 'APPROVED'} />
          )}
        </div>
      </Container>
    </div>
  )
}
