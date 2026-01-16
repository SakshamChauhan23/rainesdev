/**
 * Simple in-memory caching utility (P2.2)
 *
 * For production scaling, this can be replaced with Redis/Upstash.
 * This implementation provides:
 * - TTL-based expiration
 * - LRU eviction when max entries reached
 * - Stale-while-revalidate pattern
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
  staleAt: number
}

interface CacheConfig {
  maxEntries?: number
  defaultTtl?: number // milliseconds
  staleTtl?: number // milliseconds - time to serve stale data while revalidating
}

const DEFAULT_CONFIG: Required<CacheConfig> = {
  maxEntries: 1000,
  defaultTtl: 60 * 1000, // 1 minute
  staleTtl: 120 * 1000, // 2 minutes (serve stale for 1 extra minute)
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private accessOrder: string[] = []
  private config: Required<CacheConfig>
  private revalidating = new Set<string>()

  constructor(config: CacheConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }

    // Periodic cleanup of expired entries
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  /**
   * Get a value from cache
   * Returns undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    if (!entry) return undefined

    const now = Date.now()

    // Expired beyond stale period - return undefined
    if (now > entry.staleAt) {
      this.cache.delete(key)
      return undefined
    }

    // Update access order for LRU
    this.updateAccessOrder(key)

    return entry.data
  }

  /**
   * Get with stale-while-revalidate support
   * Returns { data, isStale } or undefined
   */
  getWithStale<T>(key: string): { data: T; isStale: boolean } | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    if (!entry) return undefined

    const now = Date.now()

    // Completely expired
    if (now > entry.staleAt) {
      this.cache.delete(key)
      return undefined
    }

    this.updateAccessOrder(key)

    return {
      data: entry.data,
      isStale: now > entry.expiresAt,
    }
  }

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // Enforce max entries with LRU eviction
    if (this.cache.size >= this.config.maxEntries && !this.cache.has(key)) {
      this.evictLRU()
    }

    const effectiveTtl = ttl ?? this.config.defaultTtl
    const now = Date.now()

    this.cache.set(key, {
      data,
      expiresAt: now + effectiveTtl,
      staleAt: now + this.config.staleTtl,
    })

    this.updateAccessOrder(key)
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    this.accessOrder = this.accessOrder.filter(k => k !== key)
    return this.cache.delete(key)
  }

  /**
   * Clear all entries matching a pattern
   */
  invalidate(pattern: string | RegExp): number {
    let count = 0
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        count++
      }
    }

    this.accessOrder = this.accessOrder.filter(k => !regex.test(k))
    return count
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear()
    this.accessOrder = []
  }

  /**
   * Check if key is currently being revalidated
   */
  isRevalidating(key: string): boolean {
    return this.revalidating.has(key)
  }

  /**
   * Mark key as being revalidated
   */
  setRevalidating(key: string, value: boolean): void {
    if (value) {
      this.revalidating.add(key)
    } else {
      this.revalidating.delete(key)
    }
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; maxEntries: number } {
    return {
      size: this.cache.size,
      maxEntries: this.config.maxEntries,
    }
  }

  private updateAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
    this.accessOrder.push(key)
  }

  private evictLRU(): void {
    if (this.accessOrder.length > 0) {
      const lruKey = this.accessOrder.shift()!
      this.cache.delete(lruKey)
    }
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.staleAt) {
        this.cache.delete(key)
        this.accessOrder = this.accessOrder.filter(k => k !== key)
      }
    }
  }
}

// Export a singleton instance for the application
export const appCache = new MemoryCache({
  maxEntries: 500,
  defaultTtl: 60 * 1000, // 1 minute default
  staleTtl: 180 * 1000, // 3 minutes stale
})

/**
 * Helper to create cache key from request parameters
 */
export function createCacheKey(
  prefix: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const sortedParams = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')

  return `${prefix}:${sortedParams || 'default'}`
}

/**
 * Cache wrapper with stale-while-revalidate pattern
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache
  const cached = appCache.getWithStale<T>(key)

  if (cached) {
    // Fresh data - return immediately
    if (!cached.isStale) {
      return cached.data
    }

    // Stale data - return it but trigger background revalidation
    if (!appCache.isRevalidating(key)) {
      appCache.setRevalidating(key, true)
      // Revalidate in background (don't await)
      fetcher()
        .then(data => {
          appCache.set(key, data, ttl)
        })
        .catch(() => {
          // Keep stale data on error
        })
        .finally(() => {
          appCache.setRevalidating(key, false)
        })
    }

    return cached.data
  }

  // No cached data - fetch and cache
  const data = await fetcher()
  appCache.set(key, data, ttl)
  return data
}
