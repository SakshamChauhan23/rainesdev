'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { approveAgent, rejectAgent } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'
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

export function AdminAgentActions({ agentId }: { agentId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showRejectDialog, setShowRejectDialog] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')

    const handleApprove = async () => {
        setLoading(true)
        try {
            const result = await approveAgent(agentId)
            if (result.success) {
                router.refresh()
            } else {
                alert(result.error || 'Failed to approve agent')
            }
        } catch (error) {
            console.error('Error approving agent:', error)
            alert('Failed to approve agent')
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason')
            return
        }

        setLoading(true)
        try {
            const result = await rejectAgent(agentId, rejectionReason)
            if (result.success) {
                setShowRejectDialog(false)
                setRejectionReason('')
                router.refresh()
            } else {
                alert(result.error || 'Failed to reject agent')
            }
        } catch (error) {
            console.error('Error rejecting agent:', error)
            alert('Failed to reject agent')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex gap-2">
                <Button
                    onClick={handleApprove}
                    disabled={loading}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle className="h-4 w-4" />
                    )}
                </Button>
                <Button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={loading}
                    size="sm"
                    variant="destructive"
                >
                    <XCircle className="h-4 w-4" />
                </Button>
            </div>

            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Agent</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this agent. This will be sent to the seller.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="reason">Rejection Reason</Label>
                        <Textarea
                            id="reason"
                            placeholder="e.g., Missing setup guide details, unclear workflow, etc."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={loading || !rejectionReason.trim()}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reject Agent
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
