/**
 * Database-level validation utilities
 * These enforce constraints that should be at the database level
 * but Prisma doesn't support CHECK constraints directly
 */

import { Decimal } from '@prisma/client/runtime/library'

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
