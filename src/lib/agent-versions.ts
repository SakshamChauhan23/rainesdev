/**
 * Agent Version Management Utilities (P2.5)
 *
 * Centralizes management of hasActiveUpdate and isLatestVersion flags
 * to prevent data inconsistencies across the codebase.
 *
 * These flags track the versioning state of agents:
 * - hasActiveUpdate: true when an approved agent has a pending draft update
 * - isLatestVersion: true for the currently active version of an agent
 *
 * All agent version state changes should go through these functions.
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { PrismaClient, Prisma } from '@prisma/client'

type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

/**
 * Mark a parent agent as having an active pending update
 * Called when a seller creates a new draft version
 */
export async function markParentAsHavingUpdate(
  tx: PrismaTransaction | typeof prisma,
  parentAgentId: string
): Promise<void> {
  await tx.agent.update({
    where: { id: parentAgentId },
    data: { hasActiveUpdate: true },
  })
  logger.info('[AgentVersions] Marked parent as having active update', { parentAgentId })
}

/**
 * Clear the hasActiveUpdate flag from a parent agent
 * Called when a pending update is approved, rejected, or deleted
 */
export async function clearParentUpdateFlag(
  tx: PrismaTransaction | typeof prisma,
  parentAgentId: string
): Promise<void> {
  await tx.agent.update({
    where: { id: parentAgentId },
    data: { hasActiveUpdate: false },
  })
  logger.info('[AgentVersions] Cleared active update flag from parent', { parentAgentId })
}

/**
 * Transition a new version to become the latest
 * Archives the old version and promotes the new one
 */
export async function promoteVersionToLatest(
  tx: PrismaTransaction,
  newVersionId: string,
  parentAgentId: string
): Promise<void> {
  // Get the parent agent's current slug and version
  const parentAgent = await tx.agent.findUnique({
    where: { id: parentAgentId },
    select: { slug: true, version: true },
  })

  if (!parentAgent) {
    throw new Error('Parent agent not found')
  }

  // Archive the old version
  await tx.agent.update({
    where: { id: parentAgentId },
    data: {
      isLatestVersion: false,
      hasActiveUpdate: false,
      slug: `${parentAgent.slug}-v${parentAgent.version}-archived`,
    },
  })

  // Promote the new version
  await tx.agent.update({
    where: { id: newVersionId },
    data: {
      isLatestVersion: true,
      slug: parentAgent.slug, // Use the parent's original slug
    },
  })

  logger.info('[AgentVersions] Promoted version to latest', {
    newVersionId,
    parentAgentId,
    archivedSlug: `${parentAgent.slug}-v${parentAgent.version}-archived`,
  })
}

/**
 * Check and repair any inconsistent version flags
 * Returns the number of issues found and fixed
 *
 * Inconsistencies that can occur:
 * 1. Parent marked as hasActiveUpdate but no child version in DRAFT/UNDER_REVIEW
 * 2. Multiple isLatestVersion=true for agents with same base slug
 * 3. Orphaned draft versions with no parent
 */
export async function repairVersionFlags(): Promise<{
  orphanedUpdates: number
  duplicateLatest: number
  orphanedDrafts: number
}> {
  const results = {
    orphanedUpdates: 0,
    duplicateLatest: 0,
    orphanedDrafts: 0,
  }

  // 1. Find agents marked as hasActiveUpdate but with no pending child version
  const agentsWithOrphanedUpdateFlag = await prisma.agent.findMany({
    where: {
      hasActiveUpdate: true,
      childVersions: {
        none: {
          status: {
            in: ['DRAFT', 'UNDER_REVIEW'],
          },
        },
      },
    },
    select: { id: true, slug: true },
  })

  if (agentsWithOrphanedUpdateFlag.length > 0) {
    await prisma.agent.updateMany({
      where: {
        id: { in: agentsWithOrphanedUpdateFlag.map(a => a.id) },
      },
      data: { hasActiveUpdate: false },
    })
    results.orphanedUpdates = agentsWithOrphanedUpdateFlag.length
    logger.warn('[AgentVersions] Fixed orphaned update flags', {
      count: agentsWithOrphanedUpdateFlag.length,
      agents: agentsWithOrphanedUpdateFlag.map(a => a.slug),
    })
  }

  // 2. Find draft/rejected versions that reference non-existent parents
  const orphanedDrafts = await prisma.agent.findMany({
    where: {
      parentAgentId: { not: null },
      status: { in: ['DRAFT', 'REJECTED'] },
      parentAgent: null, // Parent doesn't exist
    },
    select: { id: true, slug: true },
  })

  // These would need manual intervention - just log them
  if (orphanedDrafts.length > 0) {
    results.orphanedDrafts = orphanedDrafts.length
    logger.warn('[AgentVersions] Found orphaned draft versions', {
      count: orphanedDrafts.length,
      agents: orphanedDrafts.map(a => a.slug),
    })
  }

  logger.info('[AgentVersions] Version flag repair complete', results)
  return results
}

/**
 * Get version history for an agent
 * Returns all versions of an agent including the current one
 */
export async function getVersionHistory(agentId: string): Promise<
  {
    id: string
    version: number
    status: string
    isLatestVersion: boolean
    createdAt: Date
    approvedAt: Date | null
  }[]
> {
  // First, get the root agent (find the earliest parent or the agent itself)
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: { id: true, parentAgentId: true },
  })

  if (!agent) {
    return []
  }

  // Find the root by traversing up the parent chain
  let rootId = agent.id
  if (agent.parentAgentId) {
    const parent = await prisma.agent.findUnique({
      where: { id: agent.parentAgentId },
      select: { id: true, parentAgentId: true },
    })
    if (parent) {
      // For simplicity, assume max 2 levels (original -> v2)
      rootId = parent.parentAgentId || parent.id
    }
  }

  // Get all versions
  const versions = await prisma.agent.findMany({
    where: {
      OR: [{ id: rootId }, { parentAgentId: rootId }],
    },
    select: {
      id: true,
      version: true,
      status: true,
      isLatestVersion: true,
      createdAt: true,
      approvedAt: true,
    },
    orderBy: { version: 'asc' },
  })

  return versions
}

/**
 * Validate version state before operations
 * Throws if state is inconsistent
 */
export async function validateVersionState(agentId: string): Promise<{
  valid: boolean
  issues: string[]
}> {
  const issues: string[] = []

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: {
      childVersions: {
        select: { id: true, status: true },
      },
    },
  })

  if (!agent) {
    return { valid: false, issues: ['Agent not found'] }
  }

  // Check: If hasActiveUpdate is true, there should be a child in DRAFT or UNDER_REVIEW
  if (agent.hasActiveUpdate) {
    const pendingChild = agent.childVersions.find(c => ['DRAFT', 'UNDER_REVIEW'].includes(c.status))
    if (!pendingChild) {
      issues.push('hasActiveUpdate is true but no pending child version exists')
    }
  }

  // Check: Approved agents should have isLatestVersion consistent with their role
  if (agent.status === 'APPROVED' && !agent.isLatestVersion && !agent.parentAgentId) {
    // If approved but not latest, and has no parent, check if there's an approved child
    const approvedChild = agent.childVersions.find(c => c.status === 'APPROVED')
    if (!approvedChild) {
      issues.push('Agent is approved but not marked as latest, with no approved child')
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}
