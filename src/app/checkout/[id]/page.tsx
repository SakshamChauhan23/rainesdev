import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { hasPurchased } from '@/lib/purchases'
import { Lock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckoutContent } from '@/components/checkout/checkout-content'

export default async function CheckoutPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login?next=/checkout/' + params.id)
    }

    // Fetch agent with assisted setup fields
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

    return <CheckoutContent agent={agent} />
}
