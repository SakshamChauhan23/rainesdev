import { SubscriptionStatus } from '@prisma/client'
import { prisma } from './prisma'
import { logger } from './logger'

export type SubscriptionState = {
  hasAccess: boolean
  status: SubscriptionStatus | null
  isLegacy: boolean
  isTrial: boolean
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: Date | null
  trialEnd: Date | null
}

const NO_ACCESS_STATE: SubscriptionState = {
  hasAccess: false,
  status: null,
  isLegacy: false,
  isTrial: false,
  cancelAtPeriodEnd: false,
  currentPeriodEnd: null,
  trialEnd: null,
}

/**
 * Primary access gate — replaces hasPurchased().
 * Returns true if user has an active subscription (paid, trial, or legacy grace).
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: {
        status: true,
        currentPeriodEnd: true,
        gracePeriodEnd: true,
      },
    })

    if (!subscription) return false

    const now = new Date()

    switch (subscription.status) {
      case 'ACTIVE':
      case 'TRIALING':
      case 'PAST_DUE':
        return true
      case 'LEGACY_GRACE':
        return subscription.gracePeriodEnd ? subscription.gracePeriodEnd > now : false
      default:
        return false
    }
  } catch (error) {
    logger.error('Error checking subscription:', error)
    return false
  }
}

/**
 * Get full subscription state for UI rendering.
 */
export async function getSubscriptionState(userId: string): Promise<SubscriptionState> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (!subscription) return NO_ACCESS_STATE

    const now = new Date()
    let hasAccess = false

    switch (subscription.status) {
      case 'ACTIVE':
      case 'TRIALING':
      case 'PAST_DUE':
        hasAccess = true
        break
      case 'LEGACY_GRACE':
        hasAccess = subscription.gracePeriodEnd ? subscription.gracePeriodEnd > now : false
        break
      default:
        hasAccess = false
    }

    return {
      hasAccess,
      status: subscription.status,
      isLegacy: subscription.status === 'LEGACY_GRACE',
      isTrial: subscription.status === 'TRIALING',
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currentPeriodEnd: subscription.currentPeriodEnd,
      trialEnd: subscription.trialEnd,
    }
  } catch (error) {
    logger.error('Error getting subscription state:', error)
    return NO_ACCESS_STATE
  }
}

/**
 * Check if a user has any completed purchases (for legacy detection).
 */
export async function isLegacyUser(userId: string): Promise<boolean> {
  try {
    const count = await prisma.purchase.count({
      where: { buyerId: userId, status: 'COMPLETED' },
    })
    return count > 0
  } catch (error) {
    logger.error('Error checking legacy user:', error)
    return false
  }
}

/**
 * Create a legacy grace period subscription for existing purchasers.
 */
export async function createLegacyGraceSubscription(
  userId: string,
  graceDays: number = 30
): Promise<void> {
  try {
    const existing = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (existing) {
      logger.info(`Subscription already exists for user ${userId}, skipping legacy creation`)
      return
    }

    const gracePeriodEnd = new Date()
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + graceDays)

    await prisma.subscription.create({
      data: {
        userId,
        status: 'LEGACY_GRACE',
        gracePeriodEnd,
      },
    })

    logger.info(
      `Created legacy grace subscription for user ${userId}, expires ${gracePeriodEnd.toISOString()}`
    )
  } catch (error) {
    logger.error('Error creating legacy grace subscription:', error)
    throw error
  }
}
