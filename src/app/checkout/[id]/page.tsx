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
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

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
          email: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!agent) {
    notFound()
  }

  // Block if not approved
  if (agent.status !== 'APPROVED') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream p-6">
        <div className="w-full max-w-md rounded-3xl border-2 border-brand-slate/10 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-brand-slate">Agent Not Available</h3>
          <p className="mb-6 text-brand-slate/60">
            This agent is not available for purchase at this time
          </p>
          <Link href="/agents">
            <Button className="h-12 w-full rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90">
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
        <div className="w-full max-w-md rounded-3xl border-2 border-brand-slate/10 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange/80 to-brand-orange shadow-lg shadow-brand-orange/30">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-brand-slate">Already Unlocked</h3>
          <p className="mb-6 text-brand-slate/60">
            You already own this agent and have full access
          </p>
          <Link href={`/agents/${agent.slug}`}>
            <Button className="h-12 w-full rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90">
              View Agent
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Convert Decimal to number for component
  const agentWithNumberPrice = {
    ...agent,
    price: Number(agent.price),
    assistedSetupPrice: Number(agent.assistedSetupPrice),
  }

  return <CheckoutContent agent={agentWithNumberPrice} />
}
