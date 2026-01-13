import { logger } from '@/lib/logger'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserWithRole } from '@/lib/user-sync'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { status, complexity, adminNotes, callStatus } = body

    // Validate status if provided
    if (status && !['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Validate complexity if provided
    if (complexity && !['QUICK', 'STANDARD', 'COMPLEX', null].includes(complexity)) {
      return NextResponse.json({ error: 'Invalid complexity' }, { status: 400 })
    }

    // Validate callStatus if provided
    if (callStatus && !['PENDING', 'SCHEDULED', 'COMPLETED'].includes(callStatus)) {
      return NextResponse.json({ error: 'Invalid call status' }, { status: 400 })
    }

    // Build update data
    const updateData: any = {}

    if (status !== undefined) {
      updateData.status = status
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
    }

    if (complexity !== undefined) {
      updateData.complexity = complexity
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes
    }

    if (callStatus !== undefined) {
      updateData.callStatus = callStatus
    }

    // Update setup request
    const setupRequest = await prisma.setupRequest.update({
      where: { id: params.id },
      data: updateData,
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
        }
      }
    })

    return NextResponse.json({ setupRequest })
  } catch (error) {
    logger.error('Error updating setup request:', error)
    return NextResponse.json(
      { error: 'Failed to update setup request' },
      { status: 500 }
    )
  }
}
