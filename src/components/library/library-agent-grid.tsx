'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type LibraryAgent = {
  id: string
  title: string
  slug: string
  shortDescription: string
  thumbnailUrl: string | null
  version: number
  category: { name: string }
}

export function LibraryAgentGrid({ agents }: { agents: LibraryAgent[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAgents = agents.filter(agent => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      agent.title.toLowerCase().includes(query) ||
      agent.shortDescription.toLowerCase().includes(query) ||
      agent.category.name.toLowerCase().includes(query)
    )
  })

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-slate/40" />
        <Input
          type="text"
          placeholder="Search agents by name, description, or category..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="h-12 rounded-2xl border-2 border-brand-slate/10 bg-white pl-12 pr-4 text-base transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
        />
      </div>

      {/* Results count */}
      {searchQuery.trim() && (
        <p className="mb-4 text-sm text-muted-foreground">
          {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
          {searchQuery.trim() && <> for &quot;{searchQuery.trim()}&quot;</>}
        </p>
      )}

      {/* Agent Grid */}
      {filteredAgents.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map(agent => (
            <Card key={agent.id} className="flex flex-col transition-colors hover:bg-muted/50">
              <CardHeader>
                {agent.thumbnailUrl && (
                  <img
                    src={agent.thumbnailUrl}
                    alt={agent.title}
                    className="mb-4 h-40 w-full rounded-lg object-cover"
                  />
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{agent.title}</CardTitle>
                    <CardDescription className="mt-1">{agent.category.name}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    v{agent.version}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {agent.shortDescription}
                </p>
              </CardContent>
              <div className="border-t p-4">
                <Link href={`/agents/${agent.slug}`}>
                  <Button className="w-full" variant="default">
                    View Setup Guide
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-slate/10 py-12 text-center">
          <Search className="mb-3 h-8 w-8 text-brand-slate/30" />
          <p className="text-lg font-medium text-brand-slate/60">No agents found</p>
          <p className="text-sm text-brand-slate/40">Try a different search term</p>
        </div>
      )}
    </>
  )
}
