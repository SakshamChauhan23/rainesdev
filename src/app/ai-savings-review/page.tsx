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
} from 'lucide-react'

export const metadata = {
  title: 'AI Savings Review | Rouze.ai',
  description:
    'Discover how much time and money AI can save your business. Get a personalized savings report from our experts.',
}

const snapshotFeatures = [
  '30-minute expert consultation',
  'Top 3 AI automation opportunities',
  'Estimated ROI per opportunity',
  'Recommended Rouze agents to deploy',
  'Delivered within 5 business days',
]

const fullReviewFeatures = [
  '60-minute deep-dive consultation',
  'Full workflow audit across departments',
  'Detailed ROI projections with timelines',
  'Custom implementation roadmap',
  'Agent configuration recommendations',
  'Priority support for 30 days',
  'Delivered within 10 business days',
]

export default function AISavingsReviewPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-brand-cream">
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
              <span>Expert AI Consulting</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl md:text-6xl">
              Find out how much AI can{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">save your business.</span>
                <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
              </span>
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-brand-slate/70 sm:text-xl">
              Our experts analyze your workflows, identify automation opportunities, and deliver a
              personalized savings report — with the exact AI agents to deploy.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#pricing">
                <Button
                  size="lg"
                  className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl"
                >
                  See Pricing
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="mx-auto mb-16 max-w-3xl text-center">
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

      {/* Pricing Cards */}
      <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
        <Container>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
              Choose your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">review tier</span>
                <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
              </span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Snapshot */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-brand-slate/10 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6">
                <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal">
                  <Zap className="h-3 w-3" />
                  Quick Audit
                </div>
                <h3 className="mb-1 text-2xl font-bold text-brand-slate">Snapshot</h3>
                <p className="text-brand-slate/60">Perfect for small teams getting started</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold text-brand-slate">$499</span>
                <span className="text-brand-slate/60"> one-time</span>
              </div>

              <ul className="mb-8 space-y-3">
                {snapshotFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-teal" />
                    <span className="text-brand-slate/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/ai-savings-review/intake?tier=SNAPSHOT">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-2xl border-2 border-brand-teal py-6 font-semibold text-brand-teal transition-all hover:bg-brand-teal hover:text-white"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Full Review */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-brand-orange/30 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute right-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                Most Popular
              </div>

              <div className="mb-6">
                <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange">
                  <BarChart3 className="h-3 w-3" />
                  Deep Dive
                </div>
                <h3 className="mb-1 text-2xl font-bold text-brand-slate">Full Review</h3>
                <p className="text-brand-slate/60">Comprehensive audit with implementation plan</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold text-brand-slate">$999</span>
                <span className="text-brand-slate/60"> one-time</span>
              </div>

              <ul className="mb-8 space-y-3">
                {fullReviewFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" />
                    <span className="text-brand-slate/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/ai-savings-review/intake?tier=FULL_REVIEW">
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
      <section className="bg-white py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-brand-slate">Not sure which tier?</h2>
            <p className="mb-8 text-lg text-brand-slate/70">
              Start with a Snapshot. If you need more depth, upgrade to a Full Review anytime — and
              we will credit your Snapshot payment.
            </p>
            <Link href="/ai-savings-review/intake?tier=SNAPSHOT">
              <Button
                size="lg"
                className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90"
              >
                Start with Snapshot — $499
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
