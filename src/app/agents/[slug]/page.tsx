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
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-orange/10">
        <svg
          className="h-10 w-10 text-brand-orange"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
          />
        </svg>
      </div>
      <h1 className="mb-3 text-3xl font-bold text-brand-slate sm:text-4xl">{agent.title}</h1>
      <p className="mb-2 text-xl font-semibold text-brand-orange">Coming Soon</p>
      <p className="max-w-md text-brand-slate/60">
        This agent page is under construction. Check back soon for full details and setup guides.
      </p>
    </div>
  )
}
