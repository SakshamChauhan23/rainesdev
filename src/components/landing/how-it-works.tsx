'use client'

import { Container } from '@/components/layout/container'
import { useEffect, useRef } from 'react'

const features = [
  'Automated customer support',
  'Lead generation & follow-ups',
  'Content creation at scale',
  'Data analysis & insights',
  'Internal task automation',
  'Email & CRM workflows',
  'Social media management',
  'Meeting scheduling',
  'Report generation',
  'Invoice processing',
  'Inventory tracking',
  'Customer onboarding',
]

export function HowItWorks() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollPosition = 0
    const scrollSpeed = 0.5

    const scroll = () => {
      scrollPosition += scrollSpeed
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
    }

    const intervalId = setInterval(scroll, 20)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="overflow-hidden bg-gray-100 py-16">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-light tracking-tight text-black sm:text-4xl">
            Make it all happen with AI agents
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-4 overflow-x-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {/* Duplicate the features array for seamless loop */}
          {[...features, ...features].map((feature, index) => (
            <div
              key={index}
              className="flex shrink-0 items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3"
            >
              <span className="text-sm font-light text-black">{feature}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
