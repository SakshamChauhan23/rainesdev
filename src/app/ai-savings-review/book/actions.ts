'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateStripeCustomer, createSavingsReviewCheckoutSession } from '@/lib/stripe'
import { logger } from '@/lib/logger'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function confirmBookingAndPay(): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return { error: 'You must be logged in.' }
    }

    // Find the user's review in AWAITING_BOOKING or AWAITING_PAYMENT status
    const review = await prisma.savingsReview.findFirst({
      where: {
        userId: user.id,
        status: { in: ['AWAITING_BOOKING', 'AWAITING_PAYMENT'] },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!review) {
      return { error: 'No pending review found. Please start from the intake form.' }
    }

    // Update status to AWAITING_PAYMENT
    await prisma.savingsReview.update({
      where: { id: review.id },
      data: { status: 'AWAITING_PAYMENT' },
    })

    // Get or create Stripe customer
    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true },
    })

    const email = prismaUser?.email || user.email || ''
    const name = prismaUser?.name || user.user_metadata?.full_name || null

    const customerId = await getOrCreateStripeCustomer(user.id, email, name)

    // Create Stripe checkout session
    const session = await createSavingsReviewCheckoutSession({
      customerId,
      tier: review.tier,
      reviewId: review.id,
      userId: user.id,
      successUrl: `${APP_URL}/ai-savings-review/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${APP_URL}/ai-savings-review/book`,
    })

    if (!session.url) {
      return { error: 'Failed to create checkout session.' }
    }

    // Store Stripe session ID on the review
    await prisma.savingsReview.update({
      where: { id: review.id },
      data: { stripeSessionId: session.id },
    })

    return { url: session.url }
  } catch (error) {
    logger.error('Error creating savings review checkout:', error)
    return { error: 'Something went wrong. Please try again.' }
  }
}
