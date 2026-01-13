'use client'
import { logger } from '@/lib/logger'


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { submitAgentForReview } from '@/app/dashboard/agents/actions'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function SubmitConfirmationDialog({
    agentId,
    agentTitle,
    isOpen,
    onClose
}: {
    agentId: string
    agentTitle: string
    isOpen: boolean
    onClose: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleConfirm = async () => {
        setLoading(true)
        setError(null)

        try {
            await submitAgentForReview(agentId)
            onClose()
            router.refresh()
        } catch (err: any) {
            logger.error('Failed to submit agent:', err)
            setError(err.message || 'Failed to submit agent for review')
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit for Review?</DialogTitle>
                    <DialogDescription>
                        You're about to submit "{agentTitle}" for admin review.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Once submitted, you won't be able to edit this agent until the review is complete.
                        The admin will either approve or reject your submission.
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Submitting...' : 'Confirm Submission'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
