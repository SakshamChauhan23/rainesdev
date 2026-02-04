'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
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

interface SimilarItemsSidebarProps {
  agents: Agent[]
  title?: string
}

export function SimilarItemsSidebar({
  agents,
  title = 'Similar items you might like',
}: SimilarItemsSidebarProps) {
  if (agents.length === 0) return null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="space-y-4">
        {agents.slice(0, 5).map(agent => (
          <Link
            key={agent.id}
            href={`/agents/${agent.slug}`}
            className="group flex gap-3"
            prefetch={true}
          >
            {/* Thumbnail */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {agent.thumbnailUrl ? (
                <Image
                  src={agent.thumbnailUrl}
                  alt={agent.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary">
                {agent.title}
              </h4>
              <div className="mt-1 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-1 text-sm font-bold text-gray-900">{formatPrice(agent.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
