'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function WelcomeBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('subscribed') === 'true') {
      setShow(true)
      // Clean up the URL
      router.replace('/library', { scroll: false })
    }
  }, [searchParams, router])

  if (!show) return null

  return (
    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-brand-teal/20 bg-brand-teal/5 p-4">
      <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-teal" />
      <div className="flex-1">
        <p className="font-semibold text-brand-slate">Welcome to Rouze.ai!</p>
        <p className="text-sm text-brand-slate/70">
          Your subscription is active. You now have access to all AI agents below.
        </p>
      </div>
      <button
        onClick={() => setShow(false)}
        className="shrink-0 rounded-lg p-1 text-brand-slate/40 hover:bg-brand-slate/10 hover:text-brand-slate"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
