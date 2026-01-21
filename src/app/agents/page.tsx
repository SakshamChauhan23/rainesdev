import { Suspense } from 'react'
import { Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AgentsPageClient } from './agents-page-client'

// Force dynamic rendering to ensure pagination works
export const dynamic = 'force-dynamic'

// Server component metadata for SEO (P2.26)
export const metadata = {
  title: 'AI Agents Marketplace | Browse & Discover',
  description:
    'Browse our curated marketplace of AI agents built for real business needs. No coding required.',
}

// Types for server-side data
type Category = {
  id: string
  name: string
  slug: string
}

type Agent = {
  id: string
  title: string
  slug: string
  shortDescription: string
  price: number
  thumbnailUrl: string | null
  category: {
    name: string
  }
  seller: {
    name: string | null
    avatarUrl: string | null
  }
}

type PaginationInfo = {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Valid page sizes
const VALID_PAGE_SIZES = [10, 50, 100] as const

// Server-side data fetching (P2.26)
async function getInitialData(searchParams: {
  category?: string
  page?: string
  search?: string
  limit?: string
}) {
  const page = parseInt(searchParams.page || '1')
  const requestedLimit = parseInt(searchParams.limit || '10')
  const limit = VALID_PAGE_SIZES.includes(requestedLimit as 10 | 50 | 100) ? requestedLimit : 10
  const categorySlug = searchParams.category || null
  const search = searchParams.search || ''

  // Build where clause
  const where: {
    status: 'APPROVED'
    hasActiveUpdate: boolean
    category?: { slug: string }
    OR?: Array<{
      title?: { contains: string; mode: 'insensitive' }
      shortDescription?: { contains: string; mode: 'insensitive' }
      useCase?: { contains: string; mode: 'insensitive' }
    }>
  } = {
    status: 'APPROVED',
    hasActiveUpdate: false,
  }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
      { useCase: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Fetch data in parallel
  const [categories, agents, total] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    }),
    prisma.agent.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        price: true,
        thumbnailUrl: true,
        category: { select: { name: true } },
        seller: { select: { name: true, avatarUrl: true } },
      },
    }),
    prisma.agent.count({ where }),
  ])

  // Convert Decimal to number for price
  const sanitizedAgents: Agent[] = agents.map(agent => ({
    ...agent,
    price: Number(agent.price),
  }))

  const pagination: PaginationInfo = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }

  return {
    categories: categories as Category[],
    initialAgents: sanitizedAgents,
    initialPagination: pagination,
    initialCategorySlug: categorySlug,
    initialSearch: search,
  }
}

// Loading fallback
function AgentsPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream">
      <div className="text-center">
        <div className="mb-4 inline-flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-brand-orange/10">
          <Sparkles className="h-8 w-8 text-brand-orange" />
        </div>
        <p className="text-brand-slate/70">Loading agents...</p>
      </div>
    </div>
  )
}

// Server component that fetches initial data (P2.26)
export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; search?: string; limit?: string }>
}) {
  const resolvedParams = await searchParams
  const { categories, initialAgents, initialPagination, initialCategorySlug, initialSearch } =
    await getInitialData(resolvedParams)

  return (
    <Suspense fallback={<AgentsPageLoading />}>
      <AgentsPageClient
        categories={categories}
        initialAgents={initialAgents}
        initialPagination={initialPagination}
        initialCategorySlug={initialCategorySlug}
        initialSearch={initialSearch}
      />
    </Suspense>
  )
}
