'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface UnlockedSetupGuideProps {
  setupGuide: string
}

export function UnlockedSetupGuide({ setupGuide }: UnlockedSetupGuideProps) {
  return (
    <section id="setup-guide" className="mt-12">
      <Card className="bg-brand-orange/5/30 border-brand-orange/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-brand-orange" />
            <CardTitle className="font-normal text-gray-900">Setup Guide</CardTitle>
          </div>
          <CardDescription className="font-light text-gray-600">
            Complete step-by-step instructions to deploy and configure this agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm prose-headings:font-normal prose-headings:text-gray-900 prose-p:font-light prose-p:text-gray-700 dark:prose-invert max-w-none">
            <ReactMarkdown>{setupGuide}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
