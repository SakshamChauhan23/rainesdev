import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/container'

export function DentalPromo() {
  return (
    <section className="border-y border-brand-slate/10 bg-white py-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange">
              Rouze for Dental
            </p>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-brand-slate sm:text-4xl">
              Built for Dental Practices That Want to Stop Losing Revenue
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-brand-slate/60">
              Most practices have hundreds of overdue hygiene patients and unscheduled treatment
              plans sitting untouched in their system. The Dental Revenue Reactivation System
              automatically follows up, fills chairs, and protects your schedule without adding
              a single person to your team.
            </p>
            <Link
              href="/dental"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 font-semibold text-white shadow-lg shadow-brand-orange/25 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl"
            >
              See How It Works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                value: '$300K+',
                label: 'Average recoverable revenue sitting in a practice database',
                accent: 'orange',
              },
              {
                value: '24/7',
                label: 'Automated outreach with no staff time required',
                accent: 'teal',
              },
              {
                value: '1 zip code',
                label: 'Geographic exclusivity per partner practice',
                accent: 'teal',
              },
              {
                value: '3 steps',
                label: 'Connect your PMS, identify gaps, reactivate patients',
                accent: 'orange',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-brand-slate/10 bg-brand-cream p-6"
              >
                <p
                  className={`mb-2 text-2xl font-extrabold ${stat.accent === 'orange' ? 'text-brand-orange' : 'text-brand-teal'}`}
                >
                  {stat.value}
                </p>
                <p className="text-sm leading-snug text-brand-slate/60">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  )
}
