'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface ReviewFormProps {
  agentId: string
  userId: string
  onSuccess?: () => void
}

export function ReviewForm({ agentId, userId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          agentId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to submit review')
        setIsSubmitting(false)
        return
      }

      // Success - reset form
      setRating(0)
      setComment('')
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError('An error occurred while submitting your review')
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
    >
      <h3 className="text-lg font-semibold">Leave a Review</h3>

      {/* Star Rating */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-gray-700">
          Your Rating{' '}
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </legend>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map(star => {
            const ratingLabel =
              star === 1
                ? 'Poor'
                : star === 2
                  ? 'Fair'
                  : star === 3
                    ? 'Good'
                    : star === 4
                      ? 'Very Good'
                      : 'Excellent'
            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`${star} star${star > 1 ? 's' : ''} - ${ratingLabel}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
        {rating > 0 && (
          <p className="mt-1 text-sm text-gray-600" aria-live="polite">
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        )}
      </fieldset>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="mb-2 block text-sm font-medium text-gray-700">
          Your Review (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with this agent and the business outcomes you achieved..."
          rows={4}
          maxLength={1000}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
        <p className="mt-1 text-sm text-gray-500">{comment.length}/1000 characters</p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="rounded-md border border-red-200 bg-red-50 p-3"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-brand-orange px-4 py-2 text-white transition-colors hover:bg-brand-orange disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
