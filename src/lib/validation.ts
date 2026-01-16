/**
 * Database-level validation utilities (P2.16)
 * These enforce constraints that should be at the database level
 * but Prisma doesn't support CHECK constraints directly
 *
 * Also includes Zod schemas for API input validation
 */

import { Decimal } from '@prisma/client/runtime/library'
import { NextRequest, NextResponse } from 'next/server'
import { z, ZodSchema, ZodError } from 'zod'

/**
 * Validate that a price is non-negative
 * @throws Error if price is negative
 */
export function validatePrice(price: number | Decimal, fieldName: string = 'price'): void {
  const numPrice = typeof price === 'number' ? price : Number(price)

  if (numPrice < 0) {
    throw new Error(`${fieldName} cannot be negative (got ${numPrice})`)
  }

  if (!isFinite(numPrice)) {
    throw new Error(`${fieldName} must be a valid number (got ${numPrice})`)
  }
}

/**
 * Validate that a rating is between 1 and 5 (inclusive)
 * @throws Error if rating is out of range
 */
export function validateRating(rating: number): void {
  if (!Number.isInteger(rating)) {
    throw new Error(`rating must be an integer (got ${rating})`)
  }

  if (rating < 1 || rating > 5) {
    throw new Error(`rating must be between 1 and 5 (got ${rating})`)
  }
}

/**
 * Validate that an amount paid is non-negative
 * @throws Error if amount is negative
 */
export function validateAmountPaid(amount: number | Decimal): void {
  validatePrice(amount, 'amountPaid')
}

/**
 * Validate agent prices (main price + addon prices)
 * @throws Error if any price is invalid
 */
export function validateAgentPrices(data: {
  price: number | Decimal
  supportAddonPrice?: number | Decimal
  assistedSetupPrice?: number | Decimal
}): void {
  validatePrice(data.price, 'price')

  if (data.supportAddonPrice !== undefined) {
    validatePrice(data.supportAddonPrice, 'supportAddonPrice')
  }

  if (data.assistedSetupPrice !== undefined) {
    validatePrice(data.assistedSetupPrice, 'assistedSetupPrice')
  }
}

// ============================================
// Zod Schemas for API Input Validation (P2.16)
// ============================================

/**
 * Common validation patterns
 */
const uuidPattern = z.string().uuid('Invalid UUID format')
const positiveInt = z.number().int().positive()
const nonNegativeNumber = z.number().min(0)
const maxStringLength = (max: number) => z.string().max(max)
const urlPattern = z.string().url().optional().or(z.literal(''))

// ============================================
// JSON Field Validation Schemas (P1.14, P1.15)
// ============================================

/**
 * Social links schema for SellerProfile.socialLinks
 * Validates URL format for each social platform
 */
export const socialLinksSchema = z
  .object({
    github: urlPattern,
    twitter: urlPattern,
    linkedin: urlPattern,
    website: urlPattern,
    youtube: urlPattern,
  })
  .partial()
  .optional()

/**
 * Workflow step schema for Agent.workflowDetails.steps
 */
export const workflowStepSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  order: z.number().int().min(0),
})

/**
 * Workflow details schema for Agent.workflowDetails
 * Validates the structured workflow information
 */
export const workflowDetailsSchema = z
  .object({
    steps: z.array(workflowStepSchema).max(20).optional(),
    integrations: z.array(z.string().max(100)).max(20).optional(),
    requirements: z.array(z.string().max(500)).max(20).optional(),
    estimatedTime: z.string().max(100).optional(),
  })
  .optional()

/**
 * Type-safe validators for JSON fields
 */
export function validateSocialLinks(data: unknown): boolean {
  const result = socialLinksSchema.safeParse(data)
  return result.success
}

export function validateWorkflowDetails(data: unknown): boolean {
  const result = workflowDetailsSchema.safeParse(data)
  return result.success
}

/**
 * Pagination schema (reusable for all list endpoints)
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
  cursor: z.string().optional(),
})

/**
 * Reviews API schemas
 */
export const reviewsGetSchema = z.object({
  agentId: uuidPattern,
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
})

export const reviewsEligibilitySchema = z.object({
  userId: uuidPattern,
  agentId: uuidPattern,
})

export const reviewsPostSchema = z.object({
  userId: uuidPattern,
  agentId: uuidPattern,
  rating: z.number().int().min(1).max(5),
  comment: maxStringLength(parseInt(process.env.MAX_COMMENT_LENGTH || '1000')).optional(),
})

/**
 * Agents API schemas
 */
export const agentsGetSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
  search: maxStringLength(200).optional(),
  categoryId: uuidPattern.optional(),
  categorySlug: z.string().max(100).optional(),
  featured: z.enum(['true', 'false']).optional(),
})

export const agentDetailSchema = z.object({
  id: uuidPattern,
})

/**
 * Setup request schemas
 */
export const setupRequestUpdateSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  callStatus: z.enum(['NOT_SCHEDULED', 'SCHEDULED', 'COMPLETED', 'NO_SHOW']).optional(),
  notes: maxStringLength(2000).optional(),
})

/**
 * Checkout schemas
 */
export const checkoutSchema = z.object({
  agentId: uuidPattern,
  assistedSetupRequested: z.boolean().optional().default(false),
  bookCallRequested: z.boolean().optional().default(false),
})

/**
 * Agent submission schemas
 */
export const agentSubmissionSchema = z.object({
  title: z.string().min(3).max(100),
  shortDescription: z.string().min(10).max(300),
  workflowOverview: z.string().min(20).max(2000),
  useCase: z.string().min(10).max(500),
  categoryId: uuidPattern,
  price: nonNegativeNumber,
  supportAddonPrice: nonNegativeNumber.optional(),
  assistedSetupEnabled: z.boolean().optional(),
  assistedSetupPrice: nonNegativeNumber.optional(),
  bookCallEnabled: z.boolean().optional(),
  demoVideoUrl: z.string().url().optional().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  setupGuide: z.string().min(20).max(5000),
  workflowDetails: workflowDetailsSchema, // Typed JSON field (P1.15)
})

// ============================================
// Validation Middleware Utilities (P2.16)
// ============================================

/**
 * Format Zod validation errors into a user-friendly message
 */
export function formatZodErrors(error: ZodError): string {
  return error.errors
    .map(err => {
      const path = err.path.join('.')
      return path ? `${path}: ${err.message}` : err.message
    })
    .join(', ')
}

/**
 * Validate request body against a Zod schema
 * Returns parsed data or throws NextResponse error
 */
export async function validateBody<T>(request: NextRequest, schema: ZodSchema<T>): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      throw NextResponse.json(
        { success: false, error: 'Validation failed', details: formatZodErrors(error) },
        { status: 400 }
      )
    }
    throw NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}

/**
 * Validate query parameters against a Zod schema
 * Returns parsed data or throws NextResponse error
 */
export function validateQuery<T>(request: NextRequest, schema: ZodSchema<T>): T {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())
  const result = schema.safeParse(params)

  if (!result.success) {
    throw NextResponse.json(
      { success: false, error: 'Invalid query parameters', details: formatZodErrors(result.error) },
      { status: 400 }
    )
  }

  return result.data
}

/**
 * Validation middleware wrapper
 * Wraps an API handler with automatic validation
 */
export function withValidation<TQuery = unknown, TBody = unknown>(
  config: {
    query?: ZodSchema<TQuery>
    body?: ZodSchema<TBody>
  },
  handler: (
    request: NextRequest,
    validated: { query?: TQuery; body?: TBody }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const validated: { query?: TQuery; body?: TBody } = {}

      // Validate query parameters if schema provided
      if (config.query) {
        validated.query = validateQuery(request, config.query)
      }

      // Validate body if schema provided (only for POST, PUT, PATCH)
      if (config.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        validated.body = await validateBody(request, config.body)
      }

      return await handler(request, validated)
    } catch (error) {
      // If error is already a NextResponse, return it
      if (error instanceof NextResponse) {
        return error
      }
      // Otherwise wrap in generic error
      return NextResponse.json(
        { success: false, error: 'Request validation failed' },
        { status: 400 }
      )
    }
  }
}
