'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { logger } from '@/lib/logger'
import { SavingsReviewTier } from '@prisma/client'

export type IntakeFormState = {
  message?: string
  success?: boolean
}

export async function submitIntakeForm(
  prevState: IntakeFormState,
  formData: FormData
): Promise<IntakeFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: 'You must be logged in to submit a review request.' }
  }

  // Check for existing active review
  const existingReview = await prisma.savingsReview.findFirst({
    where: {
      userId: user.id,
      status: { in: ['AWAITING_BOOKING', 'AWAITING_PAYMENT', 'PAID', 'IN_PROGRESS'] },
    },
  })

  if (existingReview) {
    return {
      message: 'You already have an active savings review. Check your library for status.',
    }
  }

  const tier = formData.get('tier') as string
  if (!tier || !['SNAPSHOT', 'FULL_REVIEW'].includes(tier)) {
    return { message: 'Invalid tier selected.' }
  }

  const companyName = formData.get('companyName') as string
  const industry = formData.get('industry') as string
  const companySize = formData.get('companySize') as string
  const currentTools = formData.get('currentTools') as string
  const painPoints = formData.get('painPoints') as string
  const aiExperience = formData.get('aiExperience') as string
  const goals = formData.get('goals') as string
  const additionalNotes = formData.get('additionalNotes') as string

  if (!companyName || companyName.length < 2) {
    return { message: 'Company name must be at least 2 characters.' }
  }
  if (!industry) {
    return { message: 'Please select your industry.' }
  }
  if (!companySize) {
    return { message: 'Please select your company size.' }
  }
  if (!currentTools || currentTools.length < 10) {
    return { message: 'Please describe your current tools (at least 10 characters).' }
  }
  if (!painPoints || painPoints.length < 10) {
    return { message: 'Please describe your pain points (at least 10 characters).' }
  }
  if (!aiExperience) {
    return { message: 'Please select your AI experience level.' }
  }
  if (!goals || goals.length < 10) {
    return { message: 'Please describe your goals (at least 10 characters).' }
  }

  try {
    await prisma.savingsReview.create({
      data: {
        userId: user.id,
        tier: tier as SavingsReviewTier,
        status: 'AWAITING_BOOKING',
        companyName,
        industry,
        companySize,
        currentTools,
        painPoints,
        aiExperience,
        goals,
        additionalNotes: additionalNotes || null,
      },
    })

    logger.info(`Savings review intake submitted by user ${user.id} — tier: ${tier}`)
  } catch (error) {
    logger.error('Failed to create savings review:', error)
    return { message: 'Something went wrong. Please try again.' }
  }

  redirect('/ai-savings-review/book')
}
