'use client'

import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { submitIntakeForm, IntakeFormState } from '@/app/ai-savings-review/intake/actions'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full rounded-2xl bg-brand-orange py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:bg-brand-orange/90 disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Submitting...
        </>
      ) : (
        'Continue to Book Call'
      )}
    </Button>
  )
}

const industries = [
  'Dental / Healthcare',
  'Real Estate',
  'E-commerce / Retail',
  'Professional Services',
  'Construction / Trades',
  'Restaurant / Hospitality',
  'Legal',
  'Financial Services',
  'Marketing / Agency',
  'Education',
  'Other',
]

const companySizes = [
  'Solo / Freelancer',
  '2-10 employees',
  '11-50 employees',
  '51-200 employees',
  '200+ employees',
]

const aiExperienceLevels = [
  'No experience — brand new to AI',
  'Beginner — tried ChatGPT or similar',
  'Intermediate — using some AI tools',
  'Advanced — running AI in production',
]

export function IntakeForm({ tier }: { tier: 'SNAPSHOT' | 'FULL_REVIEW' }) {
  const initialState: IntakeFormState = {}
  const [state, formAction] = useFormState(submitIntakeForm, initialState)

  const tierLabel = tier === 'SNAPSHOT' ? 'Snapshot ($499)' : 'Full Review ($999)'

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="tier" value={tier} />

      {/* Tier Display */}
      <div className="rounded-2xl border-2 border-brand-orange/20 bg-brand-orange/5 p-4 text-center">
        <p className="text-sm text-brand-slate/60">Selected tier</p>
        <p className="text-lg font-bold text-brand-orange">{tierLabel}</p>
      </div>

      {state?.message && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-brand-slate">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          required
          className="w-full rounded-xl border-2 border-brand-slate/10 bg-white px-4 py-3 text-brand-slate transition-colors focus:border-brand-orange focus:outline-none"
          placeholder="Acme Corp"
        />
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="mb-2 block text-sm font-medium text-brand-slate">
          Industry <span className="text-red-500">*</span>
        </label>
        <select
          id="industry"
          name="industry"
          required
          className="w-full rounded-xl border-2 border-brand-slate/10 bg-white px-4 py-3 text-brand-slate transition-colors focus:border-brand-orange focus:outline-none"
        >
          <option value="">Select your industry</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Company Size */}
      <div>
        <label htmlFor="companySize" className="mb-2 block text-sm font-medium text-brand-slate">
          Company Size <span className="text-red-500">*</span>
        </label>
        <select
          id="companySize"
          name="companySize"
          required
          className="w-full rounded-xl border-2 border-brand-slate/10 bg-white px-4 py-3 text-brand-slate transition-colors focus:border-brand-orange focus:outline-none"
        >
          <option value="">Select company size</option>
          {companySizes.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Current Tools */}
      <div>
        <label htmlFor="currentTools" className="mb-2 block text-sm font-medium text-brand-slate">
          What tools/software do you currently use? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="currentTools"
          name="currentTools"
          required
          rows={3}
          className="w-full rounded-xl border-2 border-brand-slate/10 bg-white px-4 py-3 text-brand-slate transition-colors focus:border-brand-orange focus:outline-none"
          placeholder="e.g., Google Workspace, QuickBooks, Salesforce, Slack..."
        />
      </div>

      {/* Pain Points */}
      <div>
        <label htmlFor="painPoints" className="mb-2 block text-sm font-medium text-brand-slate">
          Biggest time-wasters or pain points? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="painPoints"
          name="painPoints"
          required
          rows={3}
          className="w-full rounded-xl border-2 border-brand-slate/10 bg-white px-4 py-3 text-brand-slate transition-colors focus:border-brand-orange focus:outline-none"
          placeholder="e.g., Manually following up with leads, scheduling appointments, answering repeat customer questions..."
        />
      </div>

      {/* AI Experience */}
      <div>
        <label htmlFor="aiExperience" className="mb-2 block text-sm font-medium text-brand-slate">
          AI Experience Level <span className="text-red-500">*</span>
        </label>
        <select
          id="aiExperience"
          name="aiExperience"
          required
          className="w-full rounded-xl border-2 border-brand-slate/10 bg-white px-4 py-3 text-brand-slate transition-colors focus:border-brand-orange focus:outline-none"
        >
          <option value="">Select experience level</option>
          {aiExperienceLevels.map(level => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Goals */}
      <div>
        <label htmlFor="goals" className="mb-2 block text-sm font-medium text-brand-slate">
          What do you hope to achieve with AI? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="goals"
          name="goals"
          required
          rows={3}
          className="w-full rounded-xl border-2 border-brand-slate/10 bg-white px-4 py-3 text-brand-slate transition-colors focus:border-brand-orange focus:outline-none"
          placeholder="e.g., Save 10+ hours per week, respond to leads faster, reduce admin overhead..."
        />
      </div>

      {/* Additional Notes */}
      <div>
        <label
          htmlFor="additionalNotes"
          className="mb-2 block text-sm font-medium text-brand-slate"
        >
          Additional Notes <span className="text-brand-slate/40">(optional)</span>
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          rows={2}
          className="w-full rounded-xl border-2 border-brand-slate/10 bg-white px-4 py-3 text-brand-slate transition-colors focus:border-brand-orange focus:outline-none"
          placeholder="Anything else we should know..."
        />
      </div>

      <SubmitButton />
    </form>
  )
}
