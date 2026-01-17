'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowDown } from 'lucide-react'

export function PurchaseSuccessBanner() {
  const scrollToSetupGuide = () => {
    const element = document.getElementById('setup-guide')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Card className="mb-6 border-brand-orange/20 bg-brand-orange/5">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-brand-orange/10 p-2">
            <CheckCircle2 className="h-5 w-5 text-brand-orange" />
          </div>
          <div>
            <p className="font-semibold text-brand-slate">Setup guide unlocked successfully!</p>
            <p className="text-sm text-brand-orange">
              You now have lifetime access to the complete setup guide
            </p>
          </div>
        </div>
        <Button
          onClick={scrollToSetupGuide}
          variant="outline"
          className="border-brand-orange/30 bg-white hover:bg-brand-orange/10"
        >
          <ArrowDown className="mr-2 h-4 w-4" />
          Go to Setup Guide
        </Button>
      </CardContent>
    </Card>
  )
}
