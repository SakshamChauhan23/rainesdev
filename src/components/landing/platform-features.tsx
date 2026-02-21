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
    description: "No IT team needed. Pick an agent, connect it, and it's working the same day.",
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
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column — Features */}
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

            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const isOrange = feature.color === 'orange'
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-4 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                    style={{ transitionDelay: `${200 + index * 80}ms` }}
                  >
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isOrange
                          ? 'bg-brand-orange/10 text-brand-orange'
                          : 'bg-brand-teal/10 text-brand-teal'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-brand-slate">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-brand-slate/60">
                        {feature.description}
                      </p>
                    </div>
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
