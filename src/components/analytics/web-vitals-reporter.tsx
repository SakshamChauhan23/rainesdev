'use client'

import { useEffect } from 'react'
import { initWebVitals } from '@/lib/web-vitals'

/**
 * WebVitalsReporter component
 * Add this to your root layout to start tracking Core Web Vitals
 */
export function WebVitalsReporter() {
  useEffect(() => {
    initWebVitals()
  }, [])

  // This component doesn't render anything
  return null
}
