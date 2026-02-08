import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Bot, Sparkles, Zap, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SubscribeSuccessPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/subscribe/success')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-cream">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-brand-teal/10 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />
      </div>

      <Container className="flex min-h-[85vh] flex-col items-center justify-center text-center">
        <div className="mx-auto max-w-lg">
          {/* Animated success icon */}
          <div className="relative mb-8 inline-flex">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-teal to-brand-teal/80 shadow-2xl shadow-brand-teal/30">
              <CheckCircle2 className="h-14 w-14 text-white" />
            </div>
            <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl">
            Welcome to{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-orange">Rouze.ai!</span>
              <span className="absolute bottom-1 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
            </span>
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-brand-slate/70">
            Your subscription is now active. You have full, unlimited access to every AI agent in
            our library.
          </p>

          {/* Feature highlights */}
          <div className="mb-10 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-brand-slate/10 bg-white p-4 shadow-sm">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
                <Bot className="h-5 w-5 text-brand-orange" />
              </div>
              <p className="text-sm font-semibold text-brand-slate">50+ Agents</p>
              <p className="text-xs text-brand-slate/50">All unlocked</p>
            </div>
            <div className="rounded-2xl border border-brand-slate/10 bg-white p-4 shadow-sm">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/10">
                <Zap className="h-5 w-5 text-brand-teal" />
              </div>
              <p className="text-sm font-semibold text-brand-slate">Setup Guides</p>
              <p className="text-xs text-brand-slate/50">Step by step</p>
            </div>
            <div className="rounded-2xl border border-brand-slate/10 bg-white p-4 shadow-sm">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
                <Shield className="h-5 w-5 text-brand-orange" />
              </div>
              <p className="text-sm font-semibold text-brand-slate">Cancel Anytime</p>
              <p className="text-xs text-brand-slate/50">No lock-in</p>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/library">
            <Button
              size="lg"
              className="group w-full rounded-2xl bg-brand-orange px-10 py-7 text-lg font-bold text-white shadow-xl shadow-brand-orange/30 transition-all hover:-translate-y-1 hover:bg-brand-orange/90 hover:shadow-2xl hover:shadow-brand-orange/40"
            >
              Access Agent&apos;s
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Button>
          </Link>

          <p className="mt-6 text-sm text-brand-slate/50">
            You can manage your subscription anytime from your{' '}
            <Link
              href="/account"
              className="font-medium text-brand-teal underline underline-offset-2 hover:text-brand-teal/80"
            >
              account settings
            </Link>
          </p>
        </div>
      </Container>
    </div>
  )
}
