'use client'

import { useState } from 'react'
import { ChevronDown, CheckCircle2 } from 'lucide-react'

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

export function DentalFAQ() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-8 shadow-sm">
      <FAQItem
        q="Will patients hate automation?"
        a={
          <ul className="space-y-1">
            {[
              'Personalized to each patient',
              'HIPAA-conscious at every step',
              'Human in tone, not robotic',
              'Stops immediately on reply',
            ].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-teal" />
                {i}
              </li>
            ))}
          </ul>
        }
      />
      <FAQItem
        q="Is this spam?"
        a={
          <ul className="space-y-1">
            {[
              'Consent-based outreach only',
              'Smart cadence controls no flooding',
              'Controlled follow-up logic with opt-out built in',
            ].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-teal" />
                {i}
              </li>
            ))}
          </ul>
        }
      />
      <FAQItem
        q="Will this replace my team?"
        a="No, it makes your team more productive. Your staff handles inbound responses and relationship-building while the system eliminates all the manual chasing. Think of it as adding a full-time recall coordinator who never sleeps."
      />
    </div>
  )
}
