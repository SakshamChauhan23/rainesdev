
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, LayoutDashboard, Settings, Package, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { RequestUpdateButton } from '@/components/agent/request-update-button'

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
    // Show: 1) Latest versions (approved/under review)
    //       2) Draft versions that are updates to approved agents
    const agents = await prisma.agent.findMany({
        where: {
            sellerId: user.id,
            OR: [
                { isLatestVersion: true }, // Latest approved/under review versions
                {
                    AND: [
                        { parentAgentId: { not: null } }, // Has a parent (is an update)
                        { status: { in: ['DRAFT', 'UNDER_REVIEW', 'REJECTED'] } } // Not approved yet
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
    const totalRevenue = 0 // We don't have purchase amounts stored historically yet without a Purchases table query

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col">
            <div className="border-b bg-muted/40 p-8">
                <Container>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
                            <p className="text-muted-foreground">Manage your AI agents and track performance</p>
                        </div>
                        <Link href="/submit-agent">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Agent
                            </Button>
                        </Link>
                    </div>
                </Container>
            </div>

            <Container className="py-8">
                {/* Success Banner */}
                {searchParams?.success === 'created' && (
                    <Card className="mb-6 border-green-200 bg-green-50">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="rounded-full bg-green-100 p-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-green-900">
                                    Agent created successfully!
                                </p>
                                <p className="text-sm text-green-700">
                                    Preview your agent and submit it for review when ready.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Overview */}
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{agents.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalViews}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalSales}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Agents List */}
                <h2 className="mb-4 text-xl font-semibold">My Agents</h2>
                {agents.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Package className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No agents created yet</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                            Start selling your AI workflows today. Create your first agent to get started.
                        </p>
                        <Link href="/submit-agent">
                            <Button>Create Agent</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {agents.map((agent) => (
                            <Card key={agent.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={agent.status as any} />
                                            <Badge variant="secondary" className="text-xs">
                                                v{agent.version}
                                            </Badge>
                                        </div>
                                        <Badge variant="outline" className="ml-auto">{formatPrice(Number(agent.price))}</Badge>
                                    </div>
                                    <CardTitle className="mt-4 line-clamp-1">{agent.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{agent.shortDescription}</CardDescription>
                                    {agent.status === 'APPROVED' && agent.hasActiveUpdate && (
                                        <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3">
                                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-amber-800">
                                                <strong>Hidden from marketplace.</strong> This version is temporarily hidden while your update is under review.
                                            </p>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{agent.viewCount}</span>
                                            <span>Views</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{agent.purchaseCount}</span>
                                            <span>Sales</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t text-xs text-muted-foreground">
                                        Last Updated: {new Date(agent.updatedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t bg-muted/50 p-4">
                                    <div className="flex w-full gap-2">
                                        <Button variant="outline" size="sm" className="w-full" asChild>
                                            <Link href={`/agents/${agent.slug}`}>
                                                <ExternalLink className="mr-2 h-3 w-3" />
                                                View
                                            </Link>
                                        </Button>
                                        {agent.status === 'DRAFT' && (
                                            <Button size="sm" className="w-full" variant="default" asChild>
                                                <Link href={`/dashboard/agents/${agent.id}/edit`}>
                                                    Edit & Submit
                                                </Link>
                                            </Button>
                                        )}
                                        {agent.status === 'REJECTED' && (
                                            <Button size="sm" className="w-full" variant="destructive" asChild>
                                                <Link href={`/dashboard/agents/${agent.id}/edit`}>
                                                    Fix & Resubmit
                                                </Link>
                                            </Button>
                                        )}
                                        {agent.status === 'UNDER_REVIEW' && (
                                            <Button size="sm" className="w-full" variant="secondary" disabled>
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
                                            <Button size="sm" className="w-full" variant="secondary" disabled>
                                                Update Pending
                                            </Button>
                                        )}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}
