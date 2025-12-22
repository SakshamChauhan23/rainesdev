import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { VideoPlayer } from '@/components/agent/video-player'
import { ApproveRejectButtons } from '@/components/admin/approve-reject-buttons'
import ReactMarkdown from 'react-markdown'

export default async function ReviewAgentPage({ params }: { params: { id: string } }) {
    await requireAdmin()

    const agent = await prisma.agent.findUnique({
        where: { id: params.id },
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
            },
            parentAgent: {
                select: {
                    id: true,
                    title: true,
                    version: true,
                    slug: true
                }
            }
        }
    })

    if (!agent) {
        notFound()
    }

    if (agent.status !== 'UNDER_REVIEW') {
        return (
            <Container className="py-12">
                <Card>
                    <CardContent className="flex min-h-[400px] flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold mb-2">Agent Not Under Review</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            This agent is not pending review (Status: {agent.status})
                        </p>
                        <Link href="/admin/review-queue">
                            <Button>Back to Queue</Button>
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        )
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="border-b bg-background p-6">
                <Container>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/review-queue">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-bold tracking-tight">{agent.title}</h1>
                                {agent.parentAgent && (
                                    <Badge variant="secondary">v{agent.version} Update</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">
                                Submitted by {agent.seller.name || agent.seller.email}
                            </p>
                        </div>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                            Under Review
                        </Badge>
                    </div>
                </Container>
            </div>

            <Container className="py-8 space-y-6">
                {/* Version Info */}
                {agent.parentAgent && (
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="pt-6">
                            <p className="text-sm text-blue-900">
                                <strong>This is an update</strong> to an existing agent:{' '}
                                <Link href={`/agents/${agent.parentAgent.slug}`} className="underline">
                                    {agent.parentAgent.title} (v{agent.parentAgent.version})
                                </Link>
                                <br />
                                If approved, the previous version will be archived and this will become the live version.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Agent Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Agent Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Category</p>
                                <p className="text-base">{agent.category.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Price</p>
                                <p className="text-base">${Number(agent.price).toFixed(2)}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Short Description</p>
                            <p className="text-base">{agent.shortDescription}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Demo Video */}
                {agent.demoVideoUrl && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Demo Video</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <VideoPlayer url={agent.demoVideoUrl} thumbnailUrl={agent.thumbnailUrl} />
                        </CardContent>
                    </Card>
                )}

                {/* Workflow Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Workflow Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{agent.workflowOverview}</ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>

                {/* Use Case */}
                <Card>
                    <CardHeader>
                        <CardTitle>Use Case</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base whitespace-pre-wrap">{agent.useCase}</p>
                    </CardContent>
                </Card>

                {/* Setup Guide (Locked Content) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Setup Guide (Buyer-Only Content)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{agent.setupGuide}</ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>

                {/* Approve/Reject Actions */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>Review Decision</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ApproveRejectButtons agentId={agent.id} agentTitle={agent.title} />
                    </CardContent>
                </Card>
            </Container>
        </div>
    )
}
