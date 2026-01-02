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

export default async function DashboardPage({ searchParams }: { searchParams?: { success?: string } }) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    console.log('🔍 Dashboard auth check:', { user: user?.email, error })

    if (!user) {
        console.log('❌ No user found, redirecting to /login')
        redirect('/login')
    }

    console.log('✅ User authenticated:', user.email)

    // Fetch user's agents
    const agents = await prisma.agent.findMany({
        where: {
            sellerId: user.id,
            OR: [
                { isLatestVersion: true },
                {
                    AND: [
                        { parentAgentId: { not: null } },
                        { status: { in: ['DRAFT', 'UNDER_REVIEW', 'REJECTED'] } }
                    ]
                }
            ]
        },
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
    })

    // Calculate stats
    const totalViews = agents.reduce((acc, agent) => acc + agent.viewCount, 0)
    const totalSales = agents.reduce((acc, agent) => acc + agent.purchaseCount, 0)
    const totalRevenue = agents.reduce((acc, agent) => acc + (agent.purchaseCount * Number(agent.price)), 0)
    const approvedAgents = agents.filter(a => a.status === 'APPROVED').length

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
                {searchParams?.success === 'created' && (
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
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-slate/20 bg-white p-12 text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange/10">
                                <Package className="h-8 w-8 text-brand-orange" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-brand-slate">No agents yet</h3>
                            <p className="mb-6 text-brand-slate/60 max-w-sm">
                                Start selling your AI workflows today. Create your first agent to get started.
                            </p>
                            <Link href="/submit-agent">
                                <Button className="h-12 rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create Your First Agent
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className="group relative overflow-hidden rounded-3xl bg-white border-2 border-brand-slate/10 shadow-lg transition-all hover:shadow-xl hover:border-brand-teal/30 hover:-translate-y-1"
                                >
                                    {/* Thumbnail */}
                                    {agent.thumbnailUrl && (
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-orange/5 to-brand-teal/5">
                                            <img
                                                src={agent.thumbnailUrl}
                                                alt={agent.title}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Status & Version Badges */}
                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            <StatusBadge status={agent.status as any} />
                                            <Badge className="rounded-lg bg-brand-slate/10 text-brand-slate border-brand-slate/20 text-xs">
                                                v{agent.version}
                                            </Badge>
                                            <Badge className="ml-auto rounded-lg bg-brand-orange/10 text-brand-orange border-brand-orange/20 font-semibold">
                                                {formatPrice(Number(agent.price))}
                                            </Badge>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="mb-2 text-xl font-bold text-brand-slate line-clamp-1">
                                            {agent.title}
                                        </h3>
                                        <p className="mb-4 text-sm text-brand-slate/60 line-clamp-2">
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
                                        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-brand-cream p-4">
                                            <div className="flex-1 text-center">
                                                <p className="text-2xl font-bold text-brand-slate">{agent.viewCount}</p>
                                                <p className="text-xs text-brand-slate/60">Views</p>
                                            </div>
                                            <div className="h-8 w-px bg-brand-slate/10" />
                                            <div className="flex-1 text-center">
                                                <p className="text-2xl font-bold text-brand-slate">{agent.purchaseCount}</p>
                                                <p className="text-xs text-brand-slate/60">Sales</p>
                                            </div>
                                        </div>

                                        {/* Last Updated */}
                                        <div className="mb-4 text-xs text-brand-slate/50">
                                            Updated {new Date(agent.updatedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 border-t-2 border-brand-slate/10 pt-4">
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
