import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { User } from 'lucide-react'

interface AgentCardProps {
  agent: {
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
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.slug}`} className="group">
      <Card className="h-full border-gray-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
          {agent.thumbnailUrl ? (
            <Image
              src={agent.thumbnailUrl}
              alt={agent.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl transition-transform group-hover:scale-110">🤖</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Seller */}
          <div className="mb-2 flex items-center space-x-2">
            {agent.seller.avatarUrl ? (
              <Image
                src={agent.seller.avatarUrl}
                alt={agent.seller.name || 'Seller'}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                <User className="h-3 w-3 text-gray-600" />
              </div>
            )}
            <span className="text-sm font-light text-gray-700">{agent.seller.name}</span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-base font-normal text-black transition-colors group-hover:text-brand-orange">
            {agent.title}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm font-light text-gray-700">
            {agent.shortDescription}
          </p>

          {/* Category Badge */}
          <Badge variant="secondary" className="mb-3 bg-gray-100 font-light text-gray-600">
            {agent.category.name}
          </Badge>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-gray-300 p-4">
          {/* Price */}
          <div className="text-base font-normal text-black">{formatPrice(Number(agent.price))}</div>
        </CardFooter>
      </Card>
    </Link>
  )
}
