import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Phone } from 'lucide-react'
import Link from 'next/link'

export function BookCallCard() {
  return (
    <Card className="border-2 border-brand-orange/30 bg-gradient-to-br from-brand-orange/5 to-brand-orange/10">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
            <Phone className="h-5 w-5 text-brand-orange" />
          </div>
          <CardTitle className="text-xl text-brand-slate">Need Help with Setup?</CardTitle>
        </div>
        <CardDescription className="text-brand-slate/70">
          Book a call with our team to discuss your requirements and get personalized assistance with agent setup and configuration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="https://calendar.app.google/EZur5Njhj9Wfjedy7"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            size="lg"
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40 transition-all"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book a Call
          </Button>
        </Link>
        <p className="text-xs text-brand-slate/60 mt-3 text-center">
          Free consultation • 30-minute session
        </p>
      </CardContent>
    </Card>
  )
}
