'use client'
import { logger } from '@/lib/logger'

import { useEffect, useState } from 'react'
import { Star, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Review {
  id: string
  rating: number
  comment: string | null
  verifiedPurchase: boolean
  createdAt: string
  buyer: {
    id: string
    name: string | null
    email: string
  }
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
}

interface ReviewListProps {
  agentId: string
  refreshTrigger?: number
}

export function ReviewList({ agentId, refreshTrigger = 0 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [agentId, refreshTrigger])

  const fetchReviews = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/reviews?agentId=${agentId}&limit=20`)

      // Check response status (P2.20)
      if (!response.ok) {
        logger.error('Error fetching reviews: HTTP', response.status)
        setError('Failed to load reviews. Please try again later.')
        return
      }

      const data = await response.json()

      if (data.success) {
        setReviews(data.data)
        setStats(data.stats)
      } else {
        setError(data.error || 'Failed to load reviews')
      }
    } catch (error) {
      logger.error('Error fetching reviews:', error)
      setError('Failed to load reviews. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
      </div>
    )
  }

  // Error state (P2.20)
  if (error) {
    return (
      <div className="rounded-lg border-2 border-red-200 bg-red-50 py-12 text-center">
        <p className="font-medium text-red-800">{error}</p>
        <button
          onClick={() => {
            setLoading(true)
            fetchReviews()
          }}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && stats.totalReviews > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="mt-1 flex justify-center">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {stats && stats.totalReviews > 0 ? `Reviews (${stats.totalReviews})` : 'Reviews'}
        </h3>

        {reviews.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
            <p className="text-gray-600">No reviews yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to review this agent after purchasing and using it!
            </p>
          </div>
        ) : (
          reviews.map(review => (
            <div
              key={review.id}
              className="space-y-3 rounded-lg border border-gray-200 bg-white p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {review.buyer.name || review.buyer.email.split('@')[0]}
                    </span>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment */}
              {review.comment && <p className="leading-relaxed text-gray-700">{review.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
