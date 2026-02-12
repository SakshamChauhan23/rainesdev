import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { SubscriptionStatus } from '@prisma/client'
import Stripe from 'stripe'

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = 'nodejs'

/**
 * Map Stripe subscription status to our SubscriptionStatus enum.
 */
function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
  switch (stripeStatus) {
    case 'trialing':
      return 'TRIALING'
    case 'active':
      return 'ACTIVE'
    case 'past_due':
      return 'PAST_DUE'
    case 'canceled':
      return 'CANCELED'
    case 'unpaid':
    case 'incomplete_expired':
      return 'EXPIRED'
    default:
      return 'ACTIVE'
  }
}

/**
 * Upsert subscription record from a Stripe subscription object.
 */
async function syncSubscription(stripeSubscription: Stripe.Subscription, userId: string) {
  const status = mapStripeStatus(stripeSubscription.status)

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id || null,
      status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      canceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000)
        : null,
    },
    update: {
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id || null,
      status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      canceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000)
        : null,
    },
  })

  logger.info(`Synced subscription ${stripeSubscription.id} for user ${userId} — status: ${status}`)
}

/**
 * Look up userId from Stripe subscription metadata or customer metadata.
 */
async function getUserIdFromSubscription(
  subscription: Stripe.Subscription
): Promise<string | null> {
  // Check subscription metadata first
  if (subscription.metadata?.userId) {
    return subscription.metadata.userId
  }

  // Fall back to looking up by stripeCustomerId
  const customerId =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  })

  return user?.id || null
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    logger.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Handle Savings Review one-time payment
        if (session.metadata?.type === 'savings_review' && session.mode === 'payment') {
          const reviewId = session.metadata.reviewId
          if (!reviewId) {
            logger.error('No reviewId in savings review checkout metadata')
            break
          }

          await prisma.savingsReview.update({
            where: { id: reviewId },
            data: {
              status: 'PAID',
              stripeSessionId: session.id,
              stripePaymentIntentId:
                typeof session.payment_intent === 'string'
                  ? session.payment_intent
                  : session.payment_intent?.id || null,
              amountPaid: session.amount_total ? session.amount_total / 100 : null,
              paidAt: new Date(),
            },
          })
          logger.info(`Savings review ${reviewId} marked as PAID`)
          break
        }

        // Handle subscription checkout
        if (session.mode === 'subscription' && session.subscription) {
          const userId = session.metadata?.userId
          if (!userId) {
            logger.error('No userId in checkout session metadata')
            break
          }

          const subscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id

          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
          await syncSubscription(stripeSubscription, userId)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = await getUserIdFromSubscription(subscription)
        if (!userId) {
          logger.error(`No userId found for subscription ${subscription.id}`)
          break
        }
        await syncSubscription(subscription, userId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = await getUserIdFromSubscription(subscription)
        if (!userId) {
          logger.error(`No userId found for deleted subscription ${subscription.id}`)
          break
        }

        await prisma.subscription.update({
          where: { userId },
          data: {
            status: 'CANCELED',
            canceledAt: new Date(),
          },
        })
        logger.info(`Subscription ${subscription.id} canceled for user ${userId}`)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const subscriptionId =
            typeof invoice.subscription === 'string'
              ? invoice.subscription
              : invoice.subscription.id

          // Update subscription to ACTIVE on successful payment
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: 'ACTIVE' },
          })
          logger.info(`Payment succeeded for subscription ${subscriptionId}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const subscriptionId =
            typeof invoice.subscription === 'string'
              ? invoice.subscription
              : invoice.subscription.id

          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: 'PAST_DUE' },
          })
          logger.warn(`Payment failed for subscription ${subscriptionId}`)
        }
        break
      }

      default:
        logger.info(`Unhandled webhook event: ${event.type}`)
    }
  } catch (error) {
    logger.error(`Error processing webhook event ${event.type}:`, error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
