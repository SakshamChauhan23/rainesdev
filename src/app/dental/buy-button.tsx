'use client'

import { useState } from 'react'
import { createDentalCheckoutSession } from './actions'

type Plan = 'SETUP' | 'STARTER' | 'STANDARD'

interface BuyButtonProps {
  plan: Plan
  className: string
  label?: string
}

export function BuyButton({ plan, className, label = 'Buy Now' }: BuyButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    const result = await createDentalCheckoutSession(plan)
    if ('error' in result) {
      setError(result.error)
      setLoading(false)
    } else {
      window.location.href = result.url
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? 'Redirecting to checkout…' : label}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-500">{error}</p>}
    </div>
  )
}
