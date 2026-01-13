'use client'
import { logger } from '@/lib/logger'


import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  buyer: {
    name: string | null
    email: string
  }
  agent: {
    title: string
    slug: string
    version: number
  }
}

interface AgentStats {
  agentId: string
  agentTitle: string
  agentSlug: string
  totalReviews: number
  averageRating: number
  reviews: Review[]
}

interface SellerReviewsProps {
  sellerId: string
}

export function SellerReviews({ sellerId }: SellerReviewsProps) {
  const [agentStats, setAgentStats] = useState<AgentStats[]>([])
  const [overallStats, setOverallStats] = useState<{
    totalReviews: number
    averageRating: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchReviews()
  }, [sellerId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/seller/reviews?sellerId=${sellerId}`)
      const data = await response.json()

      if (data.success) {
        setAgentStats(data.data.agentStats)
        setOverallStats(data.data.overallStats)
      }
    } catch (error) {
      logger.error('Error fetching seller reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAgent = (agentId: string) => {
    const newExpanded = new Set(expandedAgents)
    if (newExpanded.has(agentId)) {
      newExpanded.delete(agentId)
    } else {
      newExpanded.add(agentId)
    }
    setExpandedAgents(newExpanded)
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
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
  }

  if (!overallStats || overallStats.totalReviews === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Reviews will appear here after buyers use your agents
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Review Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {overallStats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mt-1">
                {renderStars(Math.round(overallStats.averageRating))}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{overallStats.totalReviews} total reviews</p>
              <p>{agentStats.length} agents reviewed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews by Agent */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews by Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentStats.map((stat) => (
              <div key={stat.agentId} className="border rounded-lg overflow-hidden">
                {/* Agent Header */}
                <button
                  onClick={() => toggleAgent(stat.agentId)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{stat.agentTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(Math.round(stat.averageRating))}
                        <span className="text-sm text-gray-600">
                          {stat.averageRating.toFixed(1)} ({stat.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {expandedAgents.has(stat.agentId) ? 'Hide' : 'Show'} reviews
                  </span>
                </button>

                {/* Reviews List */}
                {expandedAgents.has(stat.agentId) && (
                  <div className="p-4 space-y-3 bg-white">
                    {stat.reviews.map((review) => (
                      <div key={review.id} className="border-l-2 border-gray-200 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-600">
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              By: {review.buyer.name || review.buyer.email.split('@')[0]}
                            </p>
                            {review.comment && (
                              <p className="text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
