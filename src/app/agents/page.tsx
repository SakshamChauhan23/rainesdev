
"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { AgentGrid } from '@/components/agent/agent-grid'
import { SearchBar } from '@/components/shared/search-bar'
import { Pagination } from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'

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

  // Read category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setSelectedCategorySlug(categoryFromUrl)
      setShowFilters(true) // Auto-open filters when category is pre-selected
    }
  }, [searchParams])

  // Fetch data in parallel on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch categories and agents in parallel
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
        console.error('Failed to fetch data', error)
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
    <div className="bg-white py-16">
      <Container>
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">Ready-to-Use AI Agents for Everyday Business Tasks</h1>
          <p className="text-lg font-light text-gray-600">
            Each agent is pre-configured for common SMB tools and workflows. No experiments. No setup guesswork.
          </p>
        </div>

        {/* Search and Filter Toggle */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder="Search agents..." />
          </div>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 sm:w-auto"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {selectedCategorySlug && (
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                1
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Categories</h3>
              {selectedCategorySlug && (
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>
            {categories.length === 0 ? (
              <div className="text-sm font-light text-gray-500">Loading categories...</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category.id}
                    variant={selectedCategorySlug === category.slug ? 'default' : 'outline'}
                    className={`cursor-pointer font-light ${
                      selectedCategorySlug === category.slug
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
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

        {/* Active Filters */}
        {selectedCategorySlug && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-light text-gray-500">Active filters:</span>
            {categories.filter(c => c.slug === selectedCategorySlug).map(c => (
              <Badge key={c.id} className="bg-gray-100 font-light text-gray-700">
                {c.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm font-light text-gray-600">
          Showing {agents.length} of {totalAgents} agents
        </div>

        {/* Agent Grid */}
        <div className="mb-8">
          <AgentGrid agents={agents} loading={loading} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </Container>
    </div>
  )
}

export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AgentsPageContent />
    </Suspense>
  )
}
