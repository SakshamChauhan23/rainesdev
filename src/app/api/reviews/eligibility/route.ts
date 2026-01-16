import { logger } from '@/lib/logger'
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import { reviewsEligibilitySchema, validateQuery, formatZodErrors } from '@/lib/validation'
import { checkReviewEligibility } from '@/lib/reviews'
import { ZodError } from 'zod'

export const runtime = 'nodejs'
export const revalidate = 0 // Always fresh for eligibility checks

/**
 * GET /api/reviews/eligibility
 * Check if a user is eligible to review an agent (P2.28)
 * Uses shared eligibility logic from @/lib/reviews
 */
async function getHandler(request: NextRequest) {
  try {
    // Validate query parameters with Zod (P2.16)
    let validatedParams
    try {
      validatedParams = validateQuery(request, reviewsEligibilitySchema)
    } catch (error) {
      if (error instanceof NextResponse) return error
      if (error instanceof ZodError) {
        return NextResponse.json(
          { success: false, error: 'Validation failed', details: formatZodErrors(error) },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const { userId, agentId } = validatedParams

    // Use shared eligibility checker (P2.28)
    const eligibility = await checkReviewEligibility(userId, agentId)

    return NextResponse.json({
      success: true,
      ...eligibility,
    })
  } catch (error) {
    logger.error('[Review Eligibility API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check review eligibility' },
      { status: 500 }
    )
  }
}

// Apply rate limiting - Public API preset (30 req/min)
export const GET = withRateLimit(RateLimitPresets.PUBLIC_API, getHandler)
