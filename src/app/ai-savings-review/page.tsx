import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart3,
  FileText,
  Zap,
  Clock,
  Target,
  TrendingUp,
} from 'lucide-react'

export const metadata = {
  title: 'AI Savings Review | Rouze.ai',
  description:
    'Discover how much time and money AI can save your business. Get a personalized savings report from our experts.',
}

const includedFeatures = [
  'Expert consultation call (30–60 min based on scope)',
  'Top AI automation opportunities for your business',
  'Estimated ROI per opportunity',
  'Recommended Rouze agents to deploy',
  'Custom implementation roadmap',
  'Priority support during onboarding',
  'Delivered within 5–10 business days',
]

export default function AISavingsReviewPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-brand-cream">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
          <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-brand-teal/10 blur-3xl" />
        </div>

        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange">
              <Sparkles className="h-4 w-4" />
              <span>Expert AI Consulting</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl md:text-6xl">
              Find out how much AI can{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">save your business.</span>
                <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
              </span>
            </h1>

            <p className="mb-6 text-lg leading-relaxed text-brand-slate/70 sm:text-xl">
              Our experts analyze your workflows, identify automation opportunities, and deliver a
              personalized savings report — with the exact AI agents to deploy.
            </p>

            <p className="mb-10 text-base font-semibold text-brand-orange sm:text-lg">
              Clients typically save $3,000–5,000/month after implementing recommendations.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#pricing">
                <Button
                  size="lg"
                  className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl"
                >
                  Get Started — $499
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
              How it works
            </h2>
            <p className="text-lg text-brand-slate/70">Three simple steps to your savings report</p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                icon: FileText,
                title: 'Fill out the intake form',
                description:
                  'Tell us about your business, current tools, and where you spend the most time.',
                color: 'orange' as const,
              },
              {
                icon: Clock,
                title: 'Book your consultation',
                description:
                  'Schedule a call with our AI strategy team at a time that works for you.',
                color: 'teal' as const,
              },
              {
                icon: Target,
                title: 'Get your savings report',
                description:
                  'Receive a detailed report with ROI projections and recommended agents to deploy.',
                color: 'orange' as const,
              },
            ].map((step, index) => {
              const Icon = step.icon
              const isOrange = step.color === 'orange'
              return (
                <div key={index} className="text-center">
                  <div
                    className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${
                      isOrange
                        ? 'bg-brand-orange shadow-brand-orange/30'
                        : 'bg-brand-teal shadow-brand-teal/30'
                    }`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="mb-2 text-sm font-bold text-brand-slate/50">Step {index + 1}</div>
                  <h3 className="mb-3 text-xl font-bold text-brand-slate">{step.title}</h3>
                  <p className="leading-relaxed text-brand-slate/70">{step.description}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Pricing — Single Tier */}
      <section id="pricing" className="scroll-mt-20 py-16 sm:py-20">
        <Container>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
              One simple{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">price</span>
                <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
              </span>
            </h2>
            <p className="text-lg text-brand-slate/70">
              No tiers. No upsells. Just a clear path to AI savings.
            </p>
          </div>

          <div className="mx-auto max-w-lg">
            <div className="relative overflow-hidden rounded-3xl border-2 border-brand-orange/30 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              {/* ROI callout */}
              <div className="mb-6 rounded-2xl bg-brand-cream p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-orange">
                  <TrendingUp className="h-4 w-4" />
                  Most businesses uncover 10x+ in savings
                </div>
                <p className="mt-1 text-xs text-brand-slate/60">
                  Clients typically save $3,000–5,000/month after implementing recommendations.
                </p>
              </div>

              <div className="mb-6 text-center">
                <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange">
                  <BarChart3 className="h-3 w-3" />
                  AI Savings Review
                </div>
                <h3 className="mb-1 text-2xl font-bold text-brand-slate">Starting at</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-brand-slate">$499</span>
                </div>
                <p className="text-sm text-brand-slate/60">
                  Scope is finalized on your 1-on-1 call — larger engagements available.
                </p>
              </div>

              <ul className="mb-8 space-y-3">
                {includedFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" />
                    <span className="text-brand-slate/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/ai-savings-review/intake?tier=SNAPSHOT">
                <Button
                  size="lg"
                  className="w-full rounded-2xl bg-brand-orange py-6 font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:bg-brand-orange/90"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-brand-slate">
              The review pays for itself.
            </h2>
            <p className="mb-8 text-lg text-brand-slate/70">
              One $499 review can uncover thousands in monthly savings. Book your call and see the
              numbers for yourself.
            </p>
            <Link href="/ai-savings-review/intake?tier=SNAPSHOT">
              <Button
                size="lg"
                className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90"
              >
                Start Your AI Savings Review
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
