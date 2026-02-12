import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSubscriptionState } from '@/lib/subscription'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Crown } from 'lucide-react'
import Link from 'next/link'
import { LibraryAgentGrid } from '@/components/library/library-agent-grid'
import { SavingsReviewStatusCard } from '@/components/savings-review/status-card'

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/library')
  }

  const subscriptionState = await getSubscriptionState(user.id)

  // Fetch user's savings reviews
  const savingsReviews = await prisma.savingsReview.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      tier: true,
      status: true,
      companyName: true,
      deliverableUrl: true,
      createdAt: true,
    },
  })

  // If subscribed, show ALL approved agents
  if (subscriptionState.hasAccess) {
    const allAgents = await prisma.agent.findMany({
      where: { status: 'APPROVED', hasActiveUpdate: false },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        thumbnailUrl: true,
        version: true,
        category: { select: { name: true } },
      },
    })

    const statusLabel = subscriptionState.isTrial
      ? 'Free Trial'
      : subscriptionState.isLegacy
        ? 'Legacy Access'
        : 'Active'

    const statusClass = subscriptionState.isTrial
      ? 'bg-brand-teal/10 text-brand-teal'
      : subscriptionState.isLegacy
        ? 'bg-brand-orange/10 text-brand-orange'
        : 'bg-green-100 text-green-800'

    return (
      <div className="min-h-screen bg-muted/40">
        <div className="border-b bg-background p-6">
          <Container>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
                <p className="text-muted-foreground">
                  {allAgents.length} agent{allAgents.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={statusClass}>{statusLabel}</Badge>
                <Link href="/account">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Manage Subscription
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-8">
          {savingsReviews.length > 0 && (
            <div className="mb-8 space-y-4">
              {savingsReviews.map(review => (
                <SavingsReviewStatusCard key={review.id} review={review} />
              ))}
            </div>
          )}
          <LibraryAgentGrid agents={allAgents} />
        </Container>
      </div>
    )
  }

  // Not subscribed — show upsell
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="border-b bg-background p-6">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
          <p className="text-muted-foreground">Subscribe to unlock all agents</p>
        </Container>
      </div>

      <Container className="py-8">
        {savingsReviews.length > 0 && (
          <div className="mb-8 space-y-4">
            {savingsReviews.map(review => (
              <SavingsReviewStatusCard key={review.id} review={review} />
            ))}
          </div>
        )}
        <Card className="border-2 border-brand-orange/20 bg-gradient-to-br from-brand-orange/5 to-brand-teal/5">
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10">
              <Crown className="h-10 w-10 text-brand-orange" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-brand-slate">Unlock All AI Agents</h3>
            <p className="mb-2 max-w-md text-brand-slate/70">
              Get instant access to our entire library of 200+ AI agents with setup guides and
              workflows.
            </p>
            <p className="mb-8 text-2xl font-bold text-brand-slate">
              $12.99<span className="text-base font-normal text-brand-slate/60">/month</span>
            </p>
            <Link href="/subscribe">
              <Button
                size="lg"
                className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90"
              >
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}
