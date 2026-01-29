import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getBuyerPurchases } from '@/lib/purchases'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Calendar, Phone } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { formatPrice } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export default async function LibraryPage() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login?next=/library')
    }

    // Optimize: Combine both queries into one using Promise.all
    const [purchases, setupRequestsWithBookCall] = await Promise.all([
        getBuyerPurchases(user.id),
        prisma.setupRequest.findMany({
            where: {
                buyerId: user.id,
                bookCallRequested: true
            },
            include: {
                agent: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                }
            }
        })
    ])

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="border-b bg-background p-6">
                <Container>
                    <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
                    <p className="text-muted-foreground">
                        {purchases.length} agent{purchases.length !== 1 ? 's' : ''} unlocked
                    </p>
                </Container>
            </div>

            <Container className="py-8">
                {/* Book Call Banner - Show if user has any agents with book call requested */}
                {setupRequestsWithBookCall.length > 0 && (
                    <Card className="mb-6 border-2 border-brand-orange/30 bg-gradient-to-br from-brand-orange/5 to-brand-orange/10">
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-orange/20">
                                    <Phone className="h-6 w-6 text-brand-orange" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-xl text-brand-slate mb-2">
                                        Schedule Your Admin Consultation
                                    </CardTitle>
                                    <CardDescription className="text-brand-slate/70">
                                        You requested admin assistance for {setupRequestsWithBookCall.length} agent{setupRequestsWithBookCall.length !== 1 ? 's' : ''}.
                                        Book a call with our team to get personalized setup help.
                                    </CardDescription>
                                    <ul className="mt-3 space-y-1">
                                        {setupRequestsWithBookCall.map((request) => (
                                            <li key={request.id} className="text-sm text-brand-slate/80">
                                                • {request.agent.title}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Link
                                href={process.env.NEXT_PUBLIC_BOOKING_CALENDAR_URL || "https://calendar.app.google/QyuK9XKQ52r6dNPD6"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    size="lg"
                                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40 transition-all"
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Book a Call Now
                                </Button>
                            </Link>
                            <p className="text-xs text-brand-slate/60 mt-3 text-center">
                                Free consultation • 30-minute session • Discuss all your agents
                            </p>
                        </CardContent>
                    </Card>
                )}

                {purchases.length === 0 ? (
                    <Card>
                        <CardContent className="flex min-h-[400px] flex-col items-center justify-center text-center">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No agents unlocked yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mb-4">
                                Browse the marketplace to find and unlock AI agents
                            </p>
                            <Link href="/agents">
                                <Button>Browse Agents</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {purchases.map((purchase) => (
                            <Card key={purchase.id} className="flex flex-col hover:bg-muted/50 transition-colors">
                                <CardHeader>
                                    {purchase.agent.thumbnailUrl && (
                                        <img
                                            src={purchase.agent.thumbnailUrl}
                                            alt={purchase.agent.title}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <CardTitle className="line-clamp-1">{purchase.agent.title}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {purchase.agent.category.name}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            v{purchase.agent.version}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Unlocked {formatDistanceToNow(new Date(purchase.purchasedAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Amount paid:</span>
                                        <span className="font-semibold">{formatPrice(Number(purchase.amountPaid))}</span>
                                    </div>
                                    {purchase.source === 'TEST_MODE' && (
                                        <Badge variant="outline" className="text-xs">
                                            Test Purchase
                                        </Badge>
                                    )}
                                </CardContent>
                                <div className="border-t p-4">
                                    <Link href={`/agents/${purchase.agent.slug}`}>
                                        <Button className="w-full" variant="default">
                                            View Agent
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}
