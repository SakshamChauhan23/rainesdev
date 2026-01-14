"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { AgentGrid } from '@/components/agent/agent-grid'
import { SearchBar } from '@/components/shared/search-bar'
import { Pagination } from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'
import { SlidersHorizontal, X, Sparkles, TrendingUp } from 'lucide-react'

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

function AgentsPageContent() {
  const searchParams = useSearchParams()
  const [agents, setAgents] = useState<Agent[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [totalAgents, setTotalAgents] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Read category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setSelectedCategorySlug(categoryFromUrl)
      setShowFilters(true)
    }
  }, [searchParams])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [categoriesRes, agentsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/agents?page=${currentPage}&limit=12${searchQuery ? `&search=${searchQuery}` : ''}${selectedCategorySlug ? `&categorySlug=${selectedCategorySlug}` : ''}`)
        ])

        const [categoriesData, agentsData] = await Promise.all([
          categoriesRes.json(),
          agentsRes.json()
        ])

        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }

        if (agentsData.success) {
          setAgents(agentsData.data)
          setTotalPages(agentsData.pagination.totalPages)
          setTotalAgents(agentsData.pagination.total)
        }
      } catch (error) {
        logger.error('Failed to fetch data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, searchQuery, selectedCategorySlug])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const toggleCategory = (slug: string) => {
    setSelectedCategorySlug(prev => prev === slug ? null : slug)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategorySlug(null)
    setSearchQuery('')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-orange/5 via-brand-cream to-brand-teal/5 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 h-48 w-48 rounded-full bg-brand-orange/10 blur-3xl sm:h-72 sm:w-72" />
          <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-brand-teal/10 blur-3xl sm:h-72 sm:w-72" />
        </div>

        <Container>
          <div className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1.5 text-xs font-medium text-brand-orange border border-brand-orange/20 sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{totalAgents}+ AI Agents Ready to Deploy</span>
            </div>

            <h1 className="mb-4 px-4 text-3xl font-bold tracking-tight text-brand-slate sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
              Discover Your Perfect{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">AI Agent</span>
                <span className="absolute bottom-1 left-0 right-0 h-2 bg-brand-orange/20 -z-0 sm:bottom-2 sm:h-3" />
              </span>
            </h1>

            <p className="mb-8 px-4 text-base text-brand-slate/70 sm:mb-10 sm:text-lg md:text-xl max-w-2xl mx-auto">
              Browse our curated marketplace of AI agents built for real business needs. No coding required.
            </p>

            {/* Search Bar */}
            <div className={`mx-auto max-w-2xl px-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search for AI agents..."
                className="rounded-xl border-2 border-brand-slate/10 bg-white shadow-lg focus-within:border-brand-orange focus-within:shadow-xl transition-all sm:rounded-2xl"
              />
            </div>

            {/* Quick Stats */}
            <div className={`mt-6 flex flex-wrap justify-center gap-4 px-4 text-sm sm:mt-10 sm:gap-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10 sm:h-10 sm:w-10 sm:rounded-xl">
                  <TrendingUp className="h-4 w-4 text-brand-orange sm:h-5 sm:w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-brand-slate sm:text-sm">{categories.length}+ Categories</p>
                  <p className="text-[10px] text-brand-slate/60 sm:text-xs">Every use case</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-teal/10 sm:h-10 sm:w-10 sm:rounded-xl">
                  <Sparkles className="h-4 w-4 text-brand-teal sm:h-5 sm:w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-brand-slate sm:text-sm">Verified Sellers</p>
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
                    : 'bg-white text-brand-slate border-2 border-brand-slate/10 hover:border-brand-orange hover:bg-brand-orange/5'
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
                  className="rounded-xl text-brand-slate/70 hover:text-brand-orange hover:bg-brand-orange/5"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>

            <div className="text-sm font-medium text-brand-slate/70">
              Showing <span className="text-brand-orange font-semibold">{agents.length}</span> of{' '}
              <span className="text-brand-orange font-semibold">{totalAgents}</span> agents
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 rounded-2xl border-2 border-brand-slate/10 bg-white p-6 shadow-lg animate-fade-in">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-brand-slate flex items-center gap-2">
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
                          ? 'bg-brand-orange text-white hover:bg-brand-orange/90 shadow-md shadow-brand-orange/30'
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
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </Container>
    </div>
  )
}

export default function AgentsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange/10 animate-pulse">
            <Sparkles className="h-8 w-8 text-brand-orange" />
          </div>
          <p className="text-brand-slate/70">Loading agents...</p>
        </div>
      </div>
    }>
      <AgentsPageContent />
    </Suspense>
  )
}
