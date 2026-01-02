'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signupAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2, Loader2, Info, Sparkles, ShoppingCart, Store, Users } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const result = await signupAction(email, password, name || undefined)

            if (!result.success) {
                setError(result.error || 'Signup failed')
                return
            }

            setSuccess(true)
            setRequiresEmailConfirmation(result.requiresEmailConfirmation || false)

            // Auto-redirect after appropriate delay
            const redirectDelay = result.requiresEmailConfirmation ? 5000 : 2000
            setTimeout(() => {
                // Use window.location for hard redirect to ensure session is properly loaded
                window.location.href = result.redirectUrl || '/agents'
            }, redirectDelay)
        } catch (err: any) {
            setError(err.message || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-brand-cream px-6 py-12">
                <div className={`w-full max-w-md transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <div className="rounded-3xl bg-white border-2 border-brand-slate/10 p-8 shadow-xl text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30">
                            <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mb-3 text-3xl font-bold text-brand-slate">
                            {requiresEmailConfirmation ? 'Check Your Email' : 'Welcome! 🎉'}
                        </h1>
                        <p className="mb-8 text-brand-slate/70">
                            {requiresEmailConfirmation ? (
                                <>
                                    We&apos;ve sent a confirmation link to <span className="font-semibold text-brand-orange">{email}</span>
                                </>
                            ) : (
                                <>Your account has been created as a <span className="font-semibold text-brand-teal">Buyer</span></>
                            )}
                        </p>

                        {requiresEmailConfirmation ? (
                            <>
                                <div className="mb-6 text-sm text-brand-slate/60 bg-brand-cream rounded-2xl p-4">
                                    Click the link in the email to verify your account before logging in.
                                </div>
                                <Button asChild className="w-full h-12 rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90">
                                    <Link href="/login">Go to Login</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="mb-6 flex items-center justify-center gap-2 text-sm text-brand-slate/60">
                                    <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
                                    <span>Redirecting you to the marketplace...</span>
                                </div>
                                <div className="rounded-2xl bg-gradient-to-br from-brand-teal/10 to-brand-teal/5 border-2 border-brand-teal/20 p-6 text-left">
                                    <div className="flex gap-3">
                                        <Info className="h-5 w-5 text-brand-teal mt-0.5 flex-shrink-0" />
                                        <div className="text-sm">
                                            <p className="font-semibold text-brand-slate mb-2">Want to sell AI agents?</p>
                                            <p className="text-brand-slate/70">
                                                Contact admin to upgrade your account to Seller role and start listing your agents.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-brand-cream">
            {/* Left Side - Signup Form */}
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-24">
                <div className={`mx-auto w-full max-w-md transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                            Create your account
                        </h1>
                        <p className="text-brand-slate/60">
                            Start your journey with AI agents today
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-600 animate-fade-in">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-brand-slate font-medium">
                                Full name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 rounded-xl border-2 border-brand-slate/10 bg-white px-4 transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-brand-slate font-medium">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 rounded-xl border-2 border-brand-slate/10 bg-white px-4 transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-brand-slate font-medium">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 rounded-xl border-2 border-brand-slate/10 bg-white px-4 transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                            />
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-brand-cream to-brand-orange/5 border-2 border-brand-slate/10 p-4 text-sm text-brand-slate/70">
                            <p className="mb-1">• New accounts start as <span className="font-semibold text-brand-teal">Buyer</span> role</p>
                            <p>• Contact admin to become a <span className="font-semibold text-brand-orange">Seller</span></p>
                        </div>

                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {loading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-brand-slate/60">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Feature Showcase */}
            <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-teal via-brand-teal/90 to-brand-orange overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-brand-orange/30 blur-3xl" />
                </div>

                <div className={`relative z-10 flex flex-col justify-center px-16 xl:px-20 text-white transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className="mb-12">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            <span>Start for free today</span>
                        </div>
                        <h2 className="mb-4 text-4xl font-bold leading-tight xl:text-5xl">
                            Join the AI Revolution
                        </h2>
                        <p className="text-xl text-white/80">
                            Whether you&apos;re buying or selling, we&apos;ve got you covered
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                icon: ShoppingCart,
                                title: 'For Buyers',
                                description: 'Browse 1000+ verified AI agents ready to deploy instantly',
                                delay: '500ms'
                            },
                            {
                                icon: Store,
                                title: 'For Sellers',
                                description: 'List your AI agents and reach thousands of potential customers',
                                delay: '700ms'
                            },
                            {
                                icon: Users,
                                title: 'Join the Community',
                                description: 'Connect with AI innovators and grow your business',
                                delay: '900ms'
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                                style={{ transitionDelay: feature.delay }}
                            >
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="mb-1 font-semibold text-lg">{feature.title}</h3>
                                    <p className="text-white/70">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`mt-12 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="mb-4">
                            <p className="text-2xl font-bold">10,000+</p>
                            <p className="text-white/70">Active users worldwide</p>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-brand-orange to-brand-teal" />
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Trusted by teams at</p>
                                <p className="text-xs text-white/70">Leading tech companies</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
