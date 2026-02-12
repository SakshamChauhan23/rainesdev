import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/user-sync'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { SavingsReviewsTable } from '@/components/admin/savings-reviews-table'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminSavingsReviewsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/admin/savings-reviews')
  }

  const prismaUser = await getUserWithRole(user.id)
  if (!prismaUser || prismaUser.role !== 'ADMIN') {
    redirect('/agents')
  }

  const reviews = await prisma.savingsReview.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  })

  const serializedReviews = reviews.map(r => ({
    ...r,
    amountPaid: r.amountPaid ? Number(r.amountPaid) : null,
    paidAt: r.paidAt?.toISOString() || null,
    completedAt: r.completedAt?.toISOString() || null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: undefined,
  }))

  const paidCount = reviews.filter(r => r.status === 'PAID').length
  const inProgressCount = reviews.filter(r => r.status === 'IN_PROGRESS').length
  const completedCount = reviews.filter(r => r.status === 'COMPLETED').length

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="border-b border-brand-slate/10 bg-gradient-to-br from-brand-orange/5 via-brand-cream to-brand-teal/5">
        <Container className="py-12">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-brand-slate/60 transition-colors hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
              <FileText className="h-6 w-6 text-brand-orange" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-slate">AI Savings Reviews</h1>
              <p className="text-brand-slate/60">Manage client review requests</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Badge className="bg-blue-100 text-blue-700">{paidCount} Paid</Badge>
            <Badge className="bg-brand-teal/10 text-brand-teal">
              {inProgressCount} In Progress
            </Badge>
            <Badge className="bg-green-100 text-green-700">{completedCount} Completed</Badge>
            <Badge className="bg-brand-slate/10 text-brand-slate">{reviews.length} Total</Badge>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <SavingsReviewsTable reviews={serializedReviews as any} />
      </Container>
    </div>
  )
}
