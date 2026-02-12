'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, BarChart3, Target } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AISavingsReviewCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-slate via-brand-slate to-brand-slate/95 py-20 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-brand-teal/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div
          className={`mx-auto max-w-4xl transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange">
                <Sparkles className="h-4 w-4" />
                <span>New: Expert Consulting</span>
              </div>

              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Not sure where to start with AI?
              </h2>

              <p className="mb-8 text-lg leading-relaxed text-white/70">
                Our AI Savings Review analyzes your workflows and tells you exactly which agents
                will save you the most time and money. Starting at $499.
              </p>

              <Link href="/ai-savings-review">
                <Button
                  size="lg"
                  className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Right: Feature cards */}
            <div className="space-y-4">
              {[
                {
                  icon: BarChart3,
                  title: 'Personalized ROI Report',
                  description: 'See projected savings for your specific workflows.',
                },
                {
                  icon: Target,
                  title: 'Agent Recommendations',
                  description: 'Know exactly which agents to deploy first.',
                },
                {
                  icon: Sparkles,
                  title: 'Expert Consultation',
                  description: '1-on-1 call with our AI strategy team.',
                },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-orange/20">
                      <Icon className="h-6 w-6 text-brand-orange" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{feature.title}</h3>
                      <p className="text-sm text-white/60">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
