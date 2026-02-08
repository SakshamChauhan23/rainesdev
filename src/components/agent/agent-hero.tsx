'use client'
import { logger } from '@/lib/logger'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Share2, CheckCircle2, Check, Copy, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface AgentHeroProps {
  title: string
  shortDescription: string
  category: { name: string; slug: string }
  viewCount: number
  purchaseCount: number
  agentId: string
  agentSlug: string
  hasAccess: boolean
  isApproved: boolean
}

export function AgentHero({
  title,
  shortDescription,
  category,
  viewCount,
  purchaseCount,
  agentId,
  agentSlug,
  hasAccess,
  isApproved,
}: AgentHeroProps) {
  const [copied, setCopied] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const shareUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/agents/${agentSlug}` : ''

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShareDialogOpen(false)
      }, 1500)
    } catch (err) {
      logger.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-gray-300 pb-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Link href={`/agents?category=${category.slug}`}>
              <Badge
                variant="secondary"
                className="bg-gray-100 font-light text-gray-600 transition-colors hover:bg-[#8DEC42]/10 hover:text-[#8DEC42]"
              >
                {category.name}
              </Badge>
            </Link>
            <Badge className="border-brand-teal/20 bg-brand-teal/10 text-brand-teal">
              <Wrench className="mr-1 h-3 w-3" />
              Setup completed by Rouze.ai team
            </Badge>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-black sm:text-4xl">{title}</h1>
          <p className="max-w-2xl text-lg font-light text-gray-700">{shortDescription}</p>
          <div className="flex items-center gap-4 text-sm font-light text-gray-600">
            <span>{viewCount} views</span>
            <span>•</span>
            <span>{purchaseCount} purchases</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col md:items-end">
          <Badge className="border-brand-teal/20 bg-brand-teal/10 px-3 py-1 text-sm font-medium text-brand-teal">
            Included with Rouze.ai
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-gray-300 text-gray-600 hover:border-[#8DEC42] hover:bg-[#8DEC42]/10 hover:text-[#8DEC42]"
              onClick={handleShare}
              title="Share this agent"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
            {hasAccess ? (
              <a href="#setup-guide">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 sm:w-auto">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  View Setup Guide
                </Button>
              </a>
            ) : isApproved ? (
              <Link href="/subscribe">
                <Button
                  size="lg"
                  className="w-full bg-[#8DEC42] font-normal hover:bg-[#7ACC3B] sm:w-auto"
                >
                  Subscribe to Access
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="w-full bg-[#D1D5DB] text-gray-600 sm:w-auto" disabled>
                Not Available
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this agent</DialogTitle>
            <DialogDescription>
              Copy the link below to share this agent with others
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button onClick={copyToClipboard} size="icon">
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          {copied && <p className="text-sm text-green-600">Link copied to clipboard!</p>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
