'use client'

import {
  Cpu,
  Clock,
  Layers,
  Shield,
  Zap,
  Users,
  Globe,
  Settings,
  FileText,
  HelpCircle,
} from 'lucide-react'

interface ProductSpecsProps {
  category: string
  purchaseCount: number
  assistedSetupEnabled: boolean
  assistedSetupPrice?: number
}

export function ProductSpecs({
  category,
  purchaseCount,
  assistedSetupEnabled,
  assistedSetupPrice,
}: ProductSpecsProps) {
  const specs = [
    {
      icon: Layers,
      label: 'Category',
      value: category,
    },
    {
      icon: Clock,
      label: 'Setup Time',
      value: assistedSetupEnabled ? '< 1 hour (assisted)' : '1-2 hours',
    },
    {
      icon: Cpu,
      label: 'AI Platform',
      value: 'Multiple Supported',
    },
    {
      icon: Settings,
      label: 'Complexity',
      value: 'Beginner Friendly',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: `${purchaseCount}+`,
    },
    {
      icon: Globe,
      label: 'Language',
      value: 'English',
    },
    {
      icon: FileText,
      label: 'Documentation',
      value: 'Full Guide Included',
    },
    {
      icon: HelpCircle,
      label: 'Support',
      value: assistedSetupEnabled ? 'Setup Assistance' : 'Community',
    },
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Specifications</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {specs.map(spec => {
          const Icon = spec.icon
          return (
            <div
              key={spec.label}
              className="flex flex-col items-center rounded-xl bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs font-medium text-gray-500">{spec.label}</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{spec.value}</p>
            </div>
          )
        })}
      </div>

      {/* Assisted Setup Highlight */}
      {assistedSetupEnabled && (
        <div className="mt-6 flex items-center gap-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Assisted Setup Available</h3>
            <p className="text-sm text-gray-600">
              Get expert help setting up this agent.{' '}
              {assistedSetupPrice && assistedSetupPrice > 0 && (
                <span className="font-medium text-primary">
                  Starting at ${assistedSetupPrice.toFixed(2)}
                </span>
              )}
            </p>
          </div>
          <Shield className="ml-auto h-8 w-8 text-primary/30" />
        </div>
      )}
    </div>
  )
}
