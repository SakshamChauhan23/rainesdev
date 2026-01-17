'use client'
import { logger } from '@/lib/logger'

import { useEffect, useState } from 'react'
import { ReviewForm } from './review-form'
import { ReviewList, Review, ReviewStats, ReviewPagination } from './review-list'
import { AlertCircle, Clock } from 'lucide-react'

// Props including optional server-preloaded data (P2.27)
interface ReviewSectionProps {
  agentId: string
  userId: string | null
  userRole?: string
  // Server-preloaded review data (P2.27)
  initialReviews?: Review[]
  initialStats?: ReviewStats | null
  initialPagination?: ReviewPagination | null
}

interface EligibilityResponse {
  eligible: boolean
  reason?: string
  message: string
  eligibilityDate?: string
  daysRemaining?: number
  agentVersionId?: string
}

export function ReviewSection({
  agentId,
  userId,
  userRole,
  initialReviews,
  initialStats,
  initialPagination,
}: ReviewSectionProps) {
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (userId && userRole === 'BUYER') {
      checkEligibility()
    } else {
      setLoading(false)
    }
  }, [userId, agentId, userRole])

  const checkEligibility = async () => {
    try {
      const response = await fetch(`/api/reviews/eligibility?userId=${userId}&agentId=${agentId}`)

      // Check response status (P2.7)
      if (!response.ok) {
        logger.error('Error checking review eligibility: HTTP', response.status)
        setEligibility({ eligible: false, message: 'Failed to check eligibility' })
        return
      }

      const data = await response.json()

      if (data.success) {
        setEligibility(data)
      } else {
        // Handle API error response
        setEligibility({ eligible: false, message: data.error || 'Failed to check eligibility' })
      }
    } catch (error) {
      logger.error('Error checking review eligibility:', error)
      setEligibility({ eligible: false, message: 'Failed to check eligibility' })
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmitted = () => {
    // Refresh eligibility and review list
    checkEligibility()
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      {/* Review Form Section - Only for buyers */}
      {userId && userRole === 'BUYER' && (
        <div>
          {loading ? (
            <div className="flex h-64 animate-pulse items-center justify-center rounded-lg bg-gray-100">
              <p className="text-sm text-gray-500">Loading review eligibility...</p>
            </div>
          ) : eligibility?.eligible ? (
            <ReviewForm agentId={agentId} userId={userId} onSuccess={handleReviewSubmitted} />
          ) : eligibility?.reason === 'NO_PURCHASE' ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Purchase Required</h4>
                  <p className="mt-1 text-sm text-blue-700">{eligibility.message}</p>
                </div>
              </div>
            </div>
          ) : eligibility?.reason === 'TOO_SOON' ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-900">Review Coming Soon</h4>
                  <p className="mt-1 text-sm text-yellow-700">{eligibility.message}</p>
                  <p className="mt-2 text-xs text-yellow-600">
                    This ensures reviews are based on real usage and outcomes.
                  </p>
                </div>
              </div>
            </div>
          ) : eligibility?.reason === 'ALREADY_REVIEWED' ? (
            <div className="rounded-lg border border-brand-orange/20 bg-brand-orange/5 p-6">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" />
                <div>
                  <h4 className="font-medium text-brand-slate">Review Submitted</h4>
                  <p className="mt-1 text-sm text-brand-orange">{eligibility.message}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Reviews Display - Visible to everyone */}
      {/* Pass server-preloaded data to avoid client-side fetch on initial load (P2.27) */}
      <ReviewList
        agentId={agentId}
        refreshTrigger={refreshTrigger}
        initialReviews={initialReviews}
        initialStats={initialStats}
        initialPagination={initialPagination}
      />
    </div>
  )
}
