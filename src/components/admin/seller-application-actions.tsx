'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import {
  approveSellerApplication,
  rejectSellerApplication,
} from '@/app/admin/seller-applications/actions'
import { useRouter } from 'next/navigation'

interface SellerApplicationActionsProps {
  applicationId: string
  applicantName: string
}

export function SellerApplicationActions({
  applicationId,
  applicantName,
}: SellerApplicationActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleApprove = () => {
    setError(null)
    startTransition(async () => {
      const result = await approveSellerApplication(applicationId)
      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  const handleReject = () => {
    setError(null)
    startTransition(async () => {
      const result = await rejectSellerApplication(applicationId, rejectionReason)
      if (result.error) {
        setError(result.error)
      } else {
        setRejectDialogOpen(false)
        setRejectionReason('')
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button
        onClick={handleApprove}
        disabled={isPending}
        size="sm"
        className="rounded-xl bg-green-600 hover:bg-green-700"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        Approve
      </Button>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            className="rounded-xl border-2 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {applicantName}&apos;s seller application. This
              feedback will be shown to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Please explain why this application is being rejected..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">Minimum 10 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isPending || rejectionReason.length < 10}
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
