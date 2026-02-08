'use client'

import { Container } from '@/components/layout/container'
import { useEffect, useRef, useState } from 'react'
import {
  Search,
  ShoppingCart,
  CreditCard,
  Rocket,
  Hammer,
  FileText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

const buyerSteps = [
  {
    number: 1,
    icon: Search,
    title: 'Discover',
    description: 'Browse our marketplace and find the perfect AI agent for your needs',
    detail: 'Search by category, filter by features, or explore trending agents',
    color: 'orange',
  },
  {
    number: 2,
    icon: ShoppingCart,
    title: 'Review & Select',
    description: 'Check ratings, read reviews, and compare different options',
    detail: 'See verified buyer feedback and detailed agent capabilities',
    color: 'teal',
  },
  {
    number: 3,
    icon: CreditCard,
    title: 'Checkout',
    description: 'Complete your purchase with our secure payment system',
    detail: 'One-click checkout with transparent pricing and instant confirmation',
    color: 'orange',
  },
  {
    number: 4,
    icon: Rocket,
    title: 'Launch & Scale',
    description: 'Deploy your AI agent and watch it transform your workflow',
    detail: 'Get instant access, monitor performance, and scale as needed',
    color: 'teal',
  },
]

const sellerSteps = [
  {
    number: 1,
    icon: Hammer,
    title: 'Create & Build',
    description: 'Develop your AI agent and prepare it for the marketplace',
    detail: 'Build your solution, define features, and test thoroughly before listing',
    color: 'orange',
  },
  {
    number: 2,
    icon: FileText,
    title: 'List & Optimize',
    description: 'Publish your agent with compelling descriptions and competitive pricing',
    detail: 'Add screenshots, demos, and detailed documentation to attract buyers',
    color: 'teal',
  },
  {
    number: 3,
    icon: ShieldCheck,
    title: 'Get Approved',
    description: 'Our team reviews your agent for quality and marketplace standards',
    detail: 'Quality assurance process ensures reliability and security for buyers',
    color: 'orange',
  },
  {
    number: 4,
    icon: TrendingUp,
    title: 'Earn & Grow',
    description: 'Start generating revenue and scale your AI agent business',
    detail: 'Keep majority of each sale while we handle payments, support, and marketing',
    color: 'teal',
  },
]

export function HowItWorksTimeline() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
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

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % 4)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isVisible])

  useEffect(() => {
    setActiveStep(0)
  }, [activeTab])

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
            How It{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-orange">Works</span>
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

        {/* Subtitle under tabs */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-lg text-brand-slate/70 sm:text-xl">
            {activeTab === 'buyers'
              ? 'From discovery to deployment in 4 simple steps'
              : 'From building to earning in 4 simple steps'}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line (mobile) */}
          <div className="absolute bottom-0 left-8 top-0 w-0.5 bg-gradient-to-b from-brand-orange via-brand-teal to-brand-orange md:hidden" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              const isOrange = step.color === 'orange'

              return (
                <div
                  key={`${activeTab}-${index}`}
                  className={`relative transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                  style={{ transitionDelay: `${200 + index * 150}ms` }}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-12 md:items-center md:gap-8">
                    {/* Left side (odd numbers) */}
                    {index % 2 === 0 && (
                      <>
                        <div className="col-span-5 text-right">
                          <div
                            className={`inline-block rounded-3xl bg-white p-8 shadow-lg transition-all duration-500 ${isActive ? 'scale-105 shadow-2xl' : ''}`}
                          >
                            <h3 className="mb-2 text-2xl font-bold text-brand-slate">
                              {step.title}
                            </h3>
                            <p className="mb-3 text-brand-slate/70">{step.description}</p>
                            <p className="text-sm text-brand-slate/50">{step.detail}</p>
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <div
                            className={`relative flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500 ${
                              isActive
                                ? isOrange
                                  ? 'scale-125 bg-brand-orange shadow-xl shadow-brand-orange/50'
                                  : 'scale-125 bg-brand-teal shadow-xl shadow-brand-teal/50'
                                : 'bg-brand-slate/10'
                            }`}
                          >
                            <Icon
                              className={`h-10 w-10 transition-all duration-500 ${isActive ? 'text-white' : isOrange ? 'text-brand-orange' : 'text-brand-teal'}`}
                            />
                            <div
                              className={`absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                isOrange ? 'bg-brand-orange text-white' : 'bg-brand-teal text-white'
                              }`}
                            >
                              {step.number}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-5" />
                      </>
                    )}

                    {/* Right side (even numbers) */}
                    {index % 2 === 1 && (
                      <>
                        <div className="col-span-5" />
                        <div className="col-span-2 flex justify-center">
                          <div
                            className={`relative flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500 ${
                              isActive
                                ? isOrange
                                  ? 'scale-125 bg-brand-orange shadow-xl shadow-brand-orange/50'
                                  : 'scale-125 bg-brand-teal shadow-xl shadow-brand-teal/50'
                                : 'bg-brand-slate/10'
                            }`}
                          >
                            <Icon
                              className={`h-10 w-10 transition-all duration-500 ${isActive ? 'text-white' : isOrange ? 'text-brand-orange' : 'text-brand-teal'}`}
                            />
                            <div
                              className={`absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                isOrange ? 'bg-brand-orange text-white' : 'bg-brand-teal text-white'
                              }`}
                            >
                              {step.number}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-5 text-left">
                          <div
                            className={`inline-block rounded-3xl bg-white p-8 shadow-lg transition-all duration-500 ${isActive ? 'scale-105 shadow-2xl' : ''}`}
                          >
                            <h3 className="mb-2 text-2xl font-bold text-brand-slate">
                              {step.title}
                            </h3>
                            <p className="mb-3 text-brand-slate/70">{step.description}</p>
                            <p className="text-sm text-brand-slate/50">{step.detail}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile Layout */}
                  <div className="flex items-start gap-6 md:hidden">
                    <div
                      className={`relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ${
                        isActive
                          ? isOrange
                            ? 'bg-brand-orange shadow-xl shadow-brand-orange/50'
                            : 'bg-brand-teal shadow-xl shadow-brand-teal/50'
                          : 'bg-brand-slate/10'
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 transition-all duration-500 ${isActive ? 'text-white' : isOrange ? 'text-brand-orange' : 'text-brand-teal'}`}
                      />
                      <div
                        className={`absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          isOrange ? 'bg-brand-orange text-white' : 'bg-brand-teal text-white'
                        }`}
                      >
                        {step.number}
                      </div>
                    </div>
                    <div
                      className={`flex-1 rounded-3xl bg-white p-6 shadow-lg transition-all duration-500 ${isActive ? 'scale-105 shadow-2xl' : ''}`}
                    >
                      <h3 className="mb-2 text-xl font-bold text-brand-slate">{step.title}</h3>
                      <p className="mb-2 text-sm text-brand-slate/70">{step.description}</p>
                      <p className="text-xs text-brand-slate/50">{step.detail}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress Indicators */}
        <div
          className={`mt-16 flex justify-center gap-3 transition-all delay-1000 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeStep === index
                  ? step.color === 'orange'
                    ? 'w-12 bg-brand-orange'
                    : 'w-12 bg-brand-teal'
                  : 'w-2 bg-brand-slate/20 hover:bg-brand-slate/40'
              }`}
              aria-label={`Step ${index + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
