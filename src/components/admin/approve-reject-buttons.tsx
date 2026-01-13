'use client'
import { logger } from '@/lib/logger'


import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { approveAgentVersion, rejectAgentVersion } from '@/app/dashboard/agents/actions'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ApproveRejectButtonsProps {
    agentId: string
    agentTitle: string
}

export function ApproveRejectButtons({ agentId, agentTitle }: ApproveRejectButtonsProps) {
    const [approveDialogOpen, setApproveDialogOpen] = useState(false)
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleApprove = () => {
        startTransition(async () => {
            try {
                await approveAgentVersion(agentId)
                router.push('/admin/review-queue')
                router.refresh()
            } catch (error) {
                logger.error('Failed to approve:', error)
                alert(error instanceof Error ? error.message : 'Failed to approve agent')
            }
        })
    }

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason')
            return
        }

        startTransition(async () => {
            try {
                await rejectAgentVersion(agentId, rejectionReason.trim())
                router.push('/admin/review-queue')
                router.refresh()
            } catch (error) {
                logger.error('Failed to reject:', error)
                alert(error instanceof Error ? error.message : 'Failed to reject agent')
            }
        })
    }

    return (
        <div className="flex gap-3">
            <Button
                onClick={() => setRejectDialogOpen(true)}
                variant="destructive"
                className="flex-1"
                disabled={isPending}
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                )}
                Reject
            </Button>

            <Button
                onClick={() => setApproveDialogOpen(true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isPending}
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Approve
            </Button>

            {/* Approve Confirmation Dialog */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Agent</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve "{agentTitle}"?
                            <br /><br />
                            This will make the agent live on the marketplace and visible to all buyers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveDialogOpen(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button onClick={handleApprove} disabled={isPending} className="bg-green-600 hover:bg-green-700">
                            {isPending ? 'Approving...' : 'Approve'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog with Reason */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Agent</DialogTitle>
                        <DialogDescription>
                            Please provide a clear reason for rejecting "{agentTitle}".
                            The seller will see this message and can resubmit after making changes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                            <Textarea
                                id="rejection-reason"
                                placeholder="e.g., The demo video is missing, or the workflow description is unclear..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="min-h-[120px]"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button onClick={handleReject} disabled={isPending || !rejectionReason.trim()} variant="destructive">
                            {isPending ? 'Rejecting...' : 'Reject Agent'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
