/**
 * CSRF Protection utility for API routes (P2.17)
 *
 * In Next.js 13+, server actions have built-in CSRF protection.
 * This utility adds CSRF protection to API routes by validating
 * the Origin header against allowed origins.
 */

import { NextRequest, NextResponse } from 'next/server'

// Get allowed origins from environment or use defaults
function getAllowedOrigins(): string[] {
  const origins: string[] = []

  // Production URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.push(process.env.NEXT_PUBLIC_APP_URL)
  }

  // Vercel preview URLs
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`)
  }

  // Development
  if (process.env.NODE_ENV === 'development') {
    origins.push('http://localhost:3000')
    origins.push('http://127.0.0.1:3000')
  }

  return origins
}

/**
 * Check if the request origin is allowed
 * Returns null if allowed, error response if blocked
 */
export function checkCsrf(request: NextRequest): NextResponse | null {
  // Skip CSRF check for GET, HEAD, OPTIONS (safe methods)
  const method = request.method.toUpperCase()
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return null
  }

  // Get origin from request
  const origin = request.headers.get('origin')

  // No origin header - likely a same-origin request or non-browser client
  // For API routes called from fetch() on the same origin, Origin may not be set
  // We allow these but log for monitoring
  if (!origin) {
    // Check for Referer as fallback
    const referer = request.headers.get('referer')
    if (referer) {
      try {
        const refererUrl = new URL(referer)
        const allowedOrigins = getAllowedOrigins()
        const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`
        if (allowedOrigins.length > 0 && !allowedOrigins.includes(refererOrigin)) {
          return NextResponse.json(
            { error: 'CSRF validation failed', message: 'Invalid request origin' },
            { status: 403 }
          )
        }
      } catch {
        // Invalid referer URL, allow request (could be a non-browser client)
      }
    }
    return null
  }

  // Validate origin
  const allowedOrigins = getAllowedOrigins()

  // If no allowed origins configured, skip check in development
  if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'development') {
    return null
  }

  if (!allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: 'CSRF validation failed', message: 'Request origin not allowed' },
      { status: 403 }
    )
  }

  return null
}

/**
 * CSRF protection middleware wrapper
 * Wraps a handler with CSRF validation
 */
export function withCsrfProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const csrfError = checkCsrf(request)
    if (csrfError) {
      return csrfError
    }

    return handler(request)
  }
}
