'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { requestAgentUpdate } from '@/app/dashboard/agents/actions'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface RequestUpdateButtonProps {
    agentId: string
    agentTitle: string
}

export function RequestUpdateButton({ agentId, agentTitle }: RequestUpdateButtonProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleRequestUpdate = () => {
        startTransition(async () => {
            try {
                await requestAgentUpdate(agentId)
                // Action will redirect, so no need to handle success here
            } catch (error) {
                console.error('Failed to request update:', error)
                alert(error instanceof Error ? error.message : 'Failed to request update')
                setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full" variant="default">
                    Request Update
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Agent Update</DialogTitle>
                    <DialogDescription>
                        This will create a new draft version of "{agentTitle}" that you can edit and submit for review.
                        Your current approved version will remain live until the new version is approved.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleRequestUpdate} disabled={isPending}>
                        {isPending ? 'Creating...' : 'Continue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
