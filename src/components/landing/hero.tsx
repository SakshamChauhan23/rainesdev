'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { ArrowRight, Sparkles, Zap, Bot, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-brand-cream py-20 sm:py-28 lg:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-brand-teal/10 blur-3xl" />
      </div>

      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className={`flex flex-col justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 self-start rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange border border-brand-orange/20">
              <Sparkles className="h-4 w-4" />
              <span>Build teams of AI agents</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl md:text-6xl lg:text-7xl">
              Build teams of{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">AI agents</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-brand-orange/20 -z-0" />
              </span>{' '}
              that deliver human-quality work
            </h1>

            {/* Subheadline */}
            <p className="mb-10 text-lg text-brand-slate/70 sm:text-xl max-w-2xl leading-relaxed">
              Get fully built and manage AI agents for sales, research, and workflows—no coding required. Our marketplace brings AI to work for you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link href="/agents">
                <Button
                  size="lg"
                  className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40 hover:-translate-y-0.5"
                >
                  Browse Agents
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-2 border-brand-slate/20 bg-white px-8 py-6 text-base font-semibold text-brand-slate transition-all hover:border-brand-teal hover:bg-brand-teal/5"
                >
                  Request a demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-6 text-sm text-brand-slate/60">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-brand-orange/20 border-2 border-white flex items-center justify-center">
                    <Bot className="h-4 w-4 text-brand-orange" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-brand-teal/20 border-2 border-white flex items-center justify-center">
                    <Zap className="h-4 w-4 text-brand-teal" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-brand-orange/20 border-2 border-white flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-brand-orange" />
                  </div>
                </div>
                <span className="font-medium text-brand-slate">50+ AI agents ready to deploy</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Preview */}
          <div className={`relative hidden lg:block transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Main Card - Agent Preview */}
              <div className="relative rounded-3xl bg-white p-8 shadow-2xl shadow-brand-slate/10 border border-brand-slate/10">
                {/* Card Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal">
                      AI BDR Agent
                    </div>
                    <h3 className="text-xl font-bold text-brand-slate">Sales Outreach Automation</h3>
                    <p className="mt-1 text-sm text-brand-slate/60">Engages leads instantly. Drives pipeline 24/7</p>
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
                <div className="mt-6 pt-6 border-t border-brand-slate/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-brand-slate">$49<span className="text-sm font-normal text-brand-slate/60">/month</span></p>
                    </div>
                    <Button className="rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg shadow-brand-orange/30">
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 rounded-2xl bg-white px-4 py-3 shadow-xl border border-brand-slate/10 animate-float">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
                  <span className="text-sm font-medium text-brand-slate">Live and working</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-brand-slate px-4 py-3 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
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
          0%, 100% {
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
