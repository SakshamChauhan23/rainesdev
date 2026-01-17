'use client'
import { logger } from '@/lib/logger'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Share2, Eye, ShoppingCart, CheckCircle2, Check, Copy } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
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
import { PurchaseConfirmationModal } from './purchase-confirmation-modal'

interface AgentHeroProps {
  title: string
  shortDescription: string
  price: number
  category: { name: string; slug: string }
  viewCount: number
  purchaseCount: number
  agentId: string
  agentSlug: string
  isPurchased: boolean
  isApproved: boolean
  assistedSetupEnabled: boolean
}

export function AgentHero({
  title,
  shortDescription,
  price,
  category,
  viewCount,
  purchaseCount,
  agentId,
  agentSlug,
  isPurchased,
  isApproved,
  assistedSetupEnabled,
}: AgentHeroProps) {
  const [copied, setCopied] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const shareUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/agents/${agentSlug}` : ''

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  const handlePurchaseClick = () => {
    setPurchaseModalOpen(true)
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
      <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-start md:justify-between">
        {/* Left side - Agent info */}
        <div className="flex-1 space-y-4">
          <Link href={`/agents?category=${category.slug}`}>
            <Badge
              variant="secondary"
              className="mb-2 border border-brand-orange/20 bg-brand-orange/10 font-medium text-brand-orange transition-colors hover:bg-brand-orange/20"
            >
              {category.name}
            </Badge>
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-brand-slate sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg text-brand-slate/70">{shortDescription}</p>
          <div className="flex items-center gap-4 text-sm text-brand-slate/60">
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{viewCount} views</span>
            </div>
            <span className="text-brand-slate/30">|</span>
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4" />
              <span>{purchaseCount} purchases</span>
            </div>
          </div>
        </div>

        {/* Right side - Price and actions */}
        <div className="flex shrink-0 flex-col gap-4 rounded-2xl border border-brand-slate/10 bg-brand-cream p-6 md:min-w-[280px]">
          <div className="text-center">
            <div className="text-sm font-medium text-brand-slate/60">Price</div>
            <div className="text-4xl font-bold text-brand-orange">{formatPrice(price)}</div>
          </div>

          <div className="flex flex-col gap-2">
            {isPurchased ? (
              <Button
                size="lg"
                className="w-full bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20"
                disabled
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Already Unlocked
              </Button>
            ) : isApproved ? (
              <Button
                size="lg"
                className="w-full bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90"
                onClick={handlePurchaseClick}
              >
                Unlock Setup Guide
              </Button>
            ) : (
              <Button size="lg" className="w-full bg-gray-200 text-gray-500" disabled>
                Not Available
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full border-brand-slate/20 text-brand-slate hover:border-brand-orange hover:bg-brand-orange/5 hover:text-brand-orange"
              onClick={handleShare}
            >
              {copied ? (
                <Check className="mr-2 h-4 w-4 text-brand-orange" />
              ) : (
                <Share2 className="mr-2 h-4 w-4" />
              )}
              Share Agent
            </Button>
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
            <Button onClick={copyToClipboard} className="bg-brand-orange hover:bg-brand-orange/90">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          {copied && <p className="text-sm text-brand-orange">Link copied to clipboard!</p>}
        </DialogContent>
      </Dialog>

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmationModal
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        agentId={agentId}
        agentTitle={title}
        assistedSetupEnabled={assistedSetupEnabled}
      />
    </div>
  )
}
