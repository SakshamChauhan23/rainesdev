import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { ArrowRight, Sparkles, Mail, ShoppingBag, Layout, Database, Zap, Workflow, Bot } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#404145] py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center">
            {/* Headline */}
            <h1 className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl animate-fade-in">
              Automate your business{' '}
              <span className="font-light italic text-[#8DEC42]">in minutes</span>
            </h1>

            {/* Subheadline */}
            <p className="mb-10 text-lg font-light text-white/90 sm:text-xl animate-fade-in-delay-1">
              No code. No AI skills. Just connect your tools and get results.
            </p>

            {/* CTA */}
            <div className="mb-12 animate-fade-in-delay-2">
              <Link href="/agents">
                <Button size="lg" className="rounded-md bg-[#8DEC42] px-8 font-normal text-white transition-all hover:bg-[#7ACC3B] hover:scale-105">
                  Browse AI Agents
                </Button>
              </Link>
            </div>

            {/* Trust Strip */}
            <div className="animate-fade-in-delay-3">
              <p className="mb-6 text-sm font-light text-white/70">
                Built for small teams using
              </p>
              <div className="flex flex-wrap items-center gap-x-12 gap-y-6 text-white/60">
                <div className="flex flex-col items-center gap-2 transition-transform hover:scale-110">
                  <Mail className="h-7 w-7" />
                  <span className="text-xs font-light">Gmail</span>
                </div>
                <div className="flex flex-col items-center gap-2 transition-transform hover:scale-110">
                  <ShoppingBag className="h-7 w-7" />
                  <span className="text-xs font-light">Shopify</span>
                </div>
                <div className="flex flex-col items-center gap-2 transition-transform hover:scale-110">
                  <Layout className="h-7 w-7" />
                  <span className="text-xs font-light">Webflow</span>
                </div>
                <div className="flex flex-col items-center gap-2 transition-transform hover:scale-110">
                  <Database className="h-7 w-7" />
                  <span className="text-xs font-light">Simple CRMs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Image */}
          <div className="relative hidden lg:flex items-center justify-center animate-fade-in-delay-2">
            <div className="relative w-full max-w-xl">
              {/* Decorative background gradient */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-400/20 to-purple-600/20 blur-3xl animate-pulse" />

              {/* Main visual - using icons as a placeholder for automation workflow */}
              <div className="relative rounded-lg bg-white/10 p-8 backdrop-blur-sm border border-white/20">
                <div className="space-y-6">
                  {/* Workflow visualization */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-gradient-to-r from-green-300 to-purple-400 rounded" />
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
                      <Bot className="h-8 w-8 text-green-300" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-gradient-to-r from-purple-400 to-green-300 rounded" />
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
                      <ShoppingBag className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-300/30 transition-transform hover:scale-110">
                      <Zap className="h-6 w-6 text-green-300" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-400/30 transition-transform hover:scale-110">
                      <Workflow className="h-6 w-6 text-purple-300" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-300/30 transition-transform hover:scale-110">
                      <Sparkles className="h-6 w-6 text-green-300" />
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/10 p-4 text-center">
                    <p className="text-sm font-light text-white/90">
                      Connect → Automate → Scale
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
