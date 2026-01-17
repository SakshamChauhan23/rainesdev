'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Settings, DollarSign, Check } from 'lucide-react'

interface AssistedSetupConfigProps {
  agentId: string
  currentEnabled: boolean
  currentPrice: number
}

export function AssistedSetupConfig({
  agentId,
  currentEnabled,
  currentPrice,
}: AssistedSetupConfigProps) {
  const [enabled, setEnabled] = useState(currentEnabled)
  const [price, setPrice] = useState(currentPrice.toString())
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/agents/${agentId}/setup-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistedSetupEnabled: enabled,
          assistedSetupPrice: parseFloat(price) || 0,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update configuration')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const isFree = !enabled || parseFloat(price) === 0

  return (
    <Card className="border-2 border-brand-slate/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
            <Settings className="h-5 w-5 text-brand-orange" />
          </div>
          <div>
            <CardTitle className="text-brand-slate">Admin-Assisted Setup</CardTitle>
            <CardDescription>Configure one-time setup assistance for buyers</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between rounded-2xl bg-brand-cream p-4">
          <div className="space-y-0.5">
            <Label htmlFor="enabled" className="text-base font-semibold text-brand-slate">
              Enable Assisted Setup
            </Label>
            <p className="text-sm text-brand-slate/60">
              Allow buyers to request setup help from admin team
            </p>
          </div>
          <Switch
            id="enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
            className="data-[state=checked]:bg-brand-orange"
          />
        </div>

        {/* Price Configuration */}
        {enabled && (
          <div className="space-y-4 rounded-2xl border-2 border-brand-slate/10 bg-white p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-brand-orange" />
              <Label htmlFor="price" className="text-base font-semibold text-brand-slate">
                Setup Price
              </Label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm text-brand-slate/70">
                  Price (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate/50">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="rounded-xl border-2 border-brand-slate/10 pl-7 focus:border-brand-orange"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-brand-slate/60">Set to $0 for free setup</p>
              </div>

              <div className="rounded-xl bg-brand-cream p-4">
                <p className="mb-1 text-xs font-medium text-brand-slate/70">Status</p>
                <p
                  className={`text-lg font-bold ${isFree ? 'text-brand-orange' : 'text-brand-orange'}`}
                >
                  {isFree ? 'Free Setup' : `$${parseFloat(price || '0').toFixed(2)}`}
                </p>
                <p className="mt-1 text-xs text-brand-slate/60">
                  {isFree ? 'No charge for setup' : 'Added to checkout total'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scope Information */}
        {enabled && (
          <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4">
            <p className="mb-2 text-sm font-semibold text-blue-900">What&apos;s Included:</p>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                <span>Initial configuration and tool connections</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                <span>Live setup session with admin team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600">✖</span>
                <span>Ongoing support (separate addon)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600">✖</span>
                <span>Custom workflow modifications</span>
              </li>
            </ul>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-2xl border-2 border-brand-orange/20 bg-brand-orange/5 p-4 text-sm text-brand-slate">
            <Check className="h-4 w-4" />
            Configuration saved successfully!
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={loading}
          className="h-12 w-full rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {loading ? 'Saving...' : 'Save Configuration'}
        </Button>

        <p className="text-center text-xs text-brand-slate/50">
          Changes apply immediately without requiring agent re-approval
        </p>
      </CardContent>
    </Card>
  )
}
