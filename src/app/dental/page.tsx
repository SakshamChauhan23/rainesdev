'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  Phone,
  MapPin,
} from 'lucide-react'

const AUDIT_LINK = 'https://cal.com/rouze/dental-audit' // update with real booking link

function FAQItem({ q, a }: { q: string; a: string | React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-lg font-semibold text-slate-800 transition-colors hover:text-brand-orange"
      >
        {q}
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-brand-orange transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-5 text-slate-600 leading-relaxed">{a}</div>}
    </div>
  )
}

export default function DentalPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image src="/logo.png" alt="Rouze.ai" width={120} height={36} className="h-9 w-auto" />
          </Link>
          <a
            href={AUDIT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-lg"
          >
            Get Free Audit
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-brand-teal/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange">
            <Zap className="h-4 w-4" />
            Dental Revenue Reactivation System™
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Next{' '}
            <span className="text-brand-orange">$250,000</span>{' '}
            Is Already in Your<br className="hidden sm:block" /> Patient Database.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Automatically re-engage overdue hygiene and unscheduled treatment patients — and fill
            your chairs without hiring more staff.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={AUDIT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand-orange/30 transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              Get Your Free Revenue Gap Audit
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="bg-brand-cream py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Stop Buying New Patients Until You Fix Your Recall System.
            </h2>
            <p className="mb-12 text-lg text-slate-600">
              Most dental practices are leaking revenue every single month. Before spending another
              dollar on Google Ads, mailers, or SEO — fix the backend.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Users,
                label: 'Overdue Hygiene Patients',
                description: 'Patients who are due for a cleaning but haven\'t scheduled — and won\'t unless someone reaches out.',
                color: 'orange',
              },
              {
                icon: BarChart3,
                label: 'Unscheduled Treatment Plans',
                description: 'Diagnosed work sitting in your PMS with no follow-up. Revenue you\'ve already earned — just not collected.',
                color: 'teal',
              },
              {
                icon: Clock,
                label: 'No-Shows & Cancellations',
                description: 'Same-day cancellations and no-shows that leave chairs empty and your schedule in chaos.',
                color: 'orange',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.color === 'orange' ? 'bg-brand-orange/10' : 'bg-brand-teal/10'}`}
                >
                  <item.icon
                    className={`h-6 w-6 ${item.color === 'orange' ? 'text-brand-orange' : 'text-brand-teal'}`}
                  />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{item.label}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVENUE OPPORTUNITY ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange">
                  The Math Is Simple
                </p>
                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                  The Revenue Sitting Idle in Your Database
                </h2>
                <p className="mb-6 text-slate-400">
                  Here's what a typical practice looks like — and most owners have no idea.
                </p>
                <a
                  href={AUDIT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 font-semibold text-white transition-all hover:bg-brand-orange/90"
                >
                  See your numbers <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Inactive patients', value: '1,200' },
                  { label: 'Overdue for hygiene', value: '40%' },
                  { label: 'Avg hygiene visit', value: '$180' },
                  { label: 'Avg treatment plan', value: '$1,200' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-6 py-4"
                  >
                    <span className="text-slate-300">{stat.label}</span>
                    <span className="text-xl font-bold text-white">{stat.value}</span>
                  </div>
                ))}
                <div className="rounded-xl border border-brand-orange/40 bg-brand-orange/10 px-6 py-5 text-center">
                  <p className="text-sm text-brand-orange/80">Recoverable production</p>
                  <p className="text-3xl font-extrabold text-brand-orange">$300K – $800K</p>
                  <p className="mt-1 text-xs text-slate-400">sitting untouched right now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT ── */}
      <section className="bg-brand-cream py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-teal">
            What We Built
          </p>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            The Dental Revenue Reactivation System™
          </h2>
          <blockquote className="mx-auto mb-6 max-w-2xl rounded-2xl border-l-4 border-brand-orange bg-white px-8 py-6 text-left shadow-sm">
            <p className="text-xl font-semibold italic text-slate-800">
              "The coordinator who works the 11pm shift your front desk never will."
            </p>
          </blockquote>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-teal" /> Not software</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-teal" /> Not an AI gadget</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-teal" /> A Revenue Recovery & Protection System</span>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            What It Includes
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* System 1 */}
            <div className="rounded-2xl border-2 border-brand-orange/20 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-white font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Dental Revenue Reactivation System™
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Overdue hygiene reactivation',
                  'Unscheduled treatment follow-up',
                  'Multi-touch cadence messaging',
                  '24/7 automated outreach',
                  'Smart follow-up logic',
                  'Monthly performance reporting',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-brand-orange" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* System 2 */}
            <div className="rounded-2xl border-2 border-brand-teal/20 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal text-white font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Dental Appointment No-Show Preventer
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Intelligent reminders',
                  'Confirmation automation',
                  'Reschedule capture',
                  'Same-day cancellation reduction',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-brand-teal" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-brand-teal/5 p-4">
                <p className="text-sm font-semibold text-brand-teal">Together, these systems:</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {['Recover lost production', 'Protect tomorrow\'s schedule', 'Increase staff efficiency', 'Stabilize monthly revenue'].map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-brand-cream py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mb-12 text-center text-slate-600">Three steps. That's it.</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '01', icon: Phone, title: 'Connect to your PMS', desc: 'We integrate with Dentrix, Eaglesoft, OpenDental, and more in under a day.' },
              { step: '02', icon: BarChart3, title: 'Identify revenue gaps', desc: 'Our system surfaces every overdue hygiene patient, unscheduled treatment, and at-risk appointment.' },
              { step: '03', icon: Zap, title: 'Automatically reactivate patients', desc: 'Smart, HIPAA-conscious messaging goes out automatically — 24/7, no staff time required.' },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 text-5xl font-extrabold text-brand-orange/10">{item.step}</div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
                  <item.icon className="h-5 w-5 text-brand-orange" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-center text-slate-300">
            <p className="font-medium">No additional hiring. &nbsp;·&nbsp; No manual chasing. &nbsp;·&nbsp; No complicated tech stack.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            Common Questions
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white px-8 shadow-sm">
            <FAQItem
              q="Will patients hate automation?"
              a={
                <ul className="space-y-1">
                  {['Personalized to each patient', 'HIPAA-conscious at every step', 'Human in tone — not robotic', 'Stops immediately on reply'].map((i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-teal" />{i}</li>
                  ))}
                </ul>
              }
            />
            <FAQItem
              q="Is this spam?"
              a={
                <ul className="space-y-1">
                  {['Consent-based outreach only', 'Smart cadence controls — no flooding', 'Controlled follow-up logic with opt-out built in'].map((i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-teal" />{i}</li>
                  ))}
                </ul>
              }
            />
            <FAQItem
              q="Will this replace my team?"
              a="No — it makes your team more productive. Your staff handles inbound responses and relationship-building while the system eliminates all the manual chasing. Think of it as adding a full-time recall coordinator who never sleeps."
            />
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="bg-brand-cream py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-4 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange">Pricing & Packaging</p>
            <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              We Price Against What You're Losing
            </h2>
            <p className="mx-auto max-w-xl text-slate-600">
              Not against software. Against one front desk hire (~$70,000/yr), one empty hygiene chair (~$150/hr), and lost production. One recovered chair per day pays for this.
            </p>
          </div>

          {/* Setup fee */}
          <div className="mx-auto mb-8 mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">One-Time</p>
            <p className="mb-2 text-4xl font-extrabold text-slate-900">$299</p>
            <p className="mb-6 font-semibold text-slate-700">Setup & Implementation Fee</p>
            <ul className="space-y-2 text-sm text-slate-600 text-left max-w-xs mx-auto">
              {['PMS connection', 'Workflow configuration', 'Message customization', 'Compliance setup', 'Launch calibration', 'Staff walkthrough', '30-day performance tuning'].map((i) => (
                <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-teal" />{i}</li>
              ))}
            </ul>
          </div>

          {/* Monthly plans */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Starter */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm">
              <p className="mb-1 text-sm font-semibold text-slate-500">Starter</p>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$99</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="mb-6 text-sm text-slate-500">Best for smaller practices fixing recall leakage.</p>
              <ul className="mb-8 space-y-3">
                {['Dental Revenue Reactivation System™', 'Overdue hygiene follow-up', 'Unscheduled treatment reactivation', 'Smart cadence messaging', 'Monthly reporting', 'Email & SMS support'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-brand-orange" />{f}
                  </li>
                ))}
              </ul>
              <a
                href={AUDIT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border-2 border-brand-orange py-3 text-center font-semibold text-brand-orange transition-all hover:bg-brand-orange hover:text-white"
              >
                Get Started
              </a>
            </div>
            {/* Standard */}
            <div className="relative rounded-2xl border-2 border-brand-orange bg-white p-8 shadow-lg">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-orange px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Most Popular
              </div>
              <p className="mb-1 text-sm font-semibold text-slate-500">Standard</p>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$149</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="mb-6 text-sm text-slate-500">Recover revenue AND protect tomorrow's schedule.</p>
              <ul className="mb-8 space-y-3">
                {['Everything in Starter', 'Dental Appointment No-Show Preventer', 'Intelligent reminders', 'Confirmation automation', 'Reschedule capture', 'Same-day cancellation reduction'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${f === 'Everything in Starter' ? 'text-brand-teal' : 'text-brand-orange'}`} />{f}
                  </li>
                ))}
              </ul>
              <a
                href={AUDIT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-brand-orange py-3 text-center font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:bg-brand-orange/90"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCARCITY ── */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange">
            <MapPin className="h-4 w-4" />
            Geographic Exclusivity
          </div>
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            We Only Partner With One Practice Per Zip Code.
          </h2>
          <p className="text-slate-400">
            If your competitor implements this first, you're competing against a stabilized revenue
            engine. The window in your area may already be closing.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-semibold text-brand-orange">
            <TrendingUp className="h-4 w-4" />
            Free Revenue Gap Audit
          </div>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            See Exactly How Much Revenue You're Leaving on the Table.
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Book your Free Revenue Gap Audit today. No commitment. Just math.
          </p>
          <a
            href={AUDIT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-10 py-5 text-lg font-bold text-white shadow-xl shadow-brand-orange/30 transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            Book My Free Revenue Gap Audit
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="mt-4 text-sm text-slate-400">
            Takes 15 minutes. We show you the numbers. You decide.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-slate-50 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-slate-500">
          <Link href="/" className="flex items-center gap-2 hover:text-slate-700">
            <Image src="/logo.png" alt="Rouze.ai" width={80} height={24} className="h-6 w-auto" />
          </Link>
          <p>© {new Date().getFullYear()} Rouze.ai · All rights reserved</p>
          <div className="flex gap-4">
            <Link href="/legal" className="hover:text-slate-700">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
