import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Zap, Shield, Users, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Rouze.ai',
  description: 'Learn about Rouze.ai - The premier marketplace for AI agent workflows',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-brand-slate/10 bg-gradient-to-br from-brand-orange/5 via-brand-cream to-brand-teal/5">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-brand-teal/10 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-12">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-brand-slate/70 transition-colors hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-brand-slate md:text-5xl">
            About Rouze.ai
          </h1>
          <p className="text-xl text-brand-slate/70">
            Empowering businesses with ready-to-deploy AI agent workflows
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-12">
          {/* Mission Section */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-brand-slate">Our Mission</h2>
            <p className="mb-4 text-lg leading-relaxed text-brand-slate/80">
              At Rouze.ai, we believe that AI automation should be accessible to every business,
              regardless of size or technical expertise. Our mission is to democratize AI by
              creating a marketplace where businesses can discover, purchase, and deploy
              production-ready AI agent workflows in minutes, not months.
            </p>
            <p className="text-lg leading-relaxed text-brand-slate/80">
              We connect talented AI developers with businesses looking to automate their
              operations, creating a thriving ecosystem that benefits everyone.
            </p>
          </section>

          {/* Values Section */}
          <section>
            <h2 className="mb-8 text-2xl font-bold text-brand-slate">What We Stand For</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border-2 border-brand-slate/10 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
                  <Zap className="h-6 w-6 text-brand-orange" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-brand-slate">Speed to Value</h3>
                <p className="text-brand-slate/70">
                  Every agent on our platform is designed to be deployed quickly, so you can start
                  seeing results immediately rather than waiting months for custom development.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-brand-slate/10 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal/10">
                  <Shield className="h-6 w-6 text-brand-teal" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-brand-slate">Quality Assurance</h3>
                <p className="text-brand-slate/70">
                  Every agent goes through our rigorous review process before being listed. We
                  ensure they work as described and meet our security standards.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-brand-slate/10 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-brand-slate">Community First</h3>
                <p className="text-brand-slate/70">
                  We foster a community of AI developers and businesses, facilitating knowledge
                  sharing and collaboration to push the boundaries of what&apos;s possible.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-brand-slate/10 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Target className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-brand-slate">Results Driven</h3>
                <p className="text-brand-slate/70">
                  We measure our success by the success of our customers. Every feature we build is
                  designed to help you achieve your automation goals faster.
                </p>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-brand-slate">Our Story</h2>
            <div className="space-y-4 text-lg leading-relaxed text-brand-slate/80">
              <p>
                Rouze.ai was born from a simple observation: while AI technology has advanced
                rapidly, most businesses still struggle to implement it effectively. Custom AI
                development is expensive and time-consuming, and off-the-shelf solutions often
                don&apos;t fit specific business needs.
              </p>
              <p>
                We created Rouze.ai to bridge this gap. By building a marketplace for AI agent
                workflows, we enable businesses to find solutions that fit their exact needs while
                giving talented developers a platform to monetize their expertise.
              </p>
              <p>
                Today, Rouze.ai hosts a growing collection of AI agents across categories including
                customer support, sales automation, data analysis, and content creation. Each agent
                represents hours of development and testing, packaged into a solution that can be
                deployed in minutes.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-brand-slate">How It Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-brand-slate">Browse & Discover</h3>
                  <p className="text-brand-slate/70">
                    Explore our curated collection of AI agents across various categories and use
                    cases.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-brand-slate">Purchase Securely</h3>
                  <p className="text-brand-slate/70">
                    Buy with confidence using our secure payment system powered by Stripe.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-brand-slate">Deploy & Automate</h3>
                  <p className="text-brand-slate/70">
                    Access detailed setup guides and get your agent running in minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-brand-slate">Get Support</h3>
                  <p className="text-brand-slate/70">
                    Need help? Request setup assistance from our team or the agent creator.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange/80 p-8 text-white">
            <h2 className="mb-4 text-2xl font-bold">Ready to Get Started?</h2>
            <p className="mb-6 text-white/90">
              Join thousands of businesses already using Rouze.ai to automate their workflows.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/agents"
                className="inline-flex items-center rounded-xl bg-white px-6 py-3 font-semibold text-brand-orange transition-colors hover:bg-white/90"
              >
                Browse Agents
              </Link>
              <Link
                href="/become-seller"
                className="inline-flex items-center rounded-xl border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Become a Seller
              </Link>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-brand-slate/10 pt-8">
            <h2 className="mb-4 text-xl font-bold text-brand-slate">Contact Us</h2>
            <p className="text-brand-slate/70">
              Have questions or feedback? We&apos;d love to hear from you. Reach out to us at{' '}
              <a href="mailto:support@rouze.ai" className="text-brand-orange hover:underline">
                support@rouze.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
