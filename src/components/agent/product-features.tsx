'use client'

import { CheckCircle, Lightbulb, Workflow } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ProductFeaturesProps {
  workflowOverview: string
  useCase: string
  title: string
}

export function ProductFeatures({ workflowOverview, useCase, title }: ProductFeaturesProps) {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-white">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/20 to-transparent" />
        <div className="relative z-10 max-w-xl">
          <h2 className="mb-2 text-2xl font-bold">{title}</h2>
          <p className="text-gray-300">
            Automate your workflows with AI-powered assistance. Get started in minutes.
          </p>
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-8 right-16 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />
      </div>

      {/* Features Grid */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Product Features</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Workflow Overview */}
          <div className="rounded-xl bg-gray-50 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Workflow className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900">How it Works</h3>
            </div>
            <div className="prose prose-sm prose-gray max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="leading-relaxed text-gray-600">{children}</p>,
                  ul: ({ children }) => <ul className="space-y-2 text-gray-600">{children}</ul>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>{children}</span>
                    </li>
                  ),
                }}
              >
                {workflowOverview}
              </ReactMarkdown>
            </div>
          </div>

          {/* Use Case */}
          <div className="rounded-xl bg-gray-50 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Lightbulb className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Best For</h3>
            </div>
            <div className="prose prose-sm prose-gray max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="leading-relaxed text-gray-600">{children}</p>,
                  ul: ({ children }) => <ul className="space-y-2 text-gray-600">{children}</ul>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>{children}</span>
                    </li>
                  ),
                }}
              >
                {useCase}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
