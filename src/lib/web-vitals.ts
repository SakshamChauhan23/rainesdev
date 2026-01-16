import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB, Metric } from 'web-vitals'
import * as Sentry from '@sentry/nextjs'

// Web Vitals thresholds (in ms) - based on Google's recommendations
const THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift (unitless)
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
}

type MetricName = keyof typeof THRESHOLDS

function getRating(name: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}

function reportToSentry(metric: Metric) {
  const rating = getRating(metric.name as MetricName, metric.value)

  // Only report to Sentry in production and only poor metrics
  if (process.env.NODE_ENV === 'production' && rating === 'poor') {
    Sentry.addBreadcrumb({
      category: 'web-vitals',
      message: `${metric.name}: ${metric.value}`,
      level: 'warning',
      data: {
        name: metric.name,
        value: metric.value,
        rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      },
    })
  }
}

function reportToAnalytics(metric: Metric) {
  // Report to Google Analytics if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const rating = getRating(metric.name as MetricName, metric.value)
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${rating})`)
  }
}

function handleMetric(metric: Metric) {
  reportToSentry(metric)
  reportToAnalytics(metric)
}

/**
 * Initialize Web Vitals monitoring
 * Call this function once in your app to start tracking Core Web Vitals
 */
export function initWebVitals() {
  // Only run in browser
  if (typeof window === 'undefined') return

  try {
    onCLS(handleMetric)
    onFCP(handleMetric)
    onFID(handleMetric)
    onINP(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)
  } catch (error) {
    // Silently fail if web-vitals doesn't load
    console.warn('Failed to initialize web-vitals:', error)
  }
}

/**
 * Get the current page's performance metrics
 * Useful for debugging or displaying performance info
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

  if (!navigation) return null

  return {
    // Navigation timing
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpConnection: navigation.connectEnd - navigation.connectStart,
    serverResponse: navigation.responseStart - navigation.requestStart,
    domLoad: navigation.domContentLoadedEventEnd - navigation.startTime,
    pageLoad: navigation.loadEventEnd - navigation.startTime,

    // Resource timing summary
    resourceCount: performance.getEntriesByType('resource').length,
  }
}
