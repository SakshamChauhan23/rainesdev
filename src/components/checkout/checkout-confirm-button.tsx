'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { processTestPurchase } from '@/app/checkout/actions'
import { useRouter } from 'next/navigation'
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react'

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
        <div className="space-y-4">
            {error && (
                <div className="flex items-center gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-600 animate-fade-in">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <Button
                onClick={handleConfirm}
                disabled={isPending}
                className="h-14 w-full rounded-xl bg-brand-teal font-semibold text-white shadow-lg shadow-brand-teal/30 hover:bg-brand-teal/90 hover:shadow-xl hover:shadow-brand-teal/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Confirm & Unlock
                    </>
                )}
            </Button>

            <p className="text-xs text-center text-white/60">
                By confirming, you agree to our{' '}
                <a href="#" className="text-brand-teal hover:text-brand-teal/80 transition-colors">
                    Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-brand-teal hover:text-brand-teal/80 transition-colors">
                    Refund Policy
                </a>
            </p>
        </div>
    )
}
