'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  createPortalSession,
  cancelSubscription,
  reactivateSubscription,
} from '@/app/subscribe/actions'
import { CreditCard, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AccountActionsProps {
  hasAccess: boolean
  isLegacy: boolean
  cancelAtPeriodEnd: boolean
}

export function AccountActions({ hasAccess, isLegacy, cancelAtPeriodEnd }: AccountActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleManageBilling = () => {
    startTransition(async () => {
      setError(null)
      const result = await createPortalSession()
      if ('error' in result) {
        setError(result.error)
        return
      }
      window.location.href = result.url
    })
  }

  const handleCancel = () => {
    startTransition(async () => {
      setError(null)
      const result = await cancelSubscription()
      if (!result.success) {
        setError(result.error || 'Failed to cancel')
        return
      }
      setShowCancelDialog(false)
      window.location.reload()
    })
  }

  const handleReactivate = () => {
    startTransition(async () => {
      setError(null)
      const result = await reactivateSubscription()
      if (!result.success) {
        setError(result.error || 'Failed to reactivate')
        return
      }
      window.location.reload()
    })
  }

  if (!hasAccess) return null

  return (
    <div className="space-y-3 border-t pt-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Legacy users see subscribe CTA */}
      {isLegacy ? (
        <a href="/subscribe">
          <Button className="w-full rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90">
            Subscribe to Continue Access
          </Button>
        </a>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Manage Billing */}
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={handleManageBilling}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            Manage Billing
          </Button>

          {/* Cancel or Reactivate */}
          {cancelAtPeriodEnd ? (
            <Button
              className="flex-1 rounded-xl bg-brand-teal font-semibold text-white hover:bg-brand-teal/90"
              onClick={handleReactivate}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reactivate Subscription
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setShowCancelDialog(true)}
              disabled={isPending}
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel subscription?</DialogTitle>
            <DialogDescription>
              You&apos;ll keep access until the end of your current billing period. You can
              reactivate anytime before then.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowCancelDialog(false)}>
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleCancel}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
