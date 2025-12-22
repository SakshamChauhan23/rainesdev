'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Card, CardContent } from '@/components/ui/card'
import {
  MessageSquare,
  TrendingUp,
  BarChart3,
  FileText,
  Code,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const categoryDefinitions = [
  {
    name: 'Customer Support Agents',
    slug: 'customer-support',
    description: 'Handle FAQs, tickets, and follow-ups automatically — 24/7 support without hiring.',
    icon: MessageSquare,
  },
  {
    name: 'Sales & Lead Follow-Up Agents',
    slug: 'sales-marketing',
    description: 'Capture leads, send follow-ups, and book meetings automatically.',
    icon: TrendingUp,
  },
  {
    name: 'Operations & Insights Agents',
    slug: 'data-analysis',
    description: 'Turn raw business data into daily summaries and actionable insights.',
    icon: BarChart3,
  },
  {
    name: 'Marketing Content Agents',
    slug: 'content-creation',
    description: 'Create emails, website copy, and social posts consistently without an in-house marketer.',
    icon: FileText,
  },
  {
    name: 'Internal Tools & Automation Agents',
    slug: 'development-tools',
    description: 'Automate repetitive internal tasks — reports, syncs, and workflows.',
    icon: Code,
  },
  {
    name: 'Productivity & Admin Agents',
    slug: 'productivity',
    description: 'Scheduling, reminders, task routing, and internal coordination handled automatically.',
    icon: Zap,
  },
]

export function CategoryGrid() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    // Fetch agent counts for each category
    const fetchCounts = async () => {
      const counts: Record<string, number> = {}

      // First, fetch categories to get their IDs
      try {
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()

        // Create a map of slug to ID
        const categoryMap = new Map(
          categoriesData.data?.map((cat: any) => [cat.slug, cat.id]) || []
        )

        // Fetch agent counts for each category
        for (const category of categoryDefinitions) {
          const categoryId = categoryMap.get(category.slug)

          if (categoryId) {
            try {
              const response = await fetch(`/api/agents?categoryId=${categoryId}`)
              const data = await response.json()
              counts[category.slug] = data.pagination?.total || 0
            } catch (error) {
              console.error(`Error fetching count for ${category.slug}:`, error)
              counts[category.slug] = 0
            }
          } else {
            counts[category.slug] = 0
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Set all counts to 0 if categories fetch fails
        categoryDefinitions.forEach(cat => {
          counts[cat.slug] = 0
        })
      }

      setCategoryCounts(counts)
    }

    fetchCounts()
  }, [])

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-3 text-3xl font-light tracking-tight text-black sm:text-4xl">
            Popular services
          </h2>
        </div>

        <div className="space-y-3">
          {categoryDefinitions.map(category => {
            const Icon = category.icon
            const count = categoryCounts[category.slug] ?? 0
            return (
              <Link
                key={category.slug}
                href={`/agents?category=${category.slug}`}
                className="group block border-b border-gray-300 pb-3 transition-all duration-300 hover:border-[#8DEC42]/30 hover:pl-2"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-all duration-300 group-hover:bg-[#8DEC42]/10 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-gray-700 transition-all duration-300 group-hover:text-[#8DEC42]" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-base font-normal text-black transition-all duration-300 group-hover:text-[#8DEC42]">
                        {category.name}
                      </h3>
                      <p className="text-sm font-light text-gray-700">{category.description}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-light text-gray-600 transition-colors group-hover:text-[#8DEC42]">
                    {count} {count === 1 ? 'agent' : 'agents'}
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
