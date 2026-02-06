import { NextRequest, NextResponse } from 'next/server'
import { getSubscriptionState } from '@/lib/subscription'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const state = await getSubscriptionState(userId)

  return NextResponse.json({
    hasAccess: state.hasAccess,
    status: state.status,
    isTrial: state.isTrial,
    isLegacy: state.isLegacy,
    cancelAtPeriodEnd: state.cancelAtPeriodEnd,
    currentPeriodEnd: state.currentPeriodEnd?.toISOString() || null,
    trialEnd: state.trialEnd?.toISOString() || null,
  })
}
