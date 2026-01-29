'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { logger } from '@/lib/logger'

export type SellerApplicationState = {
  errors?: {
    fullName?: string[]
    experience?: string[]
    agentIdeas?: string[]
    _form?: string[]
  }
  message?: string
  success?: boolean
}

export async function submitSellerApplication(
  prevState: SellerApplicationState,
  formData: FormData
): Promise<SellerApplicationState> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      message: 'You must be logged in to apply',
    }
  }

  // Check if user already has a pending or approved application
  const existingApplication = await prisma.sellerApplication.findUnique({
    where: { userId: user.id },
  })

  if (existingApplication) {
    if (existingApplication.status === 'PENDING_REVIEW') {
      return {
        message: 'You already have a pending application. Please wait for admin review.',
      }
    }
    if (existingApplication.status === 'APPROVED') {
      redirect('/dashboard')
    }
    // If rejected, allow reapplication by deleting old application
    if (existingApplication.status === 'REJECTED') {
      await prisma.sellerApplication.delete({
        where: { id: existingApplication.id },
      })
    }
  }

  // Check if user is already a seller
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  if (dbUser?.role === 'SELLER' || dbUser?.role === 'ADMIN') {
    redirect('/dashboard')
  }

  // Validate fields
  const fullName = formData.get('fullName') as string
  const experience = formData.get('experience') as string
  const agentIdeas = formData.get('agentIdeas') as string
  const relevantLinks = formData.get('relevantLinks') as string

  if (!fullName || fullName.length < 2) {
    return { message: 'Full name must be at least 2 characters' }
  }

  if (!experience || experience.length < 50) {
    return { message: 'Please provide more detail about your experience (at least 50 characters)' }
  }

  if (!agentIdeas || agentIdeas.length < 30) {
    return { message: 'Please describe your agent ideas in more detail (at least 30 characters)' }
  }

  try {
    await prisma.sellerApplication.create({
      data: {
        userId: user.id,
        fullName,
        experience,
        agentIdeas,
        relevantLinks: relevantLinks || null,
      },
    })

    logger.info('✅ Seller application submitted:', user.id)
  } catch (error) {
    logger.error('Failed to submit seller application:', error)
    return {
      message: 'Failed to submit application. Please try again.',
    }
  }

  redirect('/become-seller/success')
}
