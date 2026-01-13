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

  useEffect(() => {
    fetchReviews()
  }, [agentId, refreshTrigger])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?agentId=${agentId}&limit=20`)
      const data = await response.json()

      if (data.success) {
        setReviews(data.data)
        setStats(data.stats)
      }
    } catch (error) {
      logger.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
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
        <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && stats.totalReviews > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mt-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {stats && stats.totalReviews > 0
            ? `Reviews (${stats.totalReviews})`
            : 'Reviews'}
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to review this agent after purchasing and using it!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-lg border border-gray-200 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {review.buyer.name || review.buyer.email.split('@')[0]}
                    </span>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                        <CheckCircle className="w-3 h-3" />
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
