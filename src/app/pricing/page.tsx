import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, Sparkles, Bot, Shield, Zap } from 'lucide-react'

const features = [
  'Access to all 200+ AI agents',
  'New agents added regularly',
  'Complete setup guides & workflows',
  'Community support',
  'Cancel anytime',
  'No per-agent fees',
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
          <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-brand-teal/10 blur-3xl" />
        </div>

        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange">
              <Sparkles className="h-4 w-4" />
              <span>Simple, transparent pricing</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl md:text-6xl">
              Unlimited AI Agents, <span className="text-brand-orange">One Simple Price</span>
            </h1>

            <p className="mx-auto mb-16 max-w-2xl text-lg leading-relaxed text-brand-slate/70">
              Get instant access to our entire library of AI agents. No per-agent fees, no hidden
              costs.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="mx-auto max-w-lg">
            <div className="relative rounded-3xl border-2 border-brand-orange/20 bg-white p-8 shadow-2xl shadow-brand-slate/10 sm:p-10">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-brand-orange px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-orange/30">
                  14-day free trial
                </span>
              </div>

              <div className="mb-8 text-center">
                <h2 className="mb-2 text-2xl font-bold text-brand-slate">Rouze.ai All-Access</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-normal text-brand-slate/40 line-through">
                    $19.99
                  </span>
                  <span className="text-5xl font-bold text-brand-slate">$12.99</span>
                  <span className="text-lg text-brand-slate/60">/month</span>
                </div>
                <p className="mt-2 text-sm font-medium text-brand-orange">Early user discount</p>
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-4">
                {features.map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-teal/10">
                      <Check className="h-4 w-4 text-brand-teal" />
                    </div>
                    <span className="text-brand-slate">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/subscribe">
                <Button
                  size="lg"
                  className="group w-full rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <p className="mt-4 text-center text-sm font-medium text-brand-slate/60">
                Cancel at anytime. No questions asked.
              </p>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-8 text-sm text-brand-slate/60">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-teal" />
              <span>Secure checkout via Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-brand-orange" />
              <span>200+ agents and growing</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-teal" />
              <span>Instant access</span>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
