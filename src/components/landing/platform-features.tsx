'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import { Search, Shield, CreditCard, Zap, Settings, MessageSquare } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Agents Built for Your Industry',
    description:
      'Not generic AI tools — agents designed for dental offices, real estate teams, e-commerce stores, and more.',
    color: 'orange',
  },
  {
    icon: Shield,
    title: 'Tested Before You See Them',
    description:
      'Every agent is vetted and verified before it hits the marketplace. No guesswork on your end.',
    color: 'teal',
  },
  {
    icon: CreditCard,
    title: 'No Surprise Costs',
    description: 'Simple monthly pricing. Cancel anytime. What you see is what you pay.',
    color: 'orange',
  },
  {
    icon: Zap,
    title: 'Live in Minutes, Not Weeks',
    description:
      'No IT team needed. Pick an agent, connect it, and it\u2019s working the same day.',
    color: 'teal',
  },
  {
    icon: Settings,
    title: 'Zero Technical Skill Required',
    description: 'If you can use email, you can set up an agent. Point, click, done.',
    color: 'orange',
  },
  {
    icon: MessageSquare,
    title: 'Real Reviews from Real Owners',
    description: 'See what other business owners are saying before you commit.',
    color: 'teal',
  },
]

export function PlatformFeatures() {
  const [isVisible, setIsVisible] = useState(false)
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
        {/* Section Header */}
        <div
          className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl md:text-5xl">
            Why Business Owners{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-orange">Choose Rouze</span>
              <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
            </span>
          </h2>
          <p className="text-lg text-brand-slate/70 sm:text-xl">
            Built for people who run businesses, not for engineers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isOrange = feature.color === 'orange'

            return (
              <div
                key={index}
                className={`group rounded-3xl border border-brand-slate/5 bg-brand-cream/50 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-xl ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                    isOrange
                      ? 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'
                      : 'bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white'
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-brand-slate">{feature.title}</h3>
                <p className="leading-relaxed text-brand-slate/70">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div
          className={`mt-12 text-center transition-all delay-700 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
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
      </Container>
    </section>
  )
}
