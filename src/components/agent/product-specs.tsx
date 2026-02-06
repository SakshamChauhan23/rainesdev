'use client'

import { Cpu, Clock, Layers, Settings, Users, Globe, FileText, HelpCircle } from 'lucide-react'

interface ProductSpecsProps {
  category: string
  purchaseCount: number
}

export function ProductSpecs({ category, purchaseCount }: ProductSpecsProps) {
  const specs = [
    {
      icon: Layers,
      label: 'Category',
      value: category,
    },
    {
      icon: Clock,
      label: 'Setup Time',
      value: '1-2 hours',
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
      value: 'Community',
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
    </div>
  )
}
