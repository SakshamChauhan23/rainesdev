'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Star,
  CheckCircle2,
  Share2,
  Heart,
  Check,
  Copy,
  ShoppingCart,
  Zap,
  Shield,
  Clock,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PurchaseConfirmationModal } from './purchase-confirmation-modal'

interface ProductInfoProps {
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
  reviewStats?: { averageRating: number; totalReviews: number } | null
}

export function ProductInfo({
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
  reviewStats,
}: ProductInfoProps) {
  const [copied, setCopied] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
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
      console.error('Failed to copy:', err)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Badge */}
      <Link href={`/agents?category=${category.slug}`}>
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary transition-colors hover:bg-primary/20"
        >
          {category.name}
        </Badge>
      </Link>

      {/* Title */}
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>

      {/* Rating & Stats */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {reviewStats && reviewStats.totalReviews > 0 ? (
          <>
            {renderStars(reviewStats.averageRating)}
            <span className="font-medium text-primary">{reviewStats.averageRating.toFixed(1)}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{reviewStats.totalReviews} reviews</span>
          </>
        ) : (
          <span className="text-gray-500">No reviews yet</span>
        )}
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">{purchaseCount} purchases</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">{viewCount} views</span>
      </div>

      {/* Price */}
      <div className="border-b border-t border-gray-100 py-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(price)}</span>
          {price > 0 && <span className="text-sm text-gray-500">one-time payment</span>}
        </div>
        {assistedSetupEnabled && (
          <p className="mt-1 text-sm text-secondary">
            <Zap className="mr-1 inline h-4 w-4" />
            Assisted setup available
          </p>
        )}
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
          <span>Secure payment processing</span>
        </li>
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-secondary" />
          <span>Lifetime access to updates</span>
        </li>
      </ul>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isPurchased ? (
          <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90" disabled>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Already Unlocked
          </Button>
        ) : isApproved ? (
          <>
            <Button
              size="lg"
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={handlePurchaseClick}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Unlock Now - {formatPrice(price)}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-secondary text-secondary hover:bg-secondary/10"
              onClick={handlePurchaseClick}
            >
              <Zap className="mr-2 h-5 w-5" />
              Buy with Assisted Setup
            </Button>
          </>
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
