import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/user-sync'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-800' },
  TRIALING: { label: 'Trial', className: 'bg-brand-teal/10 text-brand-teal' },
  PAST_DUE: { label: 'Past Due', className: 'bg-red-100 text-red-800' },
  CANCELED: { label: 'Canceled', className: 'bg-gray-100 text-gray-800' },
  EXPIRED: { label: 'Expired', className: 'bg-gray-100 text-gray-800' },
  LEGACY_GRACE: { label: 'Legacy', className: 'bg-brand-orange/10 text-brand-orange' },
}

export default async function AdminSubscribersPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/admin/subscribers')
  }

  const prismaUser = await getUserWithRole(user.id)
  if (!prismaUser || prismaUser.role !== 'ADMIN') {
    redirect('/agents')
  }

  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="border-b border-brand-slate/10 bg-gradient-to-br from-brand-orange/5 via-brand-cream to-brand-teal/5">
        <Container className="py-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange">
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-brand-slate">Subscribers</h1>
          <p className="text-brand-slate/60">{subscriptions.length} total subscriptions</p>
        </Container>
      </div>

      <Container className="py-8">
        {subscriptions.length === 0 ? (
          <div className="rounded-3xl border-2 border-brand-slate/10 bg-white p-12 text-center">
            <p className="text-brand-slate/60">No subscriptions yet</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border-2 border-brand-slate/10 bg-white shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-slate/10 bg-brand-cream/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-slate">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-slate">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-slate">
                    Period End
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-slate">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => {
                  const badge = STATUS_BADGES[sub.status] || {
                    label: sub.status,
                    className: 'bg-gray-100 text-gray-800',
                  }
                  const endDate =
                    sub.status === 'LEGACY_GRACE' ? sub.gracePeriodEnd : sub.currentPeriodEnd

                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-brand-slate/5 hover:bg-brand-cream/30"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-brand-slate">{sub.user.name || 'N/A'}</p>
                          <p className="text-sm text-brand-slate/60">{sub.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={badge.className}>{badge.label}</Badge>
                        {sub.cancelAtPeriodEnd && (
                          <Badge className="ml-2 bg-red-50 text-red-600">Canceling</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-slate/70">
                        {endDate ? format(endDate, 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-slate/70">
                        {format(sub.createdAt, 'MMM d, yyyy')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </div>
  )
}
