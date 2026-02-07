'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import {
  getOrCreateStripeCustomer,
  createSubscriptionCheckoutSession,
  createBillingPortalSession,
  cancelSubscriptionAtPeriodEnd,
  reactivateSubscription as reactivateStripeSub,
  SUBSCRIPTION_PRICE_ID,
  SUBSCRIPTION_CONFIG,
} from '@/lib/stripe'
import { logger } from '@/lib/logger'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * Create a Stripe Checkout Session for subscribing.
 * Returns the checkout URL to redirect the user to.
 */
export async function createCheckoutSession(): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return { error: 'You must be logged in to subscribe' }
    }

    // Check if user already has an active subscription
    const existingSub = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: { status: true },
    })

    if (existingSub && ['ACTIVE', 'TRIALING'].includes(existingSub.status)) {
      return { error: 'You already have an active subscription' }
    }

    // Get Prisma user for name
    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true },
    })

    const email = prismaUser?.email || user.email || ''
    const name = prismaUser?.name || user.user_metadata?.full_name || null

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user.id, email, name)

    // Create checkout session
    const session = await createSubscriptionCheckoutSession({
      customerId,
      priceId: SUBSCRIPTION_PRICE_ID,
      successUrl: `${APP_URL}/library?subscribed=true`,
      cancelUrl: `${APP_URL}/subscribe/cancel`,
      trialDays: SUBSCRIPTION_CONFIG.trialDays,
      userId: user.id,
    })

    if (!session.url) {
      return { error: 'Failed to create checkout session' }
    }

    return { url: session.url }
  } catch (error) {
    logger.error('Error creating checkout session:', error)
    return { error: 'Something went wrong. Please try again.' }
  }
}

/**
 * Create a Stripe Billing Portal session.
 * Returns the portal URL for subscription management.
 */
export async function createPortalSession(): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return { error: 'You must be logged in' }
    }

    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    })

    if (!prismaUser?.stripeCustomerId) {
      return { error: 'No billing account found' }
    }

    const session = await createBillingPortalSession(
      prismaUser.stripeCustomerId,
      `${APP_URL}/account`
    )

    return { url: session.url }
  } catch (error) {
    logger.error('Error creating portal session:', error)
    return { error: 'Something went wrong. Please try again.' }
  }
}

/**
 * Cancel the current subscription at end of billing period.
 */
export async function cancelSubscription(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'You must be logged in' }
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: { stripeSubscriptionId: true, status: true },
    })

    if (!subscription?.stripeSubscriptionId) {
      return { success: false, error: 'No active subscription found' }
    }

    if (!['ACTIVE', 'TRIALING'].includes(subscription.status)) {
      return { success: false, error: 'Subscription is not active' }
    }

    await cancelSubscriptionAtPeriodEnd(subscription.stripeSubscriptionId)

    // The webhook will update the local record, but set cancelAtPeriodEnd immediately for UI
    await prisma.subscription.update({
      where: { userId: user.id },
      data: { cancelAtPeriodEnd: true },
    })

    return { success: true }
  } catch (error) {
    logger.error('Error canceling subscription:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

/**
 * Reactivate a subscription that was set to cancel.
 */
export async function reactivateSubscription(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'You must be logged in' }
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: { stripeSubscriptionId: true, cancelAtPeriodEnd: true },
    })

    if (!subscription?.stripeSubscriptionId) {
      return { success: false, error: 'No subscription found' }
    }

    if (!subscription.cancelAtPeriodEnd) {
      return { success: false, error: 'Subscription is not set to cancel' }
    }

    await reactivateStripeSub(subscription.stripeSubscriptionId)

    await prisma.subscription.update({
      where: { userId: user.id },
      data: { cancelAtPeriodEnd: false, canceledAt: null },
    })

    return { success: true }
  } catch (error) {
    logger.error('Error reactivating subscription:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
