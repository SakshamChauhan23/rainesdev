'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { processTestPurchase } from '@/app/checkout/actions'
import { useRouter } from 'next/navigation'
import { Loader2, ShoppingCart } from 'lucide-react'

interface CheckoutConfirmButtonProps {
    agentId: string
    agentSlug: string
}

export function CheckoutConfirmButton({ agentId, agentSlug }: CheckoutConfirmButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleConfirm = () => {
        setError(null)
        startTransition(async () => {
            try {
                const result = await processTestPurchase(agentId)

                if (result.success) {
                    // Redirect to agent page with success param
                    router.push(result.redirectUrl!)
                    router.refresh()
                } else {
                    setError(result.error || 'Purchase failed')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            }
        })
    }

    return (
        <div className="space-y-3">
            {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <Button
                onClick={handleConfirm}
                disabled={isPending}
                className="w-full"
                size="lg"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Confirm & Unlock (Test Mode)
                    </>
                )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                By confirming, you agree to our Terms of Service and Refund Policy
            </p>
        </div>
    )
}
