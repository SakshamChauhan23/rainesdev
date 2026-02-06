'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCheckoutSession } from './actions'
import { Container } from '@/components/layout/container'
import { Loader2 } from 'lucide-react'

export default function SubscribePage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initiateCheckout() {
      const result = await createCheckoutSession()

      if ('error' in result) {
        if (result.error === 'You already have an active subscription') {
          router.push('/library')
          return
        }
        setError(result.error)
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = result.url
    }

    initiateCheckout()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
            <h1 className="mb-2 text-xl font-bold text-red-900">Something went wrong</h1>
            <p className="mb-4 text-red-700">{error}</p>
            <a
              href="/pricing"
              className="text-sm font-medium text-brand-orange underline hover:no-underline"
            >
              Back to pricing
            </a>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-brand-orange" />
        <h1 className="mb-2 text-xl font-bold text-brand-slate">Setting up your subscription...</h1>
        <p className="text-brand-slate/60">Redirecting you to secure checkout</p>
      </Container>
    </div>
  )
}
