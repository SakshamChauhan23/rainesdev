import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/user-sync'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { formatPrice } from '@/lib/utils'
import { AdminAgentActions } from '@/components/admin/admin-agent-actions'

export default async function AdminDashboard() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

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
            status: 'UNDER_REVIEW'
        },
        include: {
            seller: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Fetch recently approved/rejected agents
    const recentActions = await prisma.agent.findMany({
        where: {
            OR: [
                { status: 'APPROVED' },
                { status: 'REJECTED' }
            ],
            approvedAt: {
                not: null
            }
        },
        include: {
            seller: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            approvedAt: 'desc'
        },
        take: 10
    })

    // Stats
    const stats = await prisma.$transaction([
        prisma.agent.count({ where: { status: 'UNDER_REVIEW' } }),
        prisma.agent.count({ where: { status: 'APPROVED' } }),
        prisma.agent.count({ where: { status: 'REJECTED' } }),
        prisma.user.count({ where: { role: 'SELLER' } }),
        prisma.user.count({ where: { role: 'BUYER' } }),
        prisma.purchase.count({ where: { status: 'COMPLETED' } })
    ])

    const [pendingCount, approvedCount, rejectedCount, sellerCount, buyerCount, purchaseCount] = stats

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="border-b bg-background p-6">
                <Container>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage agents, users, and review submissions
                    </p>
                </Container>
            </div>

            <Container className="py-8">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingCount}</div>
                            <p className="text-xs text-muted-foreground">Agents awaiting approval</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved Agents</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{approvedCount}</div>
                            <p className="text-xs text-muted-foreground">Live on marketplace</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                            <Badge variant="outline">{purchaseCount}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{sellerCount}</div>
                            <p className="text-xs text-muted-foreground">Active sellers</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Agents Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Pending Agent Reviews</CardTitle>
                        <CardDescription>
                            {pendingCount} agent{pendingCount !== 1 ? 's' : ''} waiting for review
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pendingAgents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-semibold mb-2">All caught up!</p>
                                <p className="text-sm text-muted-foreground">
                                    No agents pending review
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingAgents.map((agent) => (
                                    <div
                                        key={agent.id}
                                        className="flex items-start justify-between gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{agent.title}</h3>
                                                <Badge variant="outline" className="text-xs">
                                                    {agent.category.name}
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs">
                                                    v{agent.version}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {agent.shortDescription}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>By {agent.seller.name || agent.seller.email}</span>
                                                <span>•</span>
                                                <span>{formatPrice(Number(agent.price))}</span>
                                                <span>•</span>
                                                <span>Submitted {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Link href={`/agents/${agent.slug}`}>
                                                <Button variant="outline" size="sm">
                                                    Preview
                                                </Button>
                                            </Link>
                                            <AdminAgentActions agentId={agent.id} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Actions</CardTitle>
                        <CardDescription>
                            Recently approved or rejected agents
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentActions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No recent actions
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentActions.map((agent) => (
                                    <div
                                        key={agent.id}
                                        className="flex items-center justify-between gap-4 text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            {agent.status === 'APPROVED' ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                            <div>
                                                <p className="font-medium">{agent.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    by {agent.seller.name || agent.seller.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={agent.status === 'APPROVED' ? 'default' : 'destructive'}>
                                                {agent.status}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {agent.approvedAt && formatDistanceToNow(new Date(agent.approvedAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </div>
    )
}
