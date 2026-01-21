'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserWithRole } from '@/lib/user-sync'
import { logger } from '@/lib/logger'
import { slugify } from '@/lib/utils'

async function verifyAdmin() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const prismaUser = await getUserWithRole(user.id)
  if (!prismaUser || prismaUser.role !== 'ADMIN') {
    throw new Error('Not authorized')
  }

  return user.id
}

export async function approveSellerApplication(applicationId: string) {
  const adminId = await verifyAdmin()

  try {
    // Get the application
    const application = await prisma.sellerApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!application) {
      return { error: 'Application not found' }
    }

    if (application.status !== 'PENDING_REVIEW') {
      return { error: 'Application has already been reviewed' }
    }

    // Generate a unique portfolio slug from the user's name or application fullName
    const baseName = application.user.name || application.fullName
    let portfolioSlug = slugify(baseName)

    // Check if slug exists and make it unique if needed
    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { portfolioUrlSlug: portfolioSlug },
    })

    if (existingProfile) {
      portfolioSlug = `${portfolioSlug}-${Math.random().toString(36).substring(2, 7)}`
    }

    // Use transaction to update application, user role, and create seller profile
    await prisma.$transaction([
      // Update application status
      prisma.sellerApplication.update({
        where: { id: applicationId },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedBy: adminId,
        },
      }),
      // Upgrade user role to SELLER
      prisma.user.update({
        where: { id: application.userId },
        data: { role: 'SELLER' },
      }),
      // Create seller profile
      prisma.sellerProfile.create({
        data: {
          userId: application.userId,
          portfolioUrlSlug: portfolioSlug,
          verificationStatus: 'VERIFIED',
        },
      }),
      // Log admin action
      prisma.adminLog.create({
        data: {
          adminId,
          action: 'APPROVE_SELLER_APPLICATION',
          entityType: 'SellerApplication',
          entityId: applicationId,
          metadata: {
            userId: application.userId,
            userEmail: application.user.email,
          },
        },
      }),
    ])

    logger.info(`✅ Seller application approved: ${applicationId} by admin ${adminId}`)
    revalidatePath('/admin/seller-applications')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    logger.error('Failed to approve seller application:', error)
    return { error: 'Failed to approve application' }
  }
}

export async function rejectSellerApplication(applicationId: string, reason: string) {
  const adminId = await verifyAdmin()

  if (!reason || reason.trim().length < 10) {
    return { error: 'Please provide a rejection reason (at least 10 characters)' }
  }

  try {
    const application = await prisma.sellerApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    })

    if (!application) {
      return { error: 'Application not found' }
    }

    if (application.status !== 'PENDING_REVIEW') {
      return { error: 'Application has already been reviewed' }
    }

    await prisma.$transaction([
      prisma.sellerApplication.update({
        where: { id: applicationId },
        data: {
          status: 'REJECTED',
          rejectionReason: reason.trim(),
          reviewedAt: new Date(),
          reviewedBy: adminId,
        },
      }),
      prisma.adminLog.create({
        data: {
          adminId,
          action: 'REJECT_SELLER_APPLICATION',
          entityType: 'SellerApplication',
          entityId: applicationId,
          metadata: {
            userId: application.userId,
            userEmail: application.user.email,
            reason: reason.trim(),
          },
        },
      }),
    ])

    logger.info(`❌ Seller application rejected: ${applicationId} by admin ${adminId}`)
    revalidatePath('/admin/seller-applications')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    logger.error('Failed to reject seller application:', error)
    return { error: 'Failed to reject application' }
  }
}
