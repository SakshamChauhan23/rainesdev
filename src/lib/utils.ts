import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Decimal } from '@prisma/client/runtime/library'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price as USD currency (P3.5)
 * Handles both number and Prisma Decimal types
 */
export function formatPrice(price: number | Decimal): string {
  const numPrice = typeof price === 'number' ? price : Number(price)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numPrice)
}

/**
 * Format price in compact notation for large numbers (P3.5)
 * e.g., $1,234 -> $1.2K, $1,234,567 -> $1.2M
 */
export function formatPriceCompact(price: number | Decimal): string {
  const numPrice = typeof price === 'number' ? price : Number(price)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(numPrice)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
