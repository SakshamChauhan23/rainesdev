import Stripe from 'stripe'
import { prisma } from './prisma'
import { logger } from './logger'

// Singleton Stripe client
const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined
}

export const stripe =
  globalForStripe.stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
  })

if (!globalForStripe.stripe) {
  globalForStripe.stripe = stripe
}

// Subscription configuration
export const SUBSCRIPTION_PRICE_ID = process.env.STRIPE_PRICE_ID!

export const SUBSCRIPTION_CONFIG = {
  priceAmount: 1299, // $12.99 in cents
  currency: 'usd' as const,
  interval: 'month' as const,
  trialDays: 14,
  productName: 'Rouze.ai All-Access',
  productDescription: 'Unlimited access to all AI agents on Rouze.ai',
}

/**
 * Create or retrieve a Stripe customer for a user.
 * Stores the stripeCustomerId on the User record.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: { userId },
  })

  // Store the customer ID on the user
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  logger.info(`Created Stripe customer ${customer.id} for user ${userId}`)
  return customer.id
}

/**
 * Create a Stripe Checkout Session for a new subscription.
 */
export async function createSubscriptionCheckoutSession(params: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  trialDays?: number
  userId: string
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    subscription_data: params.trialDays
      ? { trial_period_days: params.trialDays, metadata: { userId: params.userId } }
      : { metadata: { userId: params.userId } },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { userId: params.userId },
  })

  return session
}

/**
 * Create a Stripe Billing Portal session for subscription management.
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

/**
 * Cancel a subscription at the end of the current billing period.
 */
export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}

/**
 * Reactivate a subscription that was set to cancel at period end.
 */
export async function reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
}
