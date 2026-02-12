import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

type SavingsReviewForCard = {
  id: string
  tier: 'SNAPSHOT' | 'FULL_REVIEW'
  status: string
  companyName: string
  deliverableUrl: string | null
  createdAt: Date
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  AWAITING_BOOKING: {
    label: 'Book Call',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Calendar,
  },
  AWAITING_PAYMENT: {
    label: 'Payment Needed',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: CreditCard,
  },
  PAID: {
    label: 'Paid — In Queue',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Clock,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
    icon: FileText,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
}

export function SavingsReviewStatusCard({ review }: { review: SavingsReviewForCard }) {
  const config = statusConfig[review.status] || statusConfig.PAID
  const Icon = config.icon
  const tierLabel = review.tier === 'SNAPSHOT' ? 'Snapshot' : 'Full Review'

  return (
    <div className="rounded-3xl border-2 border-brand-orange/20 bg-gradient-to-br from-brand-orange/5 to-brand-teal/5 p-6 shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-medium text-brand-slate/60">AI Savings Review</span>
            <Badge variant="outline" className="text-xs">
              {tierLabel}
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-brand-slate">{review.companyName}</h3>
        </div>
        <Badge className={`border ${config.color}`}>
          <Icon className="mr-1 h-3 w-3" />
          {config.label}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {review.status === 'AWAITING_BOOKING' && (
          <Link href="/ai-savings-review/book">
            <Button
              size="sm"
              className="rounded-xl bg-brand-orange text-white shadow-sm hover:bg-brand-orange/90"
            >
              Book Call Now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
        {review.status === 'AWAITING_PAYMENT' && (
          <Link href="/ai-savings-review/book">
            <Button
              size="sm"
              className="rounded-xl bg-brand-orange text-white shadow-sm hover:bg-brand-orange/90"
            >
              Complete Payment
              <CreditCard className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
        {review.status === 'COMPLETED' && review.deliverableUrl && (
          <a href={review.deliverableUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              className="rounded-xl bg-brand-teal text-white shadow-sm hover:bg-brand-teal/90"
            >
              View Report
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </a>
        )}
        {(review.status === 'PAID' || review.status === 'IN_PROGRESS') && (
          <p className="text-sm text-brand-slate/60">
            Our team is working on your review. We will notify you when it is ready.
          </p>
        )}
      </div>
    </div>
  )
}
