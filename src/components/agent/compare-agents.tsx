'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Agent {
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

interface CompareAgentsProps {
  agents: Agent[]
  categoryName: string
}

export function CompareAgents({ agents, categoryName }: CompareAgentsProps) {
  if (agents.length === 0) return null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Compare with similar products</h2>
        <Link
          href={`/agents?category=${agents[0]?.category.slug || ''}`}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {agents.slice(0, 4).map(agent => (
          <Link
            key={agent.id}
            href={`/agents/${agent.slug}`}
            className="group rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-200 hover:shadow-md"
          >
            {/* Image */}
            <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
              {agent.thumbnailUrl ? (
                <Image
                  src={agent.thumbnailUrl}
                  alt={agent.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                </div>
              )}
            </div>

            {/* Info */}
            <h3 className="mb-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary">
              {agent.title}
            </h3>

            {/* Rating placeholder */}
            <div className="mb-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1 text-xs text-gray-500">(New)</span>
            </div>

            {/* Price */}
            <p className="text-base font-bold text-gray-900">{formatPrice(agent.price)}</p>

            {/* Seller */}
            <div className="mt-2 flex items-center gap-2">
              {agent.seller.avatarUrl ? (
                <Image
                  src={agent.seller.avatarUrl}
                  alt={agent.seller.name || 'Seller'}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-gray-200" />
              )}
              <span className="text-xs text-gray-500">{agent.seller.name || 'Anonymous'}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
