'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'

const reasons = [
  { title: 'Agents Built for Your Industry', color: 'orange' },
  { title: 'Tested Before You See Them', color: 'teal' },
  { title: 'No Surprise Costs', color: 'orange' },
  { title: 'Live in Minutes, Not Weeks', color: 'teal' },
  { title: 'Zero Technical Skill Required', color: 'orange' },
  { title: 'Real Reviews from Real Owners', color: 'teal' },
]

export function PlatformFeatures() {
  const [isVisible, setIsVisible] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-brand-teal/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-brand-orange/5 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column */}
          <div
            className={`flex flex-col transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {/* Heading */}
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl md:text-5xl">
              Why Business Owners{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">Choose Rouze</span>
                <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
              </span>
            </h2>
            <p className="mb-10 text-lg text-brand-slate/70">
              Built for people who run businesses, not for engineers.
            </p>

            {/* Numbered List */}
            <div className="flex flex-col divide-y divide-brand-slate/10">
              {reasons.map((reason, index) => {
                const isOrange = reason.color === 'orange'
                const num = String(index + 1).padStart(2, '0')
                return (
                  <div
                    key={index}
                    className={`group flex items-center gap-5 py-4 transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                    style={{ transitionDelay: `${150 + index * 80}ms` }}
                  >
                    <span
                      className={`shrink-0 text-2xl font-black tabular-nums transition-colors ${
                        isOrange
                          ? 'text-brand-orange/30 group-hover:text-brand-orange'
                          : 'text-brand-teal/30 group-hover:text-brand-teal'
                      }`}
                    >
                      {num}
                    </span>
                    <span className="text-base font-semibold text-brand-slate transition-colors group-hover:text-brand-slate/80 sm:text-lg">
                      {reason.title}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <div
              className={`mt-10 transition-all delay-700 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <Link href="/agents">
                <Button
                  size="lg"
                  className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40"
                >
                  Browse AI Agents
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column — Video */}
          <div
            className={`transition-all delay-300 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
          >
            <div className="relative overflow-hidden rounded-3xl border border-brand-slate/10 bg-brand-slate shadow-2xl shadow-brand-slate/20">
              {/* Video header bar */}
              <div className="flex items-center gap-2 bg-brand-slate/90 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs text-white/40">Platform Walkthrough</span>
              </div>
              {/* YouTube embed */}
              <div className="relative aspect-video w-full">
                <iframe
                  src="https://www.youtube.com/embed/TBNXAMTf8ag?rel=0&modestbranding=1"
                  title="Rouze.ai Platform Walkthrough"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>

            {/* Caption */}
            <p className="mt-4 text-center text-sm text-brand-slate/50">
              See how easy it is to find and deploy your first AI agent
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
