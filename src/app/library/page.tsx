import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getBuyerPurchases } from '@/lib/purchases'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { formatPrice } from '@/lib/utils'

export default async function LibraryPage() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login?next=/library')
    }

    const purchases = await getBuyerPurchases(user.id)

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
