'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface RecommendedAgent {
  id: string
  title: string
  slug: string
  shortDescription: string
  price: number
  thumbnailUrl: string | null
  category: {
    name: string
    slug: string
  }
  seller: {
    name: string | null
    avatarUrl: string | null
  }
}

interface RecommendedAgentsProps {
  agents: RecommendedAgent[]
  currentAgentId: string
  categoryName: string
}

export function RecommendedAgents({ agents, currentAgentId, categoryName }: RecommendedAgentsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Filter out current agent
  const filteredAgents = agents.filter(agent => agent.id !== currentAgentId)

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || filteredAgents.length <= 3 || isHovered) return

    const scrollSpeed = 1 // pixels per frame
    let animationId: number

    const autoScroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        // Reset to beginning when reaching end
        scrollContainer.scrollLeft = 0
      } else {
        scrollContainer.scrollLeft += scrollSpeed
      }
      animationId = requestAnimationFrame(autoScroll)
    }

    // Start auto-scroll after a delay
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll)
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(animationId)
    }
  }, [filteredAgents.length, isHovered])

  // Check scroll position for arrows
  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 320 // card width + gap
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (filteredAgents.length === 0) return null

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Recommended For You</h2>
          <p className="mt-1 text-sm text-gray-600">
            Similar agents in {categoryName} and related categories
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="rounded-full border border-gray-300 p-2 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="rounded-full border border-gray-300 p-2 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Duplicate agents for infinite scroll effect */}
        {[...filteredAgents, ...filteredAgents].map((agent, index) => (
          <Link
            key={`${agent.id}-${index}`}
            href={`/agents/${agent.slug}`}
            className="group flex-shrink-0"
          >
            <div className="w-[300px] overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-[#8DEC42] hover:shadow-lg hover:-translate-y-1">
              {/* Thumbnail */}
              <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                {agent.thumbnailUrl ? (
                  <Image
                    src={agent.thumbnailUrl}
                    alt={agent.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-4xl">🤖</span>
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute bottom-2 left-2">
                  <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
                    {agent.category.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Seller */}
                <div className="mb-2 flex items-center gap-2">
                  {agent.seller.avatarUrl ? (
                    <img
                      src={agent.seller.avatarUrl}
                      alt={agent.seller.name || 'Seller'}
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        const name = agent.seller.name || 'S'
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff&size=40&bold=true`
                      }}
                    />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                      {(agent.seller.name || 'S').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-gray-600">{agent.seller.name}</span>
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-[#8DEC42]">
                  {agent.title}
                </h3>

                {/* Description */}
                <p className="mb-3 line-clamp-2 text-xs text-gray-600">
                  {agent.shortDescription}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(Number(agent.price))}
                  </span>
                  <span className="text-xs text-[#8DEC42] opacity-0 transition-opacity group-hover:opacity-100">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
