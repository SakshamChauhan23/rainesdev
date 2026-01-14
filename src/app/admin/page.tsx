import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/user-sync'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Eye,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { formatPrice } from '@/lib/utils'
import { AdminAgentActions } from '@/components/admin/admin-agent-actions'

export default async function AdminDashboard() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/admin')
  }

  // Check if user is admin
  const prismaUser = await getUserWithRole(user.id)

  if (!prismaUser || prismaUser.role !== 'ADMIN') {
    redirect('/agents') // Redirect non-admins to marketplace
  }

  // Fetch pending agents (UNDER_REVIEW status)
  const pendingAgents = await prisma.agent.findMany({
    where: {
      status: 'UNDER_REVIEW',
    },
    include: {
      seller: {
        select: {
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Fetch recently approved/rejected agents
  const recentActions = await prisma.agent.findMany({
    where: {
      OR: [{ status: 'APPROVED' }, { status: 'REJECTED' }],
      approvedAt: {
        not: null,
      },
    },
    include: {
      seller: {
        select: {
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      approvedAt: 'desc',
    },
    take: 10,
  })

  // Stats
  const stats = await prisma.$transaction([
    prisma.agent.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.agent.count({ where: { status: 'APPROVED' } }),
    prisma.agent.count({ where: { status: 'REJECTED' } }),
    prisma.user.count({ where: { role: 'SELLER' } }),
    prisma.user.count({ where: { role: 'BUYER' } }),
    prisma.purchase.count({ where: { status: 'COMPLETED' } }),
  ])

  const [pendingCount, approvedCount, rejectedCount, sellerCount, buyerCount, purchaseCount] = stats

  // Get total views across all agents
  const totalViewsResult = await prisma.agent.aggregate({
    _sum: {
      viewCount: true,
    },
  })
  const totalViews = totalViewsResult._sum.viewCount || 0

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b border-brand-slate/10 bg-gradient-to-br from-brand-orange/5 via-brand-cream to-brand-teal/5">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-brand-teal/10 blur-3xl" />
        </div>

        <Container className="py-12">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange">
              <Shield className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-brand-slate">
              Platform Overview
            </h1>
            <p className="text-brand-slate/60">Manage agents, users, and review submissions</p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Analytics Stats Grid */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-brand-slate">Platform Analytics</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pending Review */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <p className="mb-1 text-sm font-medium text-white/80">Pending Review</p>
                <p className="text-3xl font-bold">{pendingCount}</p>
                <div className="mt-3 text-xs text-white/70">Agents awaiting approval</div>
              </div>
            </div>

            {/* Approved Agents */}
            <div className="group relative overflow-hidden rounded-3xl border-2 border-brand-slate/10 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:border-brand-teal/30 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="mb-1 text-sm font-medium text-brand-slate/70">Approved Agents</p>
              <p className="text-3xl font-bold text-brand-slate">{approvedCount}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-brand-slate/60">
                <TrendingUp className="h-3 w-3" />
                <span>Live on marketplace</span>
              </div>
            </div>

            {/* Total Purchases */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal to-brand-teal/90 p-6 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <p className="mb-1 text-sm font-medium text-white/80">Total Purchases</p>
                <p className="text-3xl font-bold">{purchaseCount}</p>
                <div className="mt-3 text-xs text-white/70">Completed transactions</div>
              </div>
            </div>

            {/* Active Sellers */}
            <div className="group relative overflow-hidden rounded-3xl border-2 border-brand-slate/10 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:border-brand-orange/30 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
                <Users className="h-6 w-6 text-brand-orange" />
              </div>
              <p className="mb-1 text-sm font-medium text-brand-slate/70">Active Sellers</p>
              <p className="text-3xl font-bold text-brand-slate">{sellerCount}</p>
              <div className="mt-3 text-xs text-brand-slate/60">Registered sellers</div>
            </div>

            {/* Total Buyers */}
            <div className="group relative overflow-hidden rounded-3xl border-2 border-brand-slate/10 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:border-brand-teal/30 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal/10">
                <Package className="h-6 w-6 text-brand-teal" />
              </div>
              <p className="mb-1 text-sm font-medium text-brand-slate/70">Total Buyers</p>
              <p className="text-3xl font-bold text-brand-slate">{buyerCount}</p>
              <div className="mt-3 text-xs text-brand-slate/60">Active marketplace users</div>
            </div>

            {/* Total Views */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-orange to-brand-orange/90 p-6 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Eye className="h-6 w-6" />
                </div>
                <p className="mb-1 text-sm font-medium text-white/80">Total Views</p>
                <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
                <div className="mt-3 text-xs text-white/70">Across all agents</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Agents Review Queue */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-slate">Pending Agent Reviews</h2>
            <Badge className="rounded-lg border-amber-200 bg-amber-100 text-amber-700">
              {pendingCount} {pendingCount !== 1 ? 'agents' : 'agent'} waiting
            </Badge>
          </div>

          {pendingAgents.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-brand-slate/10 bg-white p-12 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-brand-slate">All caught up!</h3>
              <p className="text-brand-slate/60">No agents pending review at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAgents.map(agent => (
                <div
                  key={agent.id}
                  className="group rounded-3xl border-2 border-brand-slate/10 bg-white p-6 shadow-lg transition-all hover:border-brand-orange/30 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-brand-slate">{agent.title}</h3>
                        <Badge className="rounded-lg border-brand-teal/20 bg-brand-teal/10 text-xs text-brand-teal">
                          {agent.category.name}
                        </Badge>
                        <Badge className="rounded-lg border-brand-slate/20 bg-brand-slate/10 text-xs text-brand-slate">
                          v{agent.version}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-brand-slate/70">{agent.shortDescription}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-brand-slate/60">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          By {agent.seller.name || agent.seller.email}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-brand-orange">
                          {formatPrice(Number(agent.price))}
                        </span>
                        <span>•</span>
                        <span>
                          Submitted{' '}
                          {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/agents/${agent.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-2 hover:border-brand-teal hover:bg-brand-teal/5"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </Link>
                      <AdminAgentActions agentId={agent.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Actions */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-slate">Recent Actions</h2>
            <Badge className="rounded-lg border-brand-slate/20 bg-brand-slate/10 text-brand-slate">
              Last 10 reviews
            </Badge>
          </div>

          {recentActions.length === 0 ? (
            <div className="rounded-3xl border-2 border-brand-slate/10 bg-white p-12 text-center">
              <p className="text-brand-slate/60">No recent actions</p>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-brand-slate/10 bg-white p-6 shadow-lg">
              <div className="space-y-4">
                {recentActions.map(agent => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-brand-cream p-4 transition-all hover:bg-brand-cream/70"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                          agent.status === 'APPROVED' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {agent.status === 'APPROVED' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-slate">{agent.title}</p>
                        <p className="text-sm text-brand-slate/60">
                          by {agent.seller.name || agent.seller.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={agent.status as any} />
                      <span className="text-sm text-brand-slate/50">
                        {agent.approvedAt &&
                          formatDistanceToNow(new Date(agent.approvedAt), { addSuffix: true })}
                      </span>
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
