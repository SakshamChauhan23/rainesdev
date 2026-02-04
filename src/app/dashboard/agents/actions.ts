'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logger } from '@/lib/logger'
import {
  markParentAsHavingUpdate,
  clearParentUpdateFlag,
  promoteVersionToLatest,
} from '@/lib/agent-versions'

export async function submitAgentForReview(agentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  logger.info('🔍 Submit for Review - User check:', { userId: user?.id, agentId })

  if (!user) {
    throw new Error('Unauthorized: You must be logged in')
  }

  // Verify ownership and current status
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: {
      id: true,
      title: true,
      sellerId: true,
      status: true,
    },
  })

  if (!agent) {
    throw new Error('Agent not found')
  }

  if (agent.sellerId !== user.id) {
    throw new Error('Unauthorized: You do not own this agent')
  }

  if (agent.status !== 'DRAFT' && agent.status !== 'REJECTED') {
    throw new Error(
      `Cannot submit agent with status: ${agent.status}. Only DRAFT or REJECTED agents can be submitted.`
    )
  }

  logger.info('📝 Submitting agent for review:', { agentId, title: agent.title })

  // Update status to UNDER_REVIEW and clear rejection reason if resubmitting
  await prisma.agent.update({
    where: { id: agentId },
    data: {
      status: 'UNDER_REVIEW',
      rejectionReason: null, // Clear previous rejection reason
    },
  })

  logger.info('✅ Agent submitted for review successfully')

  // Revalidate dashboard to show updated status
  revalidatePath('/dashboard')
}

export async function requestAgentUpdate(agentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  logger.info('🔍 Request Update - User check:', { userId: user?.id, agentId })

  if (!user) {
    throw new Error('Unauthorized: You must be logged in')
  }

  // Verify ownership and current status
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: {
      id: true,
      title: true,
      slug: true,
      sellerId: true,
      status: true,
      categoryId: true,
      shortDescription: true,
      workflowOverview: true,
      useCase: true,
      price: true,
      supportAddonPrice: true,
      demoVideoUrl: true,
      thumbnailUrl: true,
      setupGuide: true,
      workflowDetails: true,
      version: true,
      hasActiveUpdate: true,
    },
  })

  if (!agent) {
    throw new Error('Agent not found')
  }

  if (agent.sellerId !== user.id) {
    throw new Error('Unauthorized: You do not own this agent')
  }

  if (agent.status !== 'APPROVED') {
    throw new Error('Only approved agents can request updates')
  }

  if (agent.hasActiveUpdate) {
    throw new Error('This agent already has a pending update')
  }

  logger.info('📝 Creating new version for agent:', {
    agentId,
    title: agent.title,
    currentVersion: agent.version,
  })

  // Use transaction to ensure version creation and parent update are atomic (P2.6)
  const newVersion = await prisma.$transaction(async tx => {
    // Create a new draft version of the agent
    const version = await tx.agent.create({
      data: {
        sellerId: agent.sellerId,
        categoryId: agent.categoryId,
        title: agent.title,
        slug: `${agent.slug}-v${agent.version + 1}-draft`,
        shortDescription: agent.shortDescription,
        workflowOverview: agent.workflowOverview,
        useCase: agent.useCase,
        price: agent.price,
        supportAddonPrice: agent.supportAddonPrice,
        demoVideoUrl: agent.demoVideoUrl,
        thumbnailUrl: agent.thumbnailUrl,
        setupGuide: agent.setupGuide,
        workflowDetails: agent.workflowDetails || undefined,
        status: 'DRAFT',
        version: agent.version + 1,
        isLatestVersion: false,
        parentAgentId: agent.id,
      },
    })

    // Mark the parent agent as having an active update (P2.5)
    await markParentAsHavingUpdate(tx, agentId)

    return version
  })

  logger.info('✅ New version created successfully:', {
    newVersionId: newVersion.id,
    version: newVersion.version,
  })

  // Revalidate dashboard
  revalidatePath('/dashboard')

  // Redirect to edit the new version
  redirect(`/dashboard/agents/${newVersion.id}/edit`)
}

// This function handles what happens when a new version is approved
// It should be called by the admin approval system
export async function approveAgentVersion(agentId: string) {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: {
      id: true,
      status: true,
      parentAgentId: true,
      version: true,
      slug: true,
    },
  })

  if (!agent) {
    throw new Error('Agent not found')
  }

  // Only approve agents that are under review
  if (agent.status !== 'UNDER_REVIEW') {
    throw new Error('Only agents under review can be approved')
  }

  // Check if this is a new version of an existing agent
  if (agent.parentAgentId) {
    // This is a new version - use centralized version management (P2.5)
    await prisma.$transaction(async tx => {
      // Archive parent and promote new version
      await promoteVersionToLatest(tx, agentId, agent.parentAgentId!)

      // Approve the new version
      await tx.agent.update({
        where: { id: agentId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
        },
      })
    })
  } else {
    // This is a brand new agent, just approve it normally
    await prisma.agent.update({
      where: { id: agentId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        isLatestVersion: true,
      },
    })
  }

  logger.info('✅ Agent approved successfully')
  revalidatePath('/dashboard')
  revalidatePath('/agents')
}

// This function handles what happens when an agent version is rejected
// It should be called by the admin rejection system
export async function rejectAgentVersion(agentId: string, rejectionReason: string) {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: {
      id: true,
      status: true,
      parentAgentId: true,
    },
  })

  if (!agent) {
    throw new Error('Agent not found')
  }

  // Only reject agents that are under review
  if (agent.status !== 'UNDER_REVIEW') {
    throw new Error('Only agents under review can be rejected')
  }

  // If this is a version update, clear the parent's hasActiveUpdate flag (P2.5)
  if (agent.parentAgentId) {
    await prisma.$transaction(async tx => {
      // Use centralized version management
      await clearParentUpdateFlag(tx, agent.parentAgentId!)

      // Reject the new version
      await tx.agent.update({
        where: { id: agentId },
        data: {
          status: 'REJECTED',
          rejectionReason,
        },
      })
    })
  } else {
    // This is a new agent, just reject it
    await prisma.agent.update({
      where: { id: agentId },
      data: {
        status: 'REJECTED',
        rejectionReason,
      },
    })
  }

  logger.info('✅ Agent rejected successfully')
  revalidatePath('/dashboard')
}
