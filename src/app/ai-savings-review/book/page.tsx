import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { BookingConfirmation } from '@/components/savings-review/booking-confirmation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BookPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/ai-savings-review/book')
  }

  // Find user's review that needs booking/payment
  const review = await prisma.savingsReview.findFirst({
    where: {
      userId: user.id,
      status: { in: ['AWAITING_BOOKING', 'AWAITING_PAYMENT'] },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!review) {
    redirect('/ai-savings-review')
  }

  const tierLabel = review.tier === 'SNAPSHOT' ? 'Snapshot ($499)' : 'Full Review ($999)'

  return (
    <div className="min-h-screen bg-brand-cream">
      <Container className="py-12">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/ai-savings-review"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-slate/60 transition-colors hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to AI Savings Review
          </Link>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-brand-slate">Book & Pay</h1>
            <p className="text-brand-slate/60">
              You are booking an{' '}
              <span className="font-semibold text-brand-orange">{tierLabel}</span> for{' '}
              <span className="font-semibold text-brand-slate">{review.companyName}</span>.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-brand-slate/10 bg-white p-8 shadow-lg">
            <BookingConfirmation reviewId={review.id} />
          </div>
        </div>
      </Container>
    </div>
  )
}
