'use client'
import { logger } from '@/lib/logger'


import { useEffect, useState } from 'react'
import { ReviewForm } from './review-form'
import { ReviewList } from './review-list'
import { AlertCircle, Clock } from 'lucide-react'

interface ReviewSectionProps {
  agentId: string
  userId: string | null
  userRole?: string
}

interface EligibilityResponse {
  eligible: boolean
  reason?: string
  message: string
  eligibilityDate?: string
  daysRemaining?: number
  agentVersionId?: string
}

export function ReviewSection({ agentId, userId, userRole }: ReviewSectionProps) {
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
      const data = await response.json()

      if (data.success) {
        setEligibility(data)
      }
    } catch (error) {
      logger.error('Error checking review eligibility:', error)
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
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ) : eligibility?.eligible ? (
            <ReviewForm
              agentId={agentId}
              userId={userId}
              onSuccess={handleReviewSubmitted}
            />
          ) : eligibility?.reason === 'NO_PURCHASE' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Purchase Required</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {eligibility.message}
                  </p>
                </div>
              </div>
            </div>
          ) : eligibility?.reason === 'TOO_SOON' ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Review Coming Soon</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    {eligibility.message}
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    This ensures reviews are based on real usage and outcomes.
                  </p>
                </div>
              </div>
            </div>
          ) : eligibility?.reason === 'ALREADY_REVIEWED' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Review Submitted</h4>
                  <p className="text-sm text-green-700 mt-1">
                    {eligibility.message}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Reviews Display - Visible to everyone */}
      <ReviewList agentId={agentId} refreshTrigger={refreshTrigger} />
    </div>
  )
}
