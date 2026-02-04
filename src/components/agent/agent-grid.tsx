import { AgentCard } from './agent-card'
import { Skeleton } from '@/components/ui/skeleton'

interface Agent {
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

interface AgentGridProps {
  agents: Agent[]
  loading?: boolean
}

export function AgentGrid({ agents, loading }: AgentGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h3 className="mb-2 text-xl font-semibold">No agents found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search query to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent, index) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          priority={index < 6} // Prioritize first 6 images (above the fold)
        />
      ))}
    </div>
  )
}
