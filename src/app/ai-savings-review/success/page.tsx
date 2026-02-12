import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SuccessPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-12">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="mb-4 text-3xl font-bold text-brand-slate">Payment confirmed!</h1>

          <p className="mb-2 text-lg text-brand-slate/70">
            Your AI Savings Review has been booked and paid.
          </p>

          <p className="mb-8 text-brand-slate/60">
            Our team will review your intake form and reach out before your scheduled call. You can
            track the status of your review in your library.
          </p>

          <Link href="/library">
            <Button
              size="lg"
              className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90"
            >
              Go to My Library
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
