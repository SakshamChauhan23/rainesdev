'use server'

import { stripe, DENTAL_CONFIG } from '@/lib/stripe'
import { logger } from '@/lib/logger'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function createDentalCheckoutSession(
  plan: 'SETUP' | 'STARTER' | 'STANDARD'
): Promise<{ url: string } | { error: string }> {
  try {
    const config = DENTAL_CONFIG[plan]
    const isRecurring = plan === 'STARTER' || plan === 'STANDARD'

    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: config.name,
              description: config.description,
            },
            unit_amount: config.priceAmount,
            ...(isRecurring ? { recurring: { interval: 'month' } } : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/dental?success=true&plan=${plan.toLowerCase()}`,
      cancel_url: `${APP_URL}/dental#pricing`,
      metadata: { type: 'dental', plan },
    })

    if (!session.url) {
      return { error: 'Failed to create checkout session' }
    }

    return { url: session.url }
  } catch (error) {
    logger.error('Error creating dental checkout session:', error)
    return { error: 'Something went wrong. Please try again.' }
  }
}
