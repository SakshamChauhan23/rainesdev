'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Loader2, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type SavingsReviewRow = {
  id: string
  tier: string
  status: string
  companyName: string
  industry: string
  companySize: string
  currentTools: string
  painPoints: string
  aiExperience: string
  goals: string
  additionalNotes: string | null
  amountPaid: number | null
  adminNotes: string | null
  deliverableUrl: string | null
  paidAt: string | null
  completedAt: string | null
  createdAt: string
  user: { name: string | null; email: string }
}

const statusOptions = ['AWAITING_BOOKING', 'AWAITING_PAYMENT', 'PAID', 'IN_PROGRESS', 'COMPLETED']

const statusColors: Record<string, string> = {
  AWAITING_BOOKING: 'bg-amber-100 text-amber-700',
  AWAITING_PAYMENT: 'bg-orange-100 text-orange-700',
  PAID: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-brand-teal/10 text-brand-teal',
  COMPLETED: 'bg-green-100 text-green-700',
}

function ReviewRow({ review: initialReview }: { review: SavingsReviewRow }) {
  const [expanded, setExpanded] = useState(false)
  const [review, setReview] = useState(initialReview)
  const [saving, setSaving] = useState(false)
  const [adminNotes, setAdminNotes] = useState(review.adminNotes || '')
  const [deliverableUrl, setDeliverableUrl] = useState(review.deliverableUrl || '')

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/savings-reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setReview(prev => ({ ...prev, status: newStatus }))
      }
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotes = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/savings-reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes, deliverableUrl: deliverableUrl || null }),
      })
      const data = await res.json()
      if (data.success) {
        setReview(prev => ({ ...prev, adminNotes, deliverableUrl }))
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border-2 border-brand-slate/10 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Summary Row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="font-bold text-brand-slate">{review.companyName}</p>
            <p className="text-sm text-brand-slate/60">
              {review.user.name || review.user.email} &middot;{' '}
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {review.tier === 'SNAPSHOT' ? 'Snapshot' : 'Full Review'}
          </Badge>
          <Badge className={statusColors[review.status] || 'bg-gray-100 text-gray-700'}>
            {review.status.replace(/_/g, ' ')}
          </Badge>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-brand-slate/40" />
          ) : (
            <ChevronDown className="h-5 w-5 text-brand-slate/40" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-brand-slate/10 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">Industry</p>
              <p className="text-sm text-brand-slate">{review.industry}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">Company Size</p>
              <p className="text-sm text-brand-slate">{review.companySize}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">
                AI Experience
              </p>
              <p className="text-sm text-brand-slate">{review.aiExperience}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">Amount Paid</p>
              <p className="text-sm text-brand-slate">
                {review.amountPaid ? `$${review.amountPaid}` : 'Not yet paid'}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">
                Current Tools
              </p>
              <p className="text-sm text-brand-slate/80">{review.currentTools}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">Pain Points</p>
              <p className="text-sm text-brand-slate/80">{review.painPoints}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">Goals</p>
              <p className="text-sm text-brand-slate/80">{review.goals}</p>
            </div>
            {review.additionalNotes && (
              <div>
                <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">
                  Additional Notes
                </p>
                <p className="text-sm text-brand-slate/80">{review.additionalNotes}</p>
              </div>
            )}
          </div>

          {/* Admin Controls */}
          <div className="mt-6 space-y-4 border-t border-brand-slate/10 pt-4">
            {/* Status Actions */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-brand-slate/50">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(s => (
                  <Button
                    key={s}
                    size="sm"
                    variant={review.status === s ? 'default' : 'outline'}
                    className="rounded-lg text-xs"
                    disabled={saving || review.status === s}
                    onClick={() => handleStatusChange(s)}
                  >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : s.replace(/_/g, ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase text-brand-slate/50">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border-2 border-brand-slate/10 bg-brand-cream px-4 py-3 text-sm text-brand-slate focus:border-brand-orange focus:outline-none"
                placeholder="Internal notes about this review..."
              />
            </div>

            {/* Deliverable URL */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase text-brand-slate/50">
                Deliverable URL
              </label>
              <div className="flex gap-2">
                <input
                  value={deliverableUrl}
                  onChange={e => setDeliverableUrl(e.target.value)}
                  type="url"
                  className="flex-1 rounded-xl border-2 border-brand-slate/10 bg-brand-cream px-4 py-3 text-sm text-brand-slate focus:border-brand-orange focus:outline-none"
                  placeholder="https://docs.google.com/..."
                />
                {deliverableUrl && (
                  <a href={deliverableUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="rounded-xl py-3">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>

            <Button
              onClick={handleSaveNotes}
              disabled={saving}
              className="rounded-xl bg-brand-orange text-white hover:bg-brand-orange/90"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function SavingsReviewsTable({ reviews }: { reviews: SavingsReviewRow[] }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-brand-slate/10 bg-white p-12 text-center">
        <p className="text-brand-slate/60">No savings review requests yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <ReviewRow key={review.id} review={review} />
      ))}
    </div>
  )
}
