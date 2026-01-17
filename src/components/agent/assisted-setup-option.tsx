'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Check, X, Users } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface AssistedSetupOptionProps {
  enabled: boolean
  price: number
  onSelectionChange: (selected: boolean) => void
}

export function AssistedSetupOption({
  enabled,
  price,
  onSelectionChange
}: AssistedSetupOptionProps) {
  const [selected, setSelected] = useState('no')

  if (!enabled) {
    return null
  }

  const isFree = price === 0

  const handleSelectionChange = (value: string) => {
    setSelected(value)
    onSelectionChange(value === 'yes')
  }

  return (
    <Card className="border-2 border-brand-slate/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/10">
            <Users className="h-5 w-5 text-brand-teal" />
          </div>
          <div>
            <CardTitle className="text-brand-slate">Admin-assisted setup (one-time)</CardTitle>
            <p className="text-sm text-brand-slate/60">
              {isFree ? 'Free with purchase' : formatPrice(price)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div className="rounded-2xl bg-brand-cream p-4">
          <p className="text-sm text-brand-slate/80 mb-3">
            Our team will connect your tools and get the agent running in a live session.
          </p>

          {/* What's Included */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span className="text-brand-slate">Initial configuration</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span className="text-brand-slate">Tool connections</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <X className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0 font-bold" />
              <span className="text-brand-slate/60">Ongoing support</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <X className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0 font-bold" />
              <span className="text-brand-slate/60">Custom workflows</span>
            </div>
          </div>
        </div>

        {/* Selection */}
        <RadioGroup value={selected} onValueChange={handleSelectionChange} className="space-y-3">
          <div className={`flex items-center space-x-3 rounded-xl border-2 p-4 transition-all ${
            selected === 'yes'
              ? 'border-brand-teal bg-brand-teal/5'
              : 'border-brand-slate/10 hover:border-brand-slate/20'
          }`}>
            <RadioGroupItem value="yes" id="setup-yes" className="border-brand-teal text-brand-teal" />
            <Label
              htmlFor="setup-yes"
              className="flex-1 cursor-pointer text-base font-semibold text-brand-slate"
            >
              Yes, I want admin-assisted setup
              {!isFree && <span className="ml-2 text-brand-teal">(+{formatPrice(price)})</span>}
            </Label>
          </div>

          <div className={`flex items-center space-x-3 rounded-xl border-2 p-4 transition-all ${
            selected === 'no'
              ? 'border-brand-orange bg-brand-orange/5'
              : 'border-brand-slate/10 hover:border-brand-slate/20'
          }`}>
            <RadioGroupItem value="no" id="setup-no" className="border-brand-orange text-brand-orange" />
            <Label
              htmlFor="setup-no"
              className="flex-1 cursor-pointer text-base font-semibold text-brand-slate"
            >
              No, I'll set it up myself
            </Label>
          </div>
        </RadioGroup>

        {selected === 'yes' && (
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 p-4 animate-fade-in">
            <p className="text-sm text-green-900">
              <strong className="font-semibold">Great choice!</strong> Our team will reach out after purchase to schedule your setup session.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
