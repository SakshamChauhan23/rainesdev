'use client'
import { logger } from '@/lib/logger'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { loginAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const nextUrl = searchParams.get('next')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await loginAction(email, password, nextUrl || undefined)

      if (!result.success) {
        setError(result.error || 'Login failed')
        return
      }

      // Redirect based on role
      logger.info(`✅ Login successful as ${result.role}, redirecting to ${result.redirectUrl}`)

      // Use window.location for hard redirect to ensure session is properly loaded
      window.location.href = result.redirectUrl!
    } catch (err: any) {
      logger.error('💥 Login exception:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-brand-cream">
      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-24">
        <div
          className={`mx-auto w-full max-w-md transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          {/* Logo */}
          <Link href="/" className="mb-8 inline-flex">
            <Image
              src="/logo.png"
              alt="Rouze.ai"
              width={140}
              height={40}
              className="h-10 w-auto transition-transform hover:scale-105"
              priority
            />
          </Link>

          <div className="mb-8">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-brand-slate">
              Welcome back
            </h1>
            <p className="text-brand-slate/60">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex animate-fade-in items-center gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-brand-slate">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-12 rounded-xl border-2 border-brand-slate/10 bg-white px-4 transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-medium text-brand-slate">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-brand-orange transition-colors hover:text-brand-orange/80"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-12 rounded-xl border-2 border-brand-slate/10 bg-white px-4 transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-brand-slate/60">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-brand-orange transition-colors hover:text-brand-orange/80"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-orange via-brand-orange/90 to-brand-orange lg:flex lg:w-1/2">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute right-20 top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-brand-orange/30 blur-3xl" />
        </div>

        <div
          className={`relative z-10 flex flex-col justify-center px-16 text-white transition-all delay-300 duration-1000 xl:px-20 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
        >
          <div className="mb-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 1000+ teams</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold leading-tight xl:text-5xl">
              Your AI Agent Marketplace
            </h2>
            <p className="text-xl text-white/80">
              Access powerful AI agents ready to transform your workflow
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: Shield,
                title: 'Secure & Verified',
                description: 'All agents are verified and tested for quality',
                delay: '500ms',
              },
              {
                icon: Zap,
                title: 'Instant Setup',
                description: 'Deploy agents in minutes, no coding required',
                delay: '700ms',
              },
              {
                icon: TrendingUp,
                title: 'Scale Effortlessly',
                description: 'Grow your AI capabilities as your needs expand',
                delay: '900ms',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 transition-all duration-1000 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                style={{ transitionDelay: feature.delay }}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 backdrop-blur-sm">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`mt-12 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all delay-1000 duration-1000 ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-brand-orange to-brand-orange"
                  />
                ))}
              </div>
              <div>
                <p className="font-semibold">Join 10,000+ users</p>
                <p className="text-sm text-white/70">Building with AI agents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-cream">
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-brand-orange/10">
              <Sparkles className="h-8 w-8 text-brand-orange" />
            </div>
            <p className="text-brand-slate/70">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
