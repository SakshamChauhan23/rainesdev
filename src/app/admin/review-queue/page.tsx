import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default async function ReviewQueuePage() {
    await requireAdmin()

    // Fetch agents under review
    const agentsUnderReview = await prisma.agent.findMany({
        where: { status: 'UNDER_REVIEW' },
        orderBy: { updatedAt: 'desc' },
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
                    version: true
                }
            }
        }
    })

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="border-b bg-background p-6">
                <Container>
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
                            <p className="text-muted-foreground">
                                {agentsUnderReview.length} agent{agentsUnderReview.length !== 1 ? 's' : ''} pending review
                            </p>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="py-8">
                {agentsUnderReview.length === 0 ? (
                    <Card>
                        <CardContent className="flex min-h-[400px] flex-col items-center justify-center text-center">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Eye className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No agents pending review</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                All submissions have been processed. New submissions will appear here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {agentsUnderReview.map((agent) => (
                            <Card key={agent.id} className="hover:bg-muted/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-xl">{agent.title}</CardTitle>
                                                {agent.parentAgent && (
                                                    <Badge variant="secondary">
                                                        v{agent.version} Update
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="space-y-1">
                                                <div>
                                                    <span className="font-medium">Seller:</span> {agent.seller.name || agent.seller.email}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Category:</span> {agent.category.name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Submitted:</span>{' '}
                                                    {formatDistanceToNow(new Date(agent.updatedAt), { addSuffix: true })}
                                                </div>
                                                {agent.parentAgent && (
                                                    <div className="text-xs text-muted-foreground mt-2">
                                                        Updating: {agent.parentAgent.title} (v{agent.parentAgent.version})
                                                    </div>
                                                )}
                                            </CardDescription>
                                        </div>
                                        <Link href={`/admin/review/${agent.id}`}>
                                            <Button>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Review
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {agent.shortDescription}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}
