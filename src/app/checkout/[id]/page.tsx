import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { CheckoutConfirmButton } from '@/components/checkout/checkout-confirm-button'
import { formatPrice } from '@/lib/utils'
import { hasPurchased } from '@/lib/purchases'
import { ShieldCheck, Package, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function CheckoutPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login?next=/checkout/' + params.id)
    }

    // Fetch agent
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
            }
        }
    })

    if (!agent) {
        notFound()
    }

    // Block if not approved
    if (agent.status !== 'APPROVED') {
        return (
            <Container className="py-12">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-semibold mb-2">Agent Not Available</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            This agent is not available for purchase
                        </p>
                        <Link href="/agents">
                            <Button>Browse Agents</Button>
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        )
    }

    // Check if already purchased
    const alreadyPurchased = await hasPurchased(user.id, agent.id)

    if (alreadyPurchased) {
        return (
            <Container className="py-12">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-semibold mb-2">Already Unlocked</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            You already own this agent
                        </p>
                        <Link href={`/agents/${agent.slug}`}>
                            <Button>View Agent</Button>
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
                    <div className="max-w-2xl mx-auto">
                        <Badge variant="outline" className="mb-4">Test Mode</Badge>
                        <h1 className="text-3xl font-bold tracking-tight">Unlock Setup Guide</h1>
                        <p className="text-muted-foreground">
                            Get instant access to the complete setup guide and workflow details
                        </p>
                    </div>
                </Container>
            </div>

            <Container className="py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Agent Summary */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                {agent.thumbnailUrl && (
                                    <img
                                        src={agent.thumbnailUrl}
                                        alt={agent.title}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <CardTitle className="mb-1">{agent.title}</CardTitle>
                                    <CardDescription>
                                        by {agent.seller.name || agent.seller.email}
                                    </CardDescription>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary">v{agent.version}</Badge>
                                        <Badge variant="outline">{agent.category.name}</Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="text-2xl font-bold">{formatPrice(Number(agent.price))}</p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* What's Included */}
                    <Card>
                        <CardHeader>
                            <CardTitle>What's Included</CardTitle>
                            <CardDescription>
                                You'll get instant access to all locked content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Complete Setup Guide</p>
                                    <p className="text-sm text-muted-foreground">
                                        Step-by-step instructions to deploy and configure the agent
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Package className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Workflow Details</p>
                                    <p className="text-sm text-muted-foreground">
                                        Technical implementation and configuration files
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Lifetime Access</p>
                                    <p className="text-sm text-muted-foreground">
                                        Access this version forever, even if updated
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Test Mode Notice */}
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="pt-6">
                            <p className="text-sm text-blue-900">
                                <strong>Test Mode – No payment required.</strong> This is a test purchase flow.
                                In production, this will be replaced with Stripe checkout.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Checkout Button */}
                    <CheckoutConfirmButton agentId={agent.id} agentSlug={agent.slug} />
                </div>
            </Container>
        </div>
    )
}
