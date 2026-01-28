import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/user-sync'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, XCircle, Users, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { SellerApplicationActions } from '@/components/admin/seller-application-actions'

export default async function SellerApplicationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/admin/seller-applications')
  }

  const prismaUser = await getUserWithRole(user.id)

  if (!prismaUser || prismaUser.role !== 'ADMIN') {
    redirect('/agents')
  }

  // Fetch pending applications
  const pendingApplications = await prisma.sellerApplication.findMany({
    where: { status: 'PENDING_REVIEW' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' }, // Oldest first
  })

  // Fetch recently reviewed applications
  const recentlyReviewed = await prisma.sellerApplication.findMany({
    where: {
      status: { in: ['APPROVED', 'REJECTED'] },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviewer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { reviewedAt: 'desc' },
    take: 10,
  })

  // Stats
  const stats = await prisma.$transaction([
    prisma.sellerApplication.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.sellerApplication.count({ where: { status: 'APPROVED' } }),
    prisma.sellerApplication.count({ where: { status: 'REJECTED' } }),
  ])

  const [pendingCount, approvedCount, rejectedCount] = stats

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="border-b border-brand-slate/10 bg-white">
        <Container className="py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-brand-slate">Seller Applications</h1>
              <p className="text-sm text-brand-slate/60">Review and manage seller applications</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
                <p className="text-sm text-amber-600">Pending Review</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
                <p className="text-sm text-green-600">Approved</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{rejectedCount}</p>
                <p className="text-sm text-red-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-slate">Pending Applications</h2>
            <Badge className="rounded-lg border-amber-200 bg-amber-100 text-amber-700">
              {pendingCount} waiting
            </Badge>
          </div>

          {pendingApplications.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-brand-slate/10 bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-1 font-semibold text-brand-slate">All caught up!</h3>
              <p className="text-sm text-brand-slate/60">No pending applications to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map(app => (
                <div
                  key={app.id}
                  className="rounded-2xl border-2 border-brand-slate/10 bg-white p-6 shadow-sm transition-all hover:border-brand-orange/30 hover:shadow-md"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Applicant info */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
                          <Users className="h-6 w-6 text-brand-orange" />
                        </div>
                        <div>
                          <h3 className="font-bold text-brand-slate">{app.fullName}</h3>
                          <p className="text-sm text-brand-slate/60">{app.user.email}</p>
                        </div>
                        <Badge className="ml-2 rounded-lg border-amber-200 bg-amber-100 text-xs text-amber-700">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>

                      {/* Application details */}
                      <div className="space-y-3 rounded-xl bg-brand-cream/50 p-4">
                        <div>
                          <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">
                            Experience
                          </p>
                          <p className="text-sm text-brand-slate/80">{app.experience}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">
                            Agent Ideas
                          </p>
                          <p className="text-sm text-brand-slate/80">{app.agentIdeas}</p>
                        </div>
                        {app.relevantLinks && (
                          <div>
                            <p className="mb-1 text-xs font-medium uppercase text-brand-slate/50">
                              Relevant Links
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {app.relevantLinks
                                .split('\n')
                                .filter(Boolean)
                                .map((link, i) => (
                                  <a
                                    key={i}
                                    href={link.startsWith('http') ? link : `https://${link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg bg-brand-teal/10 px-2 py-1 text-xs text-brand-teal hover:bg-brand-teal/20"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    {link.length > 40 ? link.substring(0, 40) + '...' : link}
                                  </a>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-brand-slate/50">
                        <span>
                          Applied{' '}
                          {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                        </span>
                        <span>•</span>
                        <span>
                          Account created{' '}
                          {formatDistanceToNow(new Date(app.user.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <SellerApplicationActions
                        applicationId={app.id}
                        applicantName={app.fullName}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Reviewed */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-slate">Recently Reviewed</h2>
            <Badge className="rounded-lg border-brand-slate/20 bg-brand-slate/10 text-brand-slate">
              Last 10
            </Badge>
          </div>

          {recentlyReviewed.length === 0 ? (
            <div className="rounded-2xl border-2 border-brand-slate/10 bg-white p-8 text-center">
              <p className="text-brand-slate/60">No reviewed applications yet</p>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-brand-slate/10 bg-white p-4">
              <div className="space-y-2">
                {recentlyReviewed.map(app => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-xl bg-brand-cream/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          app.status === 'APPROVED' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {app.status === 'APPROVED' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-brand-slate">{app.fullName}</p>
                        <p className="text-xs text-brand-slate/50">{app.user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`rounded-lg text-xs ${
                          app.status === 'APPROVED'
                            ? 'border-green-200 bg-green-100 text-green-700'
                            : 'border-red-200 bg-red-100 text-red-700'
                        }`}
                      >
                        {app.status}
                      </Badge>
                      <p className="mt-1 text-xs text-brand-slate/50">
                        {app.reviewedAt &&
                          formatDistanceToNow(new Date(app.reviewedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
