import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function SubscribeCancelPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mx-auto max-w-md">
          <h1 className="mb-3 text-2xl font-bold text-brand-slate">Changed your mind?</h1>

          <p className="mb-8 text-brand-slate/70">
            No worries. You can subscribe anytime to unlock all AI agents on Rouze.ai.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/pricing">
              <Button
                size="lg"
                className="w-full rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90 sm:w-auto"
              >
                View Pricing
              </Button>
            </Link>
            <Link href="/agents">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-2xl border-2 border-brand-slate/20 px-8 py-6 text-base text-brand-slate hover:border-brand-teal hover:bg-brand-teal/5 sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Agents
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
