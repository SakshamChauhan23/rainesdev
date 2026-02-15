'use client'

import { useState } from 'react'
import { confirmBookingAndPay } from '@/app/ai-savings-review/book/actions'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, ExternalLink } from 'lucide-react'

export function BookingConfirmation({ reviewId }: { reviewId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProceedToPayment = async () => {
    setLoading(true)
    setError(null)

    const result = await confirmBookingAndPay()

    if ('error' in result) {
      setError(result.error)
      setLoading(false)
      return
    }

    window.location.href = result.url
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Book Call */}
      <div className="rounded-2xl border-2 border-brand-teal/20 bg-brand-teal/5 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal text-sm font-bold text-white">
            1
          </div>
          <h3 className="text-lg font-bold text-brand-slate">Book your consultation call</h3>
        </div>
        <p className="mb-4 text-brand-slate/70">
          Choose a time that works for you. Our AI strategy team will review your intake form before
          the call.
        </p>
        <a
          href="https://cal.com/rouze-team/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-3 font-semibold text-white shadow-lg shadow-brand-teal/30 transition-all hover:-translate-y-0.5 hover:bg-brand-teal/90"
        >
          Open Booking Calendar
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Step 2: Confirm & Pay */}
      <div className="rounded-2xl border-2 border-brand-orange/20 bg-brand-orange/5 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white">
            2
          </div>
          <h3 className="text-lg font-bold text-brand-slate">
            Confirm booking & proceed to payment
          </h3>
        </div>
        <p className="mb-4 text-brand-slate/70">
          Once you have booked your call, click below to complete your payment securely via Stripe.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          onClick={handleProceedToPayment}
          disabled={loading}
          size="lg"
          className="w-full rounded-2xl bg-brand-orange py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:bg-brand-orange/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Redirecting to payment...
            </>
          ) : (
            <>
              I Have Booked — Proceed to Payment
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
