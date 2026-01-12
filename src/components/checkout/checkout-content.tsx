'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckoutConfirmButton } from '@/components/checkout/checkout-confirm-button'
import { formatPrice } from '@/lib/utils'
import { ShieldCheck, Package, FileText, Lock, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Agent {
    id: string
    title: string
    slug: string
    price: number
    version: number
    thumbnailUrl: string | null
    assistedSetupEnabled: boolean
    assistedSetupPrice: number
    seller: {
        name: string | null
        email: string
    }
    category: {
        name: string
    }
}

interface CheckoutContentProps {
    agent: Agent
}

export function CheckoutContent({ agent }: CheckoutContentProps) {
    const [assistedSetupSelected, setAssistedSetupSelected] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Read assisted setup selection from session storage
        const stored = sessionStorage.getItem(`assistedSetup_${agent.id}`)
        setAssistedSetupSelected(stored === 'true')
        setIsLoading(false)
    }, [agent.id])

    const agentPrice = Number(agent.price)
    const setupPrice = assistedSetupSelected ? Number(agent.assistedSetupPrice) : 0
    const totalPrice = agentPrice + setupPrice

    return (
        <div className="min-h-screen bg-brand-cream flex flex-col lg:flex-row">
            {/* Left Side - Main Content */}
            <div className="flex-1 px-6 py-12 lg:px-16 xl:px-24">
                <div className="mx-auto max-w-2xl">
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

                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 px-4 py-2 text-sm font-medium text-brand-orange">
                            <Sparkles className="h-4 w-4" />
                            <span>Secure Checkout</span>
                        </div>
                        <h1 className="mb-3 text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
                            Complete Your Purchase
                        </h1>
                        <p className="text-brand-slate/60">
                            Get instant access to this AI agent and start transforming your workflow
                        </p>
                    </div>

                    {/* Agent Details Card */}
                    <div className="mb-8 rounded-3xl bg-white border-2 border-brand-slate/10 p-6 shadow-lg">
                        <div className="flex items-start gap-4">
                            {agent.thumbnailUrl && (
                                <img
                                    src={agent.thumbnailUrl}
                                    alt={agent.title}
                                    className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-slate/10"
                                />
                            )}
                            <div className="flex-1">
                                <h2 className="mb-2 text-2xl font-bold text-brand-slate">{agent.title}</h2>
                                <p className="text-brand-slate/60 mb-3">
                                    by {agent.seller.name || agent.seller.email}
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge className="rounded-lg bg-brand-teal/10 text-brand-teal border-brand-teal/20">
                                        v{agent.version}
                                    </Badge>
                                    <Badge className="rounded-lg bg-brand-orange/10 text-brand-orange border-brand-orange/20">
                                        {agent.category.name}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* What's Included */}
                    <div className="mb-8">
                        <h2 className="mb-6 text-2xl font-bold text-brand-slate">What's Included</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 rounded-2xl bg-white border-2 border-brand-slate/10 p-5 transition-all hover:border-brand-teal/30 hover:shadow-lg">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
                                    <FileText className="h-6 w-6 text-brand-orange" />
                                </div>
                                <div>
                                    <p className="mb-1 font-semibold text-brand-slate">Complete Setup Guide</p>
                                    <p className="text-sm text-brand-slate/60">
                                        Step-by-step instructions to deploy and configure the agent
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 rounded-2xl bg-white border-2 border-brand-slate/10 p-5 transition-all hover:border-brand-teal/30 hover:shadow-lg">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-teal/10">
                                    <Package className="h-6 w-6 text-brand-teal" />
                                </div>
                                <div>
                                    <p className="mb-1 font-semibold text-brand-slate">Workflow Details</p>
                                    <p className="text-sm text-brand-slate/60">
                                        Technical implementation and configuration files
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 rounded-2xl bg-white border-2 border-brand-slate/10 p-5 transition-all hover:border-brand-teal/30 hover:shadow-lg">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
                                    <ShieldCheck className="h-6 w-6 text-brand-orange" />
                                </div>
                                <div>
                                    <p className="mb-1 font-semibold text-brand-slate">Lifetime Access</p>
                                    <p className="text-sm text-brand-slate/60">
                                        Access this version forever, even if updated
                                    </p>
                                </div>
                            </div>

                            {/* Assisted Setup - Show if selected */}
                            {!isLoading && assistedSetupSelected && (
                                <div className="flex items-start gap-4 rounded-2xl bg-white border-2 border-brand-teal/30 p-5 shadow-lg">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-teal/10">
                                        <Sparkles className="h-6 w-6 text-brand-teal" />
                                    </div>
                                    <div>
                                        <p className="mb-1 font-semibold text-brand-slate">Admin-Assisted Setup (One-Time)</p>
                                        <p className="text-sm text-brand-slate/60">
                                            Our team will configure initial settings and connect your tools
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Test Mode Notice - Desktop Only */}
                    <div className="hidden lg:block rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 p-5">
                        <p className="text-sm text-blue-900">
                            <strong className="font-semibold">Test Mode – No payment required.</strong> This is a test purchase flow.
                            In production, this will be replaced with Stripe checkout.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Dark Sidebar with Order Summary */}
            <div className="lg:w-[480px] xl:w-[520px] bg-gradient-to-br from-brand-slate via-brand-slate to-brand-slate/90 px-6 py-12 lg:px-10 xl:px-12 text-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
                <div className="mx-auto max-w-md">
                    <h2 className="mb-8 text-2xl font-bold">Order Summary</h2>

                    {/* Price Breakdown */}
                    <div className="mb-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
                        <div className="mb-6 pb-6 border-b border-white/20">
                            <p className="text-sm text-white/70 mb-1">Agent Price</p>
                            <p className="text-3xl font-bold">{formatPrice(agentPrice)}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/70">Subtotal</span>
                                <span className="font-semibold">{formatPrice(agentPrice)}</span>
                            </div>

                            {/* Assisted Setup Line Item */}
                            {!isLoading && assistedSetupSelected && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/70">Assisted Setup</span>
                                    <span className="font-semibold">
                                        {setupPrice === 0 ? 'Included (Free)' : formatPrice(setupPrice)}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/70">Platform Fee</span>
                                <span className="font-semibold">${(0).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-3 border-t border-white/20">
                                <span className="font-semibold">Total</span>
                                <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="mb-8">
                        <CheckoutConfirmButton
                            agentId={agent.id}
                            agentSlug={agent.slug}
                            assistedSetupRequested={assistedSetupSelected}
                        />
                    </div>

                    {/* Security Features */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Secure Payment</p>
                                <p className="text-xs text-white/70">Protected by Stripe</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Instant Access</p>
                                <p className="text-xs text-white/70">Available immediately</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Money-Back Guarantee</p>
                                <p className="text-xs text-white/70">30-day refund policy</p>
                            </div>
                        </div>
                    </div>

                    {/* Test Mode Notice - Mobile */}
                    <div className="lg:hidden mt-8 rounded-2xl bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 p-4">
                        <p className="text-sm text-blue-100">
                            <strong className="font-semibold">Test Mode</strong> – No payment required. This is a test purchase flow.
                        </p>
                    </div>

                    {/* Support */}
                    <div className="mt-8 pt-8 border-t border-white/20">
                        <p className="text-sm text-white/70 text-center">
                            Need help?{' '}
                            <a href="#" className="text-brand-teal hover:text-brand-teal/80 font-semibold transition-colors">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
