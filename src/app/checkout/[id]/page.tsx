import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { CheckoutConfirmButton } from '@/components/checkout/checkout-confirm-button'
import { formatPrice } from '@/lib/utils'
import { hasPurchased } from '@/lib/purchases'
import { ShieldCheck, Package, FileText, Lock, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default async function CheckoutPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login?next=/checkout/' + params.id)
    }

    // Fetch agent
    const agent = await prisma.agent.findUnique({
        where: { id: params.id },
        include: {
            seller: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        }
    })

    if (!agent) {
        notFound()
    }

    // Block if not approved
    if (agent.status !== 'APPROVED') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-brand-cream p-6">
                <div className="max-w-md w-full rounded-3xl bg-white border-2 border-brand-slate/10 p-8 shadow-xl text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
                        <Lock className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-slate mb-3">Agent Not Available</h3>
                    <p className="text-brand-slate/60 mb-6">
                        This agent is not available for purchase at this time
                    </p>
                    <Link href="/agents">
                        <Button className="w-full h-12 rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90">
                            Browse Agents
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    // Check if already purchased
    const alreadyPurchased = await hasPurchased(user.id, agent.id)

    if (alreadyPurchased) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-brand-cream p-6">
                <div className="max-w-md w-full rounded-3xl bg-white border-2 border-brand-slate/10 p-8 shadow-xl text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-slate mb-3">Already Unlocked</h3>
                    <p className="text-brand-slate/60 mb-6">
                        You already own this agent and have full access
                    </p>
                    <Link href={`/agents/${agent.slug}`}>
                        <Button className="w-full h-12 rounded-xl bg-brand-teal font-semibold text-white shadow-lg shadow-brand-teal/30 hover:bg-brand-teal/90">
                            View Agent
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

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
                            <p className="text-3xl font-bold">{formatPrice(Number(agent.price))}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/70">Subtotal</span>
                                <span className="font-semibold">{formatPrice(Number(agent.price))}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/70">Platform Fee</span>
                                <span className="font-semibold">${(0).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-3 border-t border-white/20">
                                <span className="font-semibold">Total</span>
                                <span className="text-xl font-bold">{formatPrice(Number(agent.price))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="mb-8">
                        <CheckoutConfirmButton agentId={agent.id} agentSlug={agent.slug} />
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
