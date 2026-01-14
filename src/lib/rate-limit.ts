/**
 * Rate limiting utility
 * Protects API routes from abuse, DDoS, and scraping
 *
 * Uses in-memory store for development
 * Can be upgraded to Redis/Upstash for production scaling
 */

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

interface RequestLog {
  count: number
  resetTime: number
}

// In-memory store (use Redis/Upstash in production for multi-instance scaling)
const requestLogs = new Map<string, RequestLog>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, log] of requestLogs.entries()) {
    if (log.resetTime < now) {
      requestLogs.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Rate limit check
 * Returns true if request should be allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const resetTime = now + config.interval

  const log = requestLogs.get(identifier)

  // First request or expired window
  if (!log || log.resetTime < now) {
    requestLogs.set(identifier, {
      count: 1,
      resetTime
    })
    return {
      allowed: true,
      remaining: config.uniqueTokenPerInterval - 1,
      resetTime
    }
  }

  // Within window - check limit
  if (log.count >= config.uniqueTokenPerInterval) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: log.resetTime
    }
  }

  // Increment count
  log.count++
  return {
    allowed: true,
    remaining: config.uniqueTokenPerInterval - log.count,
    resetTime: log.resetTime
  }
}

/**
 * Get identifier for rate limiting
 * Uses IP address or fallback to a default
 */
export function getIdentifier(request: NextRequest): string {
  // Try multiple headers for IP (in order of preference)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0].trim() || realIp || 'unknown'

  return ip
}

/**
 * Rate limit presets for different endpoint types
 */
export const RateLimitPresets = {
  // Public API endpoints (aggressive protection)
  PUBLIC_API: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30 // 30 requests per minute
  },

  // Search/listing endpoints
  SEARCH: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 20 // 20 requests per minute
  },

  // Mutation endpoints (create/update/delete)
  MUTATION: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10 // 10 requests per minute
  },

  // Admin endpoints (more restrictive)
  ADMIN: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 60 // 60 requests per minute (admins need more)
  },

  // Review/rating endpoints (prevent spam)
  REVIEW: {
    interval: 5 * 60 * 1000, // 5 minutes
    uniqueTokenPerInterval: 5 // 5 reviews per 5 minutes
  },

  // Very restrictive (e.g., password reset, email sending)
  STRICT: {
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 3 // 3 requests per 15 minutes
  }
}

/**
 * Rate limit middleware wrapper
 * Returns a function that checks rate limit and returns 429 if exceeded
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const identifier = getIdentifier(request)
    const { allowed, remaining, resetTime } = checkRateLimit(identifier, config)

    // Add rate limit headers to response
    const addRateLimitHeaders = (response: NextResponse) => {
      response.headers.set('X-RateLimit-Limit', config.uniqueTokenPerInterval.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString())
      return response
    }

    if (!allowed) {
      const response = NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )
      return addRateLimitHeaders(response)
    }

    // Call the actual handler
    const response = await handler(request)
    return addRateLimitHeaders(response)
  }
}

/**
 * Simple rate limit check for server actions
 * Returns error message if rate limited, null if allowed
 */
export function checkRateLimitForAction(
  identifier: string,
  config: RateLimitConfig
): string | null {
  const { allowed, resetTime } = checkRateLimit(identifier, config)

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)
    return `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
  }

  return null
}
