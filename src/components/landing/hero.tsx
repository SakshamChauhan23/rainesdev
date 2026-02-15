'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { ArrowRight, Sparkles, Zap, Bot, TrendingUp, Users, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-20 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-brand-teal/10 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text Content */}
          <div
            className={`flex flex-col justify-center transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange">
              <Sparkles className="h-4 w-4" />
              <span>AI Agent Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl md:text-6xl lg:text-6xl">
              The AI agent marketplace for business owners{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">
                  who want to grow without hiring.
                </span>
                <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-brand-slate/70 sm:text-xl">
              Browse ready-to-use AI agents built for real businesses. Test free. Keep what saves
              you time. Cancel what doesn&apos;t. No contracts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link href="/agents">
                <Button
                  size="lg"
                  className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40"
                >
                  Browse Agents for your industry
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-2 border-brand-slate/20 bg-white px-8 py-6 text-base font-semibold text-brand-slate transition-all hover:border-brand-teal hover:bg-brand-teal/5"
                >
                  See how it works
                </Button>
              </Link>
            </div>

            {/* Social Proof Line */}
            <div className="mt-12 flex flex-wrap items-center gap-4 text-sm text-brand-slate/60 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-orange/20">
                  <Users className="h-4 w-4 text-brand-orange" />
                </div>
                <span className="font-medium text-brand-slate">1,000+ SMBs running agents</span>
              </div>
              <div className="hidden h-4 w-px bg-brand-slate/20 sm:block" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-teal/20">
                  <Bot className="h-4 w-4 text-brand-teal" />
                </div>
                <span className="font-medium text-brand-slate">200+ agents available</span>
              </div>
              <div className="hidden h-4 w-px bg-brand-slate/20 sm:block" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-orange/20">
                  <Clock className="h-4 w-4 text-brand-orange" />
                </div>
                <span className="font-medium text-brand-slate">14-day free trial (no card)</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Preview */}
          <div
            className={`relative hidden transition-all delay-300 duration-1000 lg:block ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
          >
            <div className="relative">
              {/* Main Card - Agent Preview */}
              <div className="relative rounded-3xl border border-brand-slate/10 bg-white p-8 shadow-2xl shadow-brand-slate/10">
                {/* Card Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal">
                      AI BDR Agent
                    </div>
                    <h3 className="text-xl font-bold text-brand-slate">
                      Sales Outreach Automation
                    </h3>
                    <p className="mt-1 text-sm text-brand-slate/60">
                      Engages leads instantly. Drives pipeline 24/7
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange/80 shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Features Grid */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-brand-cream p-4 transition-all hover:bg-brand-cream/70">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Sparkles className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-slate">No cold leads</p>
                      <p className="text-xs text-brand-slate/60">Every follow-up handled</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-brand-cream p-4 transition-all hover:bg-brand-cream/70">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Zap className="h-5 w-5 text-brand-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-slate">Speed to lead</p>
                      <p className="text-xs text-brand-slate/60">Instant, every time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-brand-cream p-4 transition-all hover:bg-brand-cream/70">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <TrendingUp className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-slate">Seamless integration</p>
                      <p className="text-xs text-brand-slate/60">Works where you work</p>
                    </div>
                  </div>
                </div>

                {/* CTA in Card */}
                <div className="mt-6 border-t border-brand-slate/10 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-brand-slate">
                        <span className="mr-2 text-base font-normal text-brand-slate/40 line-through">
                          $19.99
                        </span>
                        $12.99
                        <span className="text-sm font-normal text-brand-slate/60">/mo</span>
                      </p>
                      <p className="text-xs font-medium text-brand-orange">Early user discount</p>
                    </div>
                    <Link href="/subscribe">
                      <Button className="rounded-xl bg-brand-orange text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90">
                        Start Free Trial
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="animate-float absolute -right-6 -top-6 rounded-2xl border border-brand-slate/10 bg-white px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-brand-teal" />
                  <span className="text-sm font-medium text-brand-slate">Live and working</span>
                </div>
              </div>

              <div
                className="animate-float absolute -bottom-6 -left-6 rounded-2xl bg-brand-slate px-4 py-3 shadow-xl"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-orange" />
                  <span className="text-sm font-medium text-white">AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
