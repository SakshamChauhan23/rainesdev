'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import {
  Search,
  Zap,
  CheckCircle2,
  ArrowRight,
  Hammer,
  FileText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

const buyerSteps = [
  {
    number: 1,
    icon: Search,
    title: 'Browse agents by your business type',
    description:
      'Find AI agents built for your industry — dental, real estate, e-commerce, and more.',
    color: 'orange',
  },
  {
    number: 2,
    icon: Zap,
    title: 'Test any agent free for 14 days',
    description: 'No credit card needed. Turn agents on or off from your simple dashboard.',
    color: 'teal',
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: "Keep what saves time. Cancel what doesn't.",
    description: "One-click cancellation. No contracts, no complexity. You're always in control.",
    color: 'orange',
  },
]

const sellerSteps = [
  {
    number: 1,
    icon: Hammer,
    title: 'Create & Build',
    description: 'Develop your AI agent and prepare it for the marketplace.',
    color: 'orange',
  },
  {
    number: 2,
    icon: FileText,
    title: 'List & Optimize',
    description: 'Publish your agent with compelling descriptions and competitive pricing.',
    color: 'teal',
  },
  {
    number: 3,
    icon: ShieldCheck,
    title: 'Get Approved',
    description: 'Our team reviews your agent for quality and marketplace standards.',
    color: 'orange',
  },
  {
    number: 4,
    icon: TrendingUp,
    title: 'Earn & Grow',
    description: 'Start generating revenue and scale your AI agent business.',
    color: 'teal',
  },
]

export function HowItWorksTimeline() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'buyers' | 'sellers'>('buyers')
  const sectionRef = useRef<HTMLDivElement>(null)

  const steps = activeTab === 'buyers' ? buyerSteps : sellerSteps

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
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden bg-brand-cream py-20 sm:py-28 lg:py-32"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-brand-orange/20 to-transparent" />
        <div className="absolute left-2/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-brand-teal/20 to-transparent" />
        <div className="absolute left-3/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-brand-orange/20 to-transparent" />
      </div>

      <Container>
        {/* Section Header */}
        <div
          className={`mx-auto mb-10 max-w-3xl text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl md:text-5xl">
            Simple enough for{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-orange">any business owner.</span>
              <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
            </span>
          </h2>
        </div>

        {/* Tabs */}
        <div
          className={`mx-auto mb-16 flex max-w-md justify-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="inline-flex rounded-2xl border border-brand-slate/10 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab('buyers')}
              className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                activeTab === 'buyers'
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                  : 'text-brand-slate/70 hover:text-brand-orange'
              }`}
            >
              For Buyers
            </button>
            <button
              onClick={() => setActiveTab('sellers')}
              className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                activeTab === 'sellers'
                  ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/30'
                  : 'text-brand-slate/70 hover:text-brand-teal'
              }`}
            >
              For Sellers
            </button>
          </div>
        </div>

        {/* Zigzag Timeline */}
        <div className="relative mx-auto max-w-5xl">
          {/* Center vertical line - desktop only */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-brand-orange/30 via-brand-teal/30 to-brand-orange/30 md:block" />

          {/* Mobile vertical line */}
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-brand-orange/30 via-brand-teal/30 to-brand-orange/30 md:hidden" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isOrange = step.color === 'orange'
              const isLeft = index % 2 === 0

              return (
                <div
                  key={`${activeTab}-${index}`}
                  className={`relative transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${200 + index * 200}ms` }}
                >
                  {/* Desktop layout - flex with fixed center */}
                  <div className="hidden md:flex md:items-center">
                    {/* Left side - always 45% width */}
                    <div className="w-[45%] pr-8">
                      {isLeft && (
                        <div className="rounded-3xl border-2 border-brand-slate/10 bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                          <h3 className="mb-3 text-xl font-bold text-brand-slate">{step.title}</h3>
                          <p className="leading-relaxed text-brand-slate/70">{step.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Center icon - always 10% width, centered */}
                    <div className="flex w-[10%] justify-center">
                      <div
                        className={`relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg transition-all duration-500 ${
                          isOrange
                            ? 'bg-brand-orange shadow-brand-orange/30'
                            : 'bg-brand-teal shadow-brand-teal/30'
                        }`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                        <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-slate text-xs font-bold text-white">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Right side - always 45% width */}
                    <div className="w-[45%] pl-8">
                      {!isLeft && (
                        <div className="rounded-3xl border-2 border-brand-slate/10 bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                          <h3 className="mb-3 text-xl font-bold text-brand-slate">{step.title}</h3>
                          <p className="leading-relaxed text-brand-slate/70">{step.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="flex items-start gap-6 md:hidden">
                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${
                          isOrange
                            ? 'bg-brand-orange shadow-brand-orange/30'
                            : 'bg-brand-teal shadow-brand-teal/30'
                        }`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                        <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-slate text-xs font-bold text-white">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 rounded-3xl border-2 border-brand-slate/10 bg-white p-6 shadow-lg">
                      <h3 className="mb-2 text-lg font-bold text-brand-slate">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-brand-slate/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Line */}
        <div
          className={`mx-auto mt-12 max-w-2xl text-center transition-all delay-700 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <p className="text-lg font-semibold text-brand-slate sm:text-xl">
            {activeTab === 'buyers'
              ? 'You\u2019re in control. Always. No contracts. No complexity.'
              : 'From building to earning in 4 simple steps.'}
          </p>
        </div>

        {/* CTA */}
        <div
          className={`mt-12 flex flex-col items-center justify-center gap-4 transition-all delay-1000 duration-1000 sm:flex-row sm:gap-6 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <Link href={activeTab === 'buyers' ? '/agents' : '/become-seller'}>
            <Button
              size="lg"
              className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40"
            >
              {activeTab === 'buyers' ? 'Browse Agents' : 'Start Selling'}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
