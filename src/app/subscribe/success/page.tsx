import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Bot } from 'lucide-react'

export default function SubscribeSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-teal/10">
            <CheckCircle2 className="h-10 w-10 text-brand-teal" />
          </div>

          <h1 className="mb-3 text-3xl font-bold text-brand-slate">Welcome to Rouze.ai!</h1>

          <p className="mb-8 text-lg text-brand-slate/70">
            Your subscription is active. You now have unlimited access to all AI agents in our
            library.
          </p>

          <div className="mb-8 rounded-2xl border border-brand-teal/20 bg-brand-teal/5 p-6">
            <div className="flex items-center justify-center gap-3 text-brand-teal">
              <Bot className="h-6 w-6" />
              <span className="font-semibold">50+ agents unlocked</span>
            </div>
          </div>

          <Link href="/library">
            <Button
              size="lg"
              className="group w-full rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90"
            >
              Access Agent&apos;s
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
