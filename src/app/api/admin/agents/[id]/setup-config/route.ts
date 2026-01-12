import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getUserWithRole } from '@/lib/user-sync'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const prismaUser = await getUserWithRole(user.id)
    if (!prismaUser || prismaUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { assistedSetupEnabled, assistedSetupPrice } = body

    if (typeof assistedSetupEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'assistedSetupEnabled must be a boolean' },
        { status: 400 }
      )
    }

    const price = parseFloat(assistedSetupPrice) || 0
    if (price < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      )
    }

    // Update agent configuration
    const agent = await prisma.agent.update({
      where: { id: params.id },
      data: {
        assistedSetupEnabled,
        assistedSetupPrice: price,
      },
      select: {
        id: true,
        title: true,
        assistedSetupEnabled: true,
        assistedSetupPrice: true,
      },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: 'UPDATE_CATEGORY', // Reusing existing enum value
        entityType: 'AGENT_SETUP_CONFIG',
        entityId: params.id,
        metadata: {
          assistedSetupEnabled,
          assistedSetupPrice: price,
        },
      },
    })

    return NextResponse.json({
      success: true,
      agent,
    })
  } catch (error) {
    console.error('Error updating assisted setup config:', error)
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    )
  }
}
