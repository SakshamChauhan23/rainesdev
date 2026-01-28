import { logger } from '@/lib/logger'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, LayoutDashboard, Package, ExternalLink, AlertCircle, CheckCircle, TrendingUp, DollarSign, Eye, ShoppingBag, Sparkles, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { RequestUpdateButton } from '@/components/agent/request-update-button'
import { SellerReviews } from '@/components/dashboard/seller-reviews'
import { PerformanceCharts } from '@/components/dashboard/performance-charts'

export default async function DashboardPage({ searchParams }: { searchParams?: Promise<{ success?: string }> }) {
    const resolvedSearchParams = await searchParams
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    logger.info('🔍 Dashboard auth check:', { user: user?.email, error })

    if (!user) {
        // User not authenticated
        redirect('/login')
    }

    // User authenticated

    // Common where clause for user's agents
    const agentWhereClause = {
        sellerId: user.id,
        OR: [
            { isLatestVersion: true },
            {
                AND: [
                    { parentAgentId: { not: null } },
                    { status: { in: ['DRAFT' as const, 'UNDER_REVIEW' as const, 'REJECTED' as const] } }
                ]
            }
        ]
    };

    // Optimize: Calculate stats using aggregates and fetch agents in parallel
    const [agents, statsData, approvedCount] = await Promise.all([
        // Fetch agent list for display
        prisma.agent.findMany({
            where: agentWhereClause,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                sellerId: true,
                categoryId: true,
                title: true,
                slug: true,
                shortDescription: true,
                price: true,
                status: true,
                viewCount: true,
                purchaseCount: true,
                updatedAt: true,
                version: true,
                hasActiveUpdate: true,
                parentAgentId: true,
                thumbnailUrl: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        }),
        // Calculate stats using aggregates (much faster than loading all data)
        prisma.agent.aggregate({
            where: agentWhereClause,
            _sum: {
                viewCount: true,
                purchaseCount: true
            }
        }),
        // Count approved agents
        prisma.agent.count({
            where: {
                ...agentWhereClause,
                status: 'APPROVED'
            }
        })
    ]);

    // Calculate total revenue (requires individual prices, but we already have agents loaded)
    const totalRevenue = agents.reduce((acc, agent) => acc + (agent.purchaseCount * Number(agent.price)), 0);

    const totalViews = statsData._sum.viewCount || 0;
    const totalSales = statsData._sum.purchaseCount || 0;
    const approvedAgents = approvedCount;

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-orange/5 via-brand-cream to-brand-teal/5 border-b border-brand-slate/10">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
                    <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-brand-teal/10 blur-3xl" />
                </div>

                <Container className="py-12">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 px-4 py-2 text-sm font-medium text-brand-orange">
                                <Sparkles className="h-4 w-4" />
                                <span>Seller Dashboard</span>
                            </div>
                            <h1 className="mb-2 text-4xl font-bold tracking-tight text-brand-slate">
                                Welcome back!
                            </h1>
                            <p className="text-brand-slate/60">
                                Manage your AI agents and track your performance
                            </p>
                        </div>
                        <Link href="/submit-agent">
                            <Button className="h-12 rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40 hover:-translate-y-0.5 transition-all">
                                <Plus className="mr-2 h-5 w-5" />
                                Create New Agent
                            </Button>
                        </Link>
                    </div>
                </Container>
            </div>

            <Container className="py-12">
                {/* Success Banner */}
                {resolvedSearchParams?.success === 'created' && (
                    <div className="mb-8 rounded-3xl bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 p-6 shadow-lg animate-fade-in">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30">
                                <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="mb-1 text-lg font-semibold text-green-900">
                                    Agent created successfully!
                                </p>
                                <p className="text-sm text-green-700">
                                    Preview your agent and submit it for review when ready.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Stats Grid */}
                <div className="mb-12">
                    <h2 className="mb-6 text-2xl font-bold text-brand-slate">Analytics Overview</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Total Revenue */}
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-orange to-brand-orange/90 p-6 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                            <div className="relative">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <p className="mb-1 text-sm font-medium text-white/80">Total Revenue</p>
                                <p className="text-3xl font-bold">{formatPrice(totalRevenue)}</p>
                                <div className="mt-3 flex items-center gap-1 text-xs text-white/70">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>From {totalSales} sales</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Views */}
                        <div className="group relative overflow-hidden rounded-3xl bg-white border-2 border-brand-slate/10 p-6 shadow-lg transition-all hover:shadow-xl hover:border-brand-teal/30 hover:-translate-y-1">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal/10">
                                <Eye className="h-6 w-6 text-brand-teal" />
                            </div>
                            <p className="mb-1 text-sm font-medium text-brand-slate/70">Total Views</p>
                            <p className="text-3xl font-bold text-brand-slate">{totalViews.toLocaleString()}</p>
                            <div className="mt-3 flex items-center gap-1 text-xs text-brand-slate/60">
                                <ArrowUpRight className="h-3 w-3" />
                                <span>Across all agents</span>
                            </div>
                        </div>

                        {/* Total Sales */}
                        <div className="group relative overflow-hidden rounded-3xl bg-white border-2 border-brand-slate/10 p-6 shadow-lg transition-all hover:shadow-xl hover:border-brand-orange/30 hover:-translate-y-1">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
                                <ShoppingBag className="h-6 w-6 text-brand-orange" />
                            </div>
                            <p className="mb-1 text-sm font-medium text-brand-slate/70">Total Sales</p>
                            <p className="text-3xl font-bold text-brand-slate">{totalSales}</p>
                            <div className="mt-3 flex items-center gap-1 text-xs text-brand-slate/60">
                                <TrendingUp className="h-3 w-3" />
                                <span>All time</span>
                            </div>
                        </div>

                        {/* Active Agents */}
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal to-brand-teal/90 p-6 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                            <div className="relative">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <Package className="h-6 w-6" />
                                </div>
                                <p className="mb-1 text-sm font-medium text-white/80">Active Agents</p>
                                <p className="text-3xl font-bold">{approvedAgents}</p>
                                <div className="mt-3 flex items-center gap-1 text-xs text-white/70">
                                    <LayoutDashboard className="h-3 w-3" />
                                    <span>Live on marketplace</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Charts */}
                {agents.length > 0 && (
                    <div className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold text-brand-slate">Performance Insights</h2>
                        <PerformanceCharts
                            agents={agents.map(agent => ({
                                title: agent.title,
                                viewCount: agent.viewCount,
                                purchaseCount: agent.purchaseCount,
                                price: Number(agent.price)
                            }))}
                        />
                    </div>
                )}

                {/* My Agents Section */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-brand-slate">My Agents</h2>
                        <Badge className="rounded-lg bg-brand-slate/10 text-brand-slate border-brand-slate/20">
                            {agents.length} Total
                        </Badge>
                    </div>

                    {agents.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-slate/20 bg-white p-8 text-center sm:min-h-[400px] sm:rounded-3xl sm:p-12">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 sm:mb-6 sm:h-16 sm:w-16 sm:rounded-2xl">
                                <Package className="h-6 w-6 text-brand-orange sm:h-8 sm:w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-brand-slate sm:text-xl">No agents yet</h3>
                            <p className="mb-4 max-w-sm text-sm text-brand-slate/60 sm:mb-6">
                                Start selling your AI workflows today. Create your first agent to get started.
                            </p>
                            <Link href="/submit-agent">
                                <Button className="h-11 rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90 sm:h-12">
                                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    Create Your First Agent
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className="group relative overflow-hidden rounded-2xl bg-white border-2 border-brand-slate/10 shadow-lg transition-all hover:shadow-xl hover:border-brand-teal/30 hover:-translate-y-1 sm:rounded-3xl"
                                >
                                    {/* Thumbnail */}
                                    {agent.thumbnailUrl && (
                                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-brand-orange/5 to-brand-teal/5">
                                            <img
                                                src={agent.thumbnailUrl}
                                                alt={agent.title}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                    )}

                                    <div className="p-4 sm:p-6">
                                        {/* Status & Version Badges */}
                                        <div className="mb-3 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-2">
                                            <StatusBadge status={agent.status as any} />
                                            <Badge className="rounded-lg bg-brand-slate/10 text-brand-slate border-brand-slate/20 text-xs">
                                                v{agent.version}
                                            </Badge>
                                            <Badge className="ml-auto rounded-lg bg-brand-orange/10 text-brand-orange border-brand-orange/20 text-xs font-semibold sm:text-sm">
                                                {formatPrice(Number(agent.price))}
                                            </Badge>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="mb-2 text-lg font-bold text-brand-slate line-clamp-1 sm:text-xl">
                                            {agent.title}
                                        </h3>
                                        <p className="mb-3 text-sm text-brand-slate/60 line-clamp-2 sm:mb-4">
                                            {agent.shortDescription}
                                        </p>

                                        {/* Update Warning */}
                                        {agent.status === 'APPROVED' && agent.hasActiveUpdate && (
                                            <div className="mb-4 flex items-start gap-2 rounded-2xl bg-amber-50 border-2 border-amber-200 p-3">
                                                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-amber-800">
                                                    <strong>Hidden from marketplace.</strong> Update under review.
                                                </p>
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="mb-4 flex items-center gap-3 rounded-xl bg-brand-cream p-3 sm:mb-6 sm:gap-4 sm:rounded-2xl sm:p-4">
                                            <div className="flex-1 text-center">
                                                <p className="text-xl font-bold text-brand-slate sm:text-2xl">{agent.viewCount}</p>
                                                <p className="text-xs text-brand-slate/60">Views</p>
                                            </div>
                                            <div className="h-6 w-px bg-brand-slate/10 sm:h-8" />
                                            <div className="flex-1 text-center">
                                                <p className="text-xl font-bold text-brand-slate sm:text-2xl">{agent.purchaseCount}</p>
                                                <p className="text-xs text-brand-slate/60">Sales</p>
                                            </div>
                                        </div>

                                        {/* Last Updated */}
                                        <div className="mb-3 text-xs text-brand-slate/50 sm:mb-4">
                                            Updated {new Date(agent.updatedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 border-t-2 border-brand-slate/10 pt-3 sm:pt-4">
                                            <Button variant="outline" size="sm" className="flex-1 rounded-xl border-2 hover:border-brand-teal hover:bg-brand-teal/5" asChild>
                                                <Link href={`/agents/${agent.slug}`}>
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    View
                                                </Link>
                                            </Button>

                                            {agent.status === 'DRAFT' && (
                                                <Button size="sm" className="flex-1 rounded-xl bg-brand-orange text-white hover:bg-brand-orange/90" asChild>
                                                    <Link href={`/dashboard/agents/${agent.id}/edit`}>
                                                        Edit & Submit
                                                    </Link>
                                                </Button>
                                            )}
                                            {agent.status === 'REJECTED' && (
                                                <Button size="sm" className="flex-1 rounded-xl bg-red-500 text-white hover:bg-red-600" asChild>
                                                    <Link href={`/dashboard/agents/${agent.id}/edit`}>
                                                        Fix & Resubmit
                                                    </Link>
                                                </Button>
                                            )}
                                            {agent.status === 'UNDER_REVIEW' && (
                                                <Button size="sm" className="flex-1 rounded-xl bg-brand-slate/20 text-brand-slate" disabled>
                                                    Under Review
                                                </Button>
                                            )}
                                            {agent.status === 'APPROVED' && !agent.hasActiveUpdate && (
                                                <RequestUpdateButton
                                                    agentId={agent.id}
                                                    agentTitle={agent.title}
                                                />
                                            )}
                                            {agent.status === 'APPROVED' && agent.hasActiveUpdate && (
                                                <Button size="sm" className="flex-1 rounded-xl bg-brand-slate/20 text-brand-slate" disabled>
                                                    Update Pending
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="mt-16">
                    <h2 className="mb-6 text-2xl font-bold text-brand-slate">Customer Reviews</h2>
                    <SellerReviews sellerId={user.id} />
                </div>
            </Container>
        </div>
    )
}
