import { Container } from '@/components/layout/container'
import { Metadata } from 'next'
import Link from 'next/link'
import {
  Users,
  Zap,
  Clock,
  DollarSign,
  CheckCircle,
  Target,
  Heart,
  Eye,
  Rocket,
  Globe,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Rouze.ai',
  description:
    'Hire AI. Get to work. Rouze is where businesses hire digital workers. Think of us as the Shopify for AI.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
          <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-brand-teal/10 blur-3xl" />
        </div>

        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl lg:text-6xl">
              Hire AI.{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">Get to work.</span>
                <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
              </span>
            </h1>
            <p className="text-xl leading-relaxed text-brand-slate/70">
              Rouze is where businesses hire digital workers. Think of us as the{' '}
              <span className="font-semibold text-brand-teal">Shopify for AI</span>, a marketplace
              where you find and hire digital workers in minutes, not months.
            </p>
          </div>
        </Container>
      </section>

      {/* Digital Workers Benefits */}
      <section className="bg-white py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-brand-cream p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal/10">
                  <Clock className="h-6 w-6 text-brand-teal" />
                </div>
                <h3 className="font-semibold text-brand-slate">Never call in sick</h3>
                <p className="mt-2 text-sm text-brand-slate/60">
                  Available 24/7, every day of the year
                </p>
              </div>
              <div className="rounded-2xl bg-brand-cream p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
                  <Zap className="h-6 w-6 text-brand-orange" />
                </div>
                <h3 className="font-semibold text-brand-slate">Work around the clock</h3>
                <p className="mt-2 text-sm text-brand-slate/60">
                  No breaks, no overtime, just results
                </p>
              </div>
              <div className="rounded-2xl bg-brand-cream p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal/10">
                  <DollarSign className="h-6 w-6 text-brand-teal" />
                </div>
                <h3 className="font-semibold text-brand-slate">Cost-effective</h3>
                <p className="mt-2 text-sm text-brand-slate/60">
                  Less than your monthly subscriptions combined
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* The Problem We're Solving */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-brand-slate">Why We Built Rouze</h2>
              <div className="mx-auto h-1 w-20 rounded-full bg-brand-orange" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-brand-slate/80">
              <p>
                We built Rouze because we watched the AI revolution leave Main Street behind.
                Enterprise companies are automating everything. Meanwhile, the HVAC company with 12
                employees, the growing e-commerce brand, the local law firm drowning in admin
                work—they&apos;re stuck choosing between{' '}
                <span className="font-semibold text-brand-orange">$50,000 implementations</span>{' '}
                they can&apos;t afford or DIY tools they don&apos;t have time to figure out.
              </p>

              <p>
                That&apos;s not a gap in the market. That&apos;s{' '}
                <span className="font-semibold text-brand-teal">
                  35 million American businesses
                </span>{' '}
                being told to wait their turn.
              </p>

              <div className="my-10 rounded-2xl bg-gradient-to-r from-brand-orange/10 to-brand-teal/10 p-8">
                <div className="mb-4 flex items-center gap-4">
                  <Globe className="h-8 w-8 text-brand-orange" />
                  <span className="text-2xl font-bold text-brand-slate">350+ Million</span>
                </div>
                <p className="text-brand-slate/70">
                  Globally, there are over 350 million small and medium-sized businesses—90% of all
                  businesses on the planet. The vast majority have zero automation beyond a
                  spreadsheet and email. Enterprise vendors ignore them.
                </p>
              </div>

              <p className="text-xl font-semibold text-brand-slate">
                We said no. We&apos;re building the distribution layer to reach them.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What We Do */}
      <section className="bg-white py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-brand-slate">What We Actually Do</h2>
              <div className="mx-auto h-1 w-20 rounded-full bg-brand-teal" />
            </div>

            <div className="space-y-8">
              <p className="text-lg leading-relaxed text-brand-slate/80">
                Rouze is a marketplace. On one side: talented developers building AI-powered digital
                workers that handle real business tasks—customer support, lead qualification,
                appointment scheduling, back-office admin, industry-specific operations. On the
                other side: business owners who need help but thought automation was out of reach.
              </p>

              <p className="text-center text-xl font-semibold text-brand-teal">We connect them.</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-4 rounded-2xl bg-brand-cream p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                    <span className="font-bold text-red-500">✗</span>
                  </div>
                  <div>
                    <p className="font-medium text-brand-slate">No consultants</p>
                    <p className="text-sm text-brand-slate/60">Skip the expensive middlemen</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl bg-brand-cream p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                    <span className="font-bold text-red-500">✗</span>
                  </div>
                  <div>
                    <p className="font-medium text-brand-slate">No six-month implementations</p>
                    <p className="text-sm text-brand-slate/60">Start in minutes, not months</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl bg-brand-cream p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                    <span className="font-bold text-red-500">✗</span>
                  </div>
                  <div>
                    <p className="font-medium text-brand-slate">
                      No flowcharts or prompt engineering
                    </p>
                    <p className="text-sm text-brand-slate/60">Just browse, hire, and deploy</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl bg-brand-cream p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal/20">
                    <CheckCircle className="h-5 w-5 text-brand-teal" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-slate">Setup takes minutes</p>
                    <p className="text-sm text-brand-slate/60">Monthly hires start at $29</p>
                  </div>
                </div>
              </div>

              <div className="py-6 text-center">
                <p className="text-2xl font-bold text-brand-orange">
                  Your new team member starts working today.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Why This Matters */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-brand-slate">Why This Matters</h2>
              <div className="mx-auto h-1 w-20 rounded-full bg-brand-orange" />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* For Small Businesses */}
              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10">
                    <Users className="h-6 w-6 text-brand-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-slate">For Businesses</h3>
                </div>
                <div className="space-y-4 text-brand-slate/80">
                  <p>
                    Time is the only resource that doesn&apos;t scale. You can&apos;t clone
                    yourself. You can&apos;t will more hours into the day.
                  </p>
                  <p>
                    Every minute spent on repetitive admin work is a minute not spent growing,
                    selling, or serving customers.
                  </p>
                  <p className="font-medium text-brand-slate">
                    Digital workers change that math. They handle the work that eats your day so you
                    can focus on the work that builds your business.
                  </p>
                </div>
              </div>

              {/* For Developers */}
              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal/10">
                    <Rocket className="h-6 w-6 text-brand-teal" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-slate">For Developers</h3>
                </div>
                <div className="space-y-4 text-brand-slate/80">
                  <p>
                    Rouze means your work finally earns what it&apos;s worth. Build a digital worker
                    once, earn from every business that hires it.
                  </p>
                  <div className="rounded-2xl bg-brand-teal/10 p-4">
                    <p className="text-lg font-bold text-brand-teal">80% Revenue Share</p>
                    <p className="text-sm text-brand-slate/60">
                      Because the people who build the tools should own the upside.
                    </p>
                  </div>
                  <p>
                    No more racing to the bottom on freelance platforms. No more one-time gigs for
                    work that delivers recurring value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Principles */}
      <section className="bg-white py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-brand-slate">Our Principles</h2>
              <div className="mx-auto h-1 w-20 rounded-full bg-brand-teal" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-brand-slate/10 bg-brand-cream p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
                    <Target className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="font-bold text-brand-slate">Simplicity wins</h3>
                </div>
                <p className="text-brand-slate/70">
                  If a business owner can&apos;t set up a digital worker in five minutes, we&apos;ve
                  failed. No jargon. No complexity. No &quot;technical prerequisites.&quot;
                </p>
              </div>

              <div className="rounded-2xl border border-brand-slate/10 bg-brand-cream p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/10">
                    <Zap className="h-5 w-5 text-brand-teal" />
                  </div>
                  <h3 className="font-bold text-brand-slate">Action over conversation</h3>
                </div>
                <p className="text-brand-slate/70">
                  Our digital workers don&apos;t just chat—they do work. They qualify leads, respond
                  to customers, process documents, and handle operations. Results you can measure,
                  not demos you can watch.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-slate/10 bg-brand-cream p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
                    <Eye className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="font-bold text-brand-slate">Transparency builds trust</h3>
                </div>
                <p className="text-brand-slate/70">
                  Clear pricing. 14-day free trial. Cancel anytime. You know exactly what
                  you&apos;re getting and what it costs before you commit.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-slate/10 bg-brand-cream p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/10">
                    <Heart className="h-5 w-5 text-brand-teal" />
                  </div>
                  <h3 className="font-bold text-brand-slate">Builders deserve upside</h3>
                </div>
                <p className="text-brand-slate/70">
                  Developers keep 80% of what their digital workers earn. Period.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl bg-gradient-to-br from-brand-orange to-brand-orange/80 p-8 text-center text-white md:p-12">
              <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
              <p className="mb-8 text-lg text-white/90">
                Join thousands of businesses already using Rouze.ai to automate their workflows.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/agents"
                  className="inline-flex items-center rounded-xl bg-white px-8 py-4 font-semibold text-brand-orange transition-colors hover:bg-white/90"
                >
                  Browse Agents
                </Link>
                <Link
                  href="/submit-agent"
                  className="inline-flex items-center rounded-xl border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section className="bg-white py-12">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-xl font-bold text-brand-slate">Contact Us</h2>
            <p className="text-brand-slate/70">
              Have questions or feedback? We&apos;d love to hear from you. Reach out to us at{' '}
              <a href="mailto:team@rouze.ai" className="text-brand-orange hover:underline">
                team@rouze.ai
              </a>
            </p>
          </div>
        </Container>
      </section>
    </div>
  )
}
