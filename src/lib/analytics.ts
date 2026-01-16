/**
 * Analytics tracking utilities
 * Lightweight user event tracking with Sentry integration
 */

import * as Sentry from '@sentry/nextjs'

// Event categories for structured tracking
export type AnalyticsCategory =
  | 'navigation'
  | 'agent'
  | 'purchase'
  | 'review'
  | 'search'
  | 'user'

export interface AnalyticsEvent {
  category: AnalyticsCategory
  action: string
  label?: string
  value?: number
  metadata?: Record<string, string | number | boolean>
}

/**
 * Track a user event
 * Events are sent to Sentry for analysis
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return

  try {
    // Add breadcrumb for debugging context
    Sentry.addBreadcrumb({
      category: event.category,
      message: event.action,
      level: 'info',
      data: {
        label: event.label,
        value: event.value,
        ...event.metadata,
      },
    })

    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event)
    }
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.warn('Analytics tracking failed:', error)
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent({
    category: 'navigation',
    action: 'page_view',
    label: path,
    metadata: title ? { title } : undefined,
  })
}

/**
 * Track agent interaction
 */
export function trackAgentView(agentId: string, agentTitle: string): void {
  trackEvent({
    category: 'agent',
    action: 'view',
    label: agentTitle,
    metadata: { agentId },
  })
}

/**
 * Track agent purchase initiation
 */
export function trackPurchaseStart(agentId: string, price: number): void {
  trackEvent({
    category: 'purchase',
    action: 'start',
    value: price,
    metadata: { agentId },
  })
}

/**
 * Track purchase completion
 */
export function trackPurchaseComplete(agentId: string, price: number): void {
  trackEvent({
    category: 'purchase',
    action: 'complete',
    value: price,
    metadata: { agentId },
  })
}

/**
 * Track review submission
 */
export function trackReviewSubmit(agentId: string, rating: number): void {
  trackEvent({
    category: 'review',
    action: 'submit',
    value: rating,
    metadata: { agentId },
  })
}

/**
 * Track search query
 */
export function trackSearch(query: string, resultsCount: number): void {
  trackEvent({
    category: 'search',
    action: 'query',
    label: query,
    value: resultsCount,
  })
}

/**
 * Track user authentication events
 */
export function trackAuth(action: 'login' | 'logout' | 'signup'): void {
  trackEvent({
    category: 'user',
    action,
  })
}
