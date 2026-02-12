import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserWithRole } from '@/lib/user-sync'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { SavingsReviewStatus } from '@prisma/client'

const validStatuses: SavingsReviewStatus[] = [
  'AWAITING_BOOKING',
  'AWAITING_PAYMENT',
  'PAID',
  'IN_PROGRESS',
  'COMPLETED',
]

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prismaUser = await getUserWithRole(user.id)
    if (!prismaUser || prismaUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, adminNotes, deliverableUrl } = body

    const updateData: Record<string, unknown> = {}

    if (status && validStatuses.includes(status)) {
      updateData.status = status
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes
    }

    if (deliverableUrl !== undefined) {
      updateData.deliverableUrl = deliverableUrl
    }

    const updated = await prisma.savingsReview.update({
      where: { id },
      data: updateData,
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: 'UPDATE_SAVINGS_REVIEW',
        entityType: 'SavingsReview',
        entityId: id,
        metadata: JSON.parse(JSON.stringify({ changes: updateData })),
      },
    })

    logger.info(`Admin ${user.id} updated savings review ${id}`)

    return NextResponse.json({ success: true, review: updated })
  } catch (error) {
    logger.error('Error updating savings review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
