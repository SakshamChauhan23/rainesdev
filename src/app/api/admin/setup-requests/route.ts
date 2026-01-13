import { logger } from '@/lib/logger'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserWithRole } from '@/lib/user-sync'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin role
    const prismaUser = await getUserWithRole(user.id)
    if (!prismaUser || prismaUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Fetch all setup requests with related data
    const setupRequests = await prisma.setupRequest.findMany({
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        agent: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        purchase: {
          select: {
            id: true,
            purchasedAt: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' } // Most recent first
      ]
    })

    return NextResponse.json({ setupRequests })
  } catch (error) {
    logger.error('Error fetching setup requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch setup requests' },
      { status: 500 }
    )
  }
}
