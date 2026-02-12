'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Code2, User, TrendingUp, ShoppingBag, Network, Blocks, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { logger } from '@/lib/logger'

const categoryDefinitions = [
  {
    name: 'Development Tools',
    slug: 'development-tools',
    description:
      'Frameworks, SDKs, and coding agents to build and ship AI-powered software faster.',
    icon: Code2,
    color: 'orange',
  },
  {
    name: 'Personal Assistants',
    slug: 'personal-assistant',
    description:
      'Scheduling, research, note-taking, and travel agents that handle your day-to-day.',
    icon: User,
    color: 'teal',
  },
  {
    name: 'Sales & Marketing',
    slug: 'sales-marketing',
    description:
      'Lead follow-up, outreach, invoicing, and pipeline agents that close deals for you.',
    icon: TrendingUp,
    color: 'orange',
  },
  {
    name: 'E-Commerce',
    slug: 'e-commerce',
    description: 'Product listing, inventory, and customer engagement agents for online stores.',
    icon: ShoppingBag,
    color: 'teal',
  },
  {
    name: 'Multi-Agent Systems',
    slug: 'multi-agent-systems',
    description: 'Orchestrate multiple AI agents working together on complex workflows.',
    icon: Network,
    color: 'orange',
  },
  {
    name: 'Low-Code / No-Code',
    slug: 'low-code-no-code',
    description: 'Drag-and-drop builders and visual tools to create agents without writing code.',
    icon: Blocks,
    color: 'teal',
  },
]

export function CategoryGrid() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    // Fetch agent counts for all categories in a single request
    const fetchCounts = async () => {
      // Check cache first (1 minute TTL for homepage stats)
      const cacheKey = 'category_counts'

      // Wrap sessionStorage in try-catch for private browsing mode (P2.9)
      try {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          try {
            const { counts, timestamp } = JSON.parse(cached)
            if (Date.now() - timestamp < 60 * 1000) {
              // 1 minute
              setCategoryCounts(counts)
              return
            }
          } catch (e) {
            // Invalid cache, continue to fetch
          }
        }
      } catch (storageError) {
        // sessionStorage not available (private browsing mode), skip cache check
      }

      try {
        // Single API call to get all category counts (replaces 6 separate calls)
        const response = await fetch('/api/categories/stats')

        // Check response status (P2.8)
        if (!response.ok) {
          logger.error('Error fetching category stats: HTTP', response.status)
          // Set all counts to 0 if fetch fails
          const counts: Record<string, number> = {}
          categoryDefinitions.forEach(cat => {
            counts[cat.slug] = 0
          })
          setCategoryCounts(counts)
          return
        }

        const data = await response.json()

        if (data.success && data.counts) {
          setCategoryCounts(data.counts)

          // Cache the results (P2.9 - wrap in try-catch)
          try {
            sessionStorage.setItem(
              cacheKey,
              JSON.stringify({
                counts: data.counts,
                timestamp: Date.now(),
              })
            )
          } catch (storageError) {
            // Ignore sessionStorage errors (e.g., in private browsing mode)
          }
        } else {
          logger.warn('Category stats API returned unsuccessful response')
          // Set all counts to 0 if fetch fails
          const counts: Record<string, number> = {}
          categoryDefinitions.forEach(cat => {
            counts[cat.slug] = 0
          })
          setCategoryCounts(counts)
        }
      } catch (error) {
        logger.error('Error fetching category stats:', error)
        // Set all counts to 0 if fetch fails
        const counts: Record<string, number> = {}
        categoryDefinitions.forEach(cat => {
          counts[cat.slug] = 0
        })
        setCategoryCounts(counts)
      }
    }

    fetchCounts()
  }, [])

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-brand-orange/10 to-transparent" />
        <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-brand-teal/10 to-transparent" />
      </div>

      <Container>
        {/* Category Cards Grid */}
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryDefinitions.map((category, index) => {
            const Icon = category.icon
            const count = categoryCounts[category.slug] ?? 0
            const isOrange = category.color === 'orange'

            return (
              <Link
                key={category.slug}
                href={`/agents?category=${category.slug}`}
                className={`group relative overflow-hidden rounded-3xl border-2 border-brand-slate/10 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {/* Hover gradient overlay */}
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                    isOrange
                      ? 'bg-gradient-to-br from-brand-orange/5 to-brand-orange/10'
                      : 'bg-gradient-to-br from-brand-teal/5 to-brand-teal/10'
                  }`}
                />

                <div className="relative">
                  {/* Icon */}
                  <div
                    className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 ${
                      isOrange
                        ? 'bg-brand-orange/10 group-hover:bg-brand-orange group-hover:shadow-lg group-hover:shadow-brand-orange/30'
                        : 'bg-brand-teal/10 group-hover:bg-brand-teal group-hover:shadow-lg group-hover:shadow-brand-teal/30'
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 transition-colors duration-500 ${
                        isOrange
                          ? 'text-brand-orange group-hover:text-white'
                          : 'text-brand-teal group-hover:text-white'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="mb-3 text-xl font-bold text-brand-slate transition-colors group-hover:text-brand-orange">
                      {category.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-brand-slate/70">
                      {category.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t-2 border-brand-slate/10 pt-4">
                    <div
                      className={`flex items-center gap-2 text-sm font-semibold ${
                        isOrange ? 'text-brand-orange' : 'text-brand-teal'
                      }`}
                    >
                      <span>{count}</span>
                      <span className="font-normal text-brand-slate/60">
                        {count === 1 ? 'agent' : 'agents'}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium transition-transform group-hover:translate-x-1 ${
                        isOrange ? 'text-brand-orange' : 'text-brand-teal'
                      }`}
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
