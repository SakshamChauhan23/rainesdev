'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Share2,
  Heart,
  Check,
  Copy,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface ProductInfoProps {
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

export function ProductInfo({
  title,
  shortDescription,
  category,
  viewCount,
  purchaseCount,
  agentId,
  agentSlug,
  hasAccess,
  isApproved,
}: ProductInfoProps) {
  const [copied, setCopied] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
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
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Badge + Setup Tag */}
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/agents?category=${category.slug}`}>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary transition-colors hover:bg-primary/20"
          >
            {category.name}
          </Badge>
        </Link>
        <Badge className="border-brand-teal/20 bg-brand-teal/10 text-brand-teal">
          <Wrench className="mr-1 h-3 w-3" />
          Setup completed by Rouze.ai team
        </Badge>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>

      {/* Typical Results */}
      <div className="rounded-2xl border border-brand-teal/20 bg-brand-teal/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand-teal" />
          <span className="text-sm font-semibold text-brand-slate">
            Typical results after 2 weeks:
          </span>
        </div>
        <ul className="space-y-2 text-sm text-brand-slate/80">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-brand-teal" />
            Saves ~6–10 hours/week
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-brand-teal" />
            Handles ~40–60% of support tickets
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-brand-teal" />
            Reduces manual follow-ups by ~30%
          </li>
        </ul>
      </div>

      {/* Included Badge */}
      <div className="border-b border-t border-gray-100 py-4">
        <Badge className="border-brand-teal/20 bg-brand-teal/10 px-3 py-1 text-sm font-medium text-brand-teal">
          Included with Rouze.ai
        </Badge>
      </div>

      {/* Description */}
      <p className="leading-relaxed text-gray-600">{shortDescription}</p>

      {/* Features List */}
      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 text-secondary" />
          <span>Instant access to setup guide</span>
        </li>
        <li className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-secondary" />
          <span>Included with subscription</span>
        </li>
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-secondary" />
          <span>Access all agents instantly</span>
        </li>
      </ul>

      {/* Action Buttons */}
      <div className="space-y-3">
        {hasAccess ? (
          <a href="#setup-guide">
            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Access Setup Guide
            </Button>
          </a>
        ) : isApproved ? (
          <Link href="/subscribe">
            <Button size="lg" className="w-full bg-primary text-white hover:bg-primary/90">
              Subscribe to Unlock — $12.99/mo
            </Button>
          </Link>
        ) : (
          <Button size="lg" className="w-full" disabled>
            Not Available
          </Button>
        )}

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            {isWishlisted ? 'Saved' : 'Save'}
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleShare}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-secondary" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 border-t border-gray-100 pt-4">
        <div className="text-center">
          <Shield className="mx-auto h-6 w-6 text-gray-400" />
          <p className="mt-1 text-xs text-gray-500">Secure Checkout</p>
        </div>
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-6 w-6 text-gray-400" />
          <p className="mt-1 text-xs text-gray-500">Verified Agent</p>
        </div>
        <div className="text-center">
          <Zap className="mx-auto h-6 w-6 text-gray-400" />
          <p className="mt-1 text-xs text-gray-500">Instant Access</p>
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
              {copied ? <Check className="h-4 w-4 text-secondary" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          {copied && <p className="text-sm text-secondary">Link copied to clipboard!</p>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
