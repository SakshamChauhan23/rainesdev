import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust this value in production as needed
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Capture errors and performance data
  enabled: process.env.NODE_ENV === 'production',

  // Additional SDK configuration
  environment: process.env.NODE_ENV,

  // Don't report errors in development
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV !== 'production') {
      return null
    }
    return event
  },

  // Ignore common errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random network errors
    'NetworkError',
    'Network request failed',
    // User-initiated cancellations
    'AbortError',
  ],
})
