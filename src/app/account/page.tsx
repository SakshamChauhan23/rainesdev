import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSubscriptionState } from '@/lib/subscription'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow, format } from 'date-fns'
import { AccountActions } from '@/components/account/account-actions'

export const dynamic = 'force-dynamic'

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-800' },
  TRIALING: { label: 'Free Trial', className: 'bg-brand-teal/10 text-brand-teal' },
  PAST_DUE: { label: 'Past Due', className: 'bg-red-100 text-red-800' },
  CANCELED: { label: 'Canceled', className: 'bg-gray-100 text-gray-800' },
  EXPIRED: { label: 'Expired', className: 'bg-gray-100 text-gray-800' },
  LEGACY_GRACE: { label: 'Legacy Access', className: 'bg-brand-orange/10 text-brand-orange' },
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/account')
  }

  const subscriptionState = await getSubscriptionState(user.id)
  const statusBadge = subscriptionState.status
    ? STATUS_BADGES[subscriptionState.status] || {
        label: subscriptionState.status,
        className: 'bg-gray-100 text-gray-800',
      }
    : null

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="border-b bg-background p-6">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight">Account</h1>
          <p className="text-muted-foreground">Manage your subscription and billing</p>
        </Container>
      </div>

      <Container className="py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Rouze.ai All-Access</CardDescription>
                </div>
                {statusBadge && (
                  <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscriptionState.hasAccess ? (
                <>
                  {subscriptionState.isTrial && subscriptionState.trialEnd && (
                    <div className="rounded-xl bg-brand-teal/5 p-4">
                      <p className="text-sm font-medium text-brand-teal">
                        Trial ends{' '}
                        {formatDistanceToNow(subscriptionState.trialEnd, { addSuffix: true })}
                      </p>
                      <p className="mt-1 text-xs text-brand-slate/60">
                        {format(subscriptionState.trialEnd, 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}

                  {subscriptionState.isLegacy && (
                    <div className="rounded-xl bg-brand-orange/5 p-4">
                      <p className="text-sm font-medium text-brand-orange">
                        Legacy access — subscribe to continue after grace period
                      </p>
                    </div>
                  )}

                  {subscriptionState.cancelAtPeriodEnd && subscriptionState.currentPeriodEnd && (
                    <div className="rounded-xl bg-red-50 p-4">
                      <p className="text-sm font-medium text-red-800">
                        Your subscription will end on{' '}
                        {format(subscriptionState.currentPeriodEnd, 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}

                  {!subscriptionState.isTrial &&
                    !subscriptionState.isLegacy &&
                    !subscriptionState.cancelAtPeriodEnd &&
                    subscriptionState.currentPeriodEnd && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Next billing date</span>
                        <span className="font-medium">
                          {format(subscriptionState.currentPeriodEnd, 'MMMM d, yyyy')}
                        </span>
                      </div>
                    )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Plan price</span>
                    <span className="font-medium">$12.99/month</span>
                  </div>

                  <AccountActions
                    hasAccess={subscriptionState.hasAccess}
                    isLegacy={subscriptionState.isLegacy}
                    cancelAtPeriodEnd={subscriptionState.cancelAtPeriodEnd}
                  />
                </>
              ) : (
                <div className="py-4 text-center">
                  <p className="mb-4 text-muted-foreground">
                    You don&apos;t have an active subscription.
                  </p>
                  <a
                    href="/pricing"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-orange px-6 text-sm font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:bg-brand-orange/90"
                  >
                    Subscribe Now
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
}
