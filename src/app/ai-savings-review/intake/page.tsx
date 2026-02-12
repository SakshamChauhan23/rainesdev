import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { IntakeForm } from '@/components/savings-review/intake-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function IntakePage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    const params = await searchParams
    const tier = params?.tier || 'SNAPSHOT'
    redirect(`/login?next=/ai-savings-review/intake?tier=${tier}`)
  }

  const params = await searchParams
  const tier = params?.tier === 'FULL_REVIEW' ? 'FULL_REVIEW' : 'SNAPSHOT'

  // Check for existing active review
  const existingReview = await prisma.savingsReview.findFirst({
    where: {
      userId: user.id,
      status: { in: ['AWAITING_BOOKING', 'AWAITING_PAYMENT', 'PAID', 'IN_PROGRESS'] },
    },
  })

  if (existingReview) {
    redirect('/library')
  }

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
            <h1 className="mb-2 text-3xl font-bold text-brand-slate">
              Tell us about your business
            </h1>
            <p className="text-brand-slate/60">
              This helps our team prepare a personalized savings analysis for your consultation.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-brand-slate/10 bg-white p-8 shadow-lg">
            <IntakeForm tier={tier} />
          </div>
        </div>
      </Container>
    </div>
  )
}
