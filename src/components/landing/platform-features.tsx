'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'

const stats = [
  {
    value: '200+',
    label: 'Ready-to-use agents',
    color: 'orange',
  },
  {
    value: '14 days',
    label: 'Free trial, no card needed',
    color: 'teal',
  },
  {
    value: 'Same day',
    label: 'Go live, no IT team required',
    color: 'teal',
  },
  {
    value: '$0',
    label: 'Setup or onboarding cost',
    color: 'orange',
  },
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

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const isOrange = stat.color === 'orange'
                return (
                  <div
                    key={index}
                    className={`rounded-2xl border-2 p-6 transition-all duration-500 ${
                      isOrange
                        ? 'border-brand-orange/20 bg-brand-orange/5'
                        : 'border-brand-teal/20 bg-brand-teal/5'
                    } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    <p
                      className={`mb-1 text-3xl font-extrabold tracking-tight sm:text-4xl ${
                        isOrange ? 'text-brand-orange' : 'text-brand-teal'
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium leading-snug text-brand-slate/70">
                      {stat.label}
                    </p>
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
