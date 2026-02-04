import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

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
  priority?: boolean // For above-the-fold images
}

export function AgentCard({ agent, priority = false }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.slug}`} className="group" prefetch={true}>
      <Card className="h-full border-gray-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#8DEC42] hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
          {agent.thumbnailUrl ? (
            <Image
              src={agent.thumbnailUrl}
              alt={agent.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
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
            <div className="relative h-5 w-5 flex-shrink-0">
              {agent.seller.avatarUrl ? (
                <Image
                  src={agent.seller.avatarUrl}
                  alt={agent.seller.name || 'Seller'}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                  {(agent.seller.name || 'S').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-sm font-light text-gray-700">{agent.seller.name}</span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-base font-normal text-black transition-colors group-hover:text-[#8DEC42]">
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
