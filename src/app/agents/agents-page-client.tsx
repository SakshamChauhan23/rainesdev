'use client'

import { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/layout/container'
import { AgentGrid } from '@/components/agent/agent-grid'
import { SearchBar } from '@/components/shared/search-bar'
import { Pagination } from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'
import { SlidersHorizontal, X, Sparkles, TrendingUp, ChevronDown } from 'lucide-react'

const PAGE_SIZE_OPTIONS = [10, 50, 100] as const

type Agent = {
  id: string
  title: string
  slug: string
  shortDescription: string
  price: number
  thumbnailUrl?: string | null
  category: {
    name: string
  }
  seller: {
    name: string | null
    avatarUrl?: string | null
  }
}

type Category = {
  id: string
  name: string
  slug: string
}

type PaginationInfo = {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface AgentsPageClientProps {
  categories: Category[]
  initialAgents: Agent[]
  initialPagination: PaginationInfo
  initialCategorySlug: string | null
  initialSearch: string
}

export function AgentsPageClient({
  categories,
  initialAgents,
  initialPagination,
  initialCategorySlug,
  initialSearch,
}: AgentsPageClientProps) {
  // State initialized from server-fetched data (P2.26)
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(
    initialCategorySlug
  )
  const [currentPage, setCurrentPage] = useState(initialPagination.page)
  const [pageSize, setPageSize] = useState(initialPagination.limit)
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages)
  const [showFilters, setShowFilters] = useState(!!initialCategorySlug)
  const [totalAgents, setTotalAgents] = useState(initialPagination.total)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch agents from API
  const fetchAgents = useCallback(
    async (page: number, limit: number, search: string, category: string | null) => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('limit', limit.toString())
        if (search) params.set('search', search)
        if (category) params.set('categorySlug', category)

        const response = await fetch(`/api/agents?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          setAgents(data.data)
          setTotalPages(data.pagination.totalPages)
          setTotalAgents(data.pagination.total)
          setCurrentPage(data.pagination.page)
        }
      } catch (error) {
        logger.error('Failed to fetch agents', error)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Update URL without navigation (just for bookmarking/sharing)
  const updateUrl = useCallback(
    (params: { category?: string | null; page?: number; search?: string; limit?: number }) => {
      const newParams = new URLSearchParams()
      if (params.category) newParams.set('category', params.category)
      if (params.page && params.page > 1) newParams.set('page', params.page.toString())
      if (params.search) newParams.set('search', params.search)
      if (params.limit && params.limit !== 10) newParams.set('limit', params.limit.toString())
      const queryString = newParams.toString()
      window.history.replaceState({}, '', `/agents${queryString ? `?${queryString}` : ''}`)
    },
    []
  )

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      fetchAgents(page, pageSize, searchQuery, selectedCategorySlug)
      updateUrl({ category: selectedCategorySlug, page, search: searchQuery, limit: pageSize })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [fetchAgents, updateUrl, pageSize, searchQuery, selectedCategorySlug]
  )

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      setPageSize(newSize)
      setCurrentPage(1)
      fetchAgents(1, newSize, searchQuery, selectedCategorySlug)
      updateUrl({ category: selectedCategorySlug, page: 1, search: searchQuery, limit: newSize })
    },
    [fetchAgents, updateUrl, searchQuery, selectedCategorySlug]
  )

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setCurrentPage(1)
      fetchAgents(1, pageSize, query, selectedCategorySlug)
      updateUrl({ category: selectedCategorySlug, page: 1, search: query, limit: pageSize })
    },
    [fetchAgents, updateUrl, pageSize, selectedCategorySlug]
  )

  const toggleCategory = useCallback(
    (slug: string) => {
      const newCategory = selectedCategorySlug === slug ? null : slug
      setSelectedCategorySlug(newCategory)
      setCurrentPage(1)
      fetchAgents(1, pageSize, searchQuery, newCategory)
      updateUrl({ category: newCategory, page: 1, search: searchQuery, limit: pageSize })
    },
    [fetchAgents, updateUrl, pageSize, searchQuery, selectedCategorySlug]
  )

  const clearFilters = useCallback(() => {
    setSelectedCategorySlug(null)
    setSearchQuery('')
    setCurrentPage(1)
    fetchAgents(1, pageSize, '', null)
    updateUrl({ category: null, page: 1, search: '', limit: pageSize })
  }, [fetchAgents, updateUrl, pageSize])

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-orange/5 via-brand-cream to-brand-teal/5 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-10 top-10 h-48 w-48 rounded-full bg-brand-orange/10 blur-3xl sm:h-72 sm:w-72" />
          <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-brand-teal/10 blur-3xl sm:h-72 sm:w-72" />
        </div>

        <Container>
          <div
            className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-3 py-1.5 text-xs font-medium text-brand-orange sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{totalAgents}+ AI Agents Ready to Deploy</span>
            </div>

            <h1 className="mb-4 px-4 text-3xl font-bold tracking-tight text-brand-slate sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
              Discover Your Perfect{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">AI Agent</span>
                <span className="absolute bottom-1 left-0 right-0 -z-0 h-2 bg-brand-orange/20 sm:bottom-2 sm:h-3" />
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl px-4 text-base text-brand-slate/70 sm:mb-10 sm:text-lg md:text-xl">
              Browse our curated marketplace of AI agents built for real business needs. No coding
              required.
            </p>

            {/* Search Bar */}
            <div
              className={`mx-auto max-w-2xl px-4 transition-all delay-200 duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search for AI agents..."
                defaultValue={searchQuery}
                className="rounded-xl border-2 border-brand-slate/10 bg-white shadow-lg transition-all focus-within:border-brand-orange focus-within:shadow-xl sm:rounded-2xl"
              />
            </div>

            {/* Quick Stats */}
            <div
              className={`delay-400 mt-6 flex flex-wrap justify-center gap-4 px-4 text-sm transition-all duration-1000 sm:mt-10 sm:gap-8 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10 sm:h-10 sm:w-10 sm:rounded-xl">
                  <TrendingUp className="h-4 w-4 text-brand-orange sm:h-5 sm:w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-brand-slate sm:text-sm">
                    {categories.length}+ Categories
                  </p>
                  <p className="text-[10px] text-brand-slate/60 sm:text-xs">Every use case</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-teal/10 sm:h-10 sm:w-10 sm:rounded-xl">
                  <Sparkles className="h-4 w-4 text-brand-teal sm:h-5 sm:w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-brand-slate sm:text-sm">
                    Verified Sellers
                  </p>
                  <p className="text-[10px] text-brand-slate/60 sm:text-xs">Quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Filters Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`group rounded-xl transition-all ${
                  showFilters
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                    : 'border-2 border-brand-slate/10 bg-white text-brand-slate hover:border-brand-orange hover:bg-brand-orange/5'
                }`}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {selectedCategorySlug && (
                  <Badge className="ml-2 bg-white text-brand-orange">1</Badge>
                )}
              </Button>

              {selectedCategorySlug && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="rounded-xl text-brand-slate/70 hover:bg-brand-orange/5 hover:text-brand-orange"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-slate/70">Show</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={e => handlePageSizeChange(Number(e.target.value))}
                    className="appearance-none rounded-lg border-2 border-brand-slate/10 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-brand-slate transition-colors hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                  >
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-slate/50" />
                </div>
              </div>
              <div className="text-sm font-medium text-brand-slate/70">
                Showing <span className="font-semibold text-brand-orange">{agents.length}</span> of{' '}
                <span className="font-semibold text-brand-orange">{totalAgents}</span> agents
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 animate-fade-in rounded-2xl border-2 border-brand-slate/10 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-brand-slate">
                  <SlidersHorizontal className="h-5 w-5 text-brand-orange" />
                  Categories
                </h3>
              </div>
              {categories.length === 0 ? (
                <div className="text-sm text-brand-slate/50">Loading categories...</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge
                      key={category.id}
                      variant={selectedCategorySlug === category.slug ? 'default' : 'outline'}
                      className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        selectedCategorySlug === category.slug
                          ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/30 hover:bg-brand-orange/90'
                          : 'border-2 border-brand-slate/10 bg-white text-brand-slate hover:border-brand-teal hover:bg-brand-teal/5 hover:text-brand-teal'
                      }`}
                      onClick={() => toggleCategory(category.slug)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Agent Grid */}
        <div className="mb-12">
          <AgentGrid agents={agents} loading={loading} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Container>
    </div>
  )
}
