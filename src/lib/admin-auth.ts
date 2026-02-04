import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

/**
 * Properly typed Supabase user for admin checks
 */
interface AdminCheckResult {
  userId: string
  email: string
  role: UserRole
}

/**
 * Require admin authentication
 * Checks auth from Supabase AND role from Prisma (source of truth)
 *
 * @returns User info if admin, redirects otherwise
 * @throws Never returns on auth failure (redirects instead)
 */
export async function requireAdmin(): Promise<AdminCheckResult> {
  // Step 1: Verify Supabase authentication
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/admin')
  }

  // Step 2: Get role from Prisma (source of truth, not Supabase metadata)
  const prismaUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  // Step 3: Verify user exists in database
  if (!prismaUser) {
    redirect('/login?next=/admin')
  }

  // Step 4: Verify admin role from database (not user-controllable metadata)
  if (prismaUser.role !== 'ADMIN') {
    redirect('/403') // Unauthorized page
  }

  return {
    userId: prismaUser.id,
    email: prismaUser.email,
    role: prismaUser.role,
  }
}

/**
 * Check if user is admin (non-redirecting version)
 * Returns admin info if user is admin, null otherwise
 *
 * @returns Admin user info or null
 */
export async function checkIsAdmin(): Promise<AdminCheckResult | null> {
  try {
    // Step 1: Verify Supabase authentication
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (!user || error) {
      return null
    }

    // Step 2: Get role from Prisma (source of truth)
    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    // Step 3: Verify user exists and is admin
    if (!prismaUser || prismaUser.role !== 'ADMIN') {
      return null
    }

    return {
      userId: prismaUser.id,
      email: prismaUser.email,
      role: prismaUser.role,
    }
  } catch (error) {
    return null
  }
}

/**
 * Require specific role(s)
 * Flexible version for checking multiple roles
 *
 * @param allowedRoles - Array of allowed roles
 * @returns User info if role matches, redirects otherwise
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AdminCheckResult> {
  // Step 1: Verify Supabase authentication
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login')
  }

  // Step 2: Get role from Prisma
  const prismaUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  // Step 3: Verify user exists
  if (!prismaUser) {
    redirect('/login')
  }

  // Step 4: Verify role is in allowed list
  if (!allowedRoles.includes(prismaUser.role)) {
    redirect('/403')
  }

  return {
    userId: prismaUser.id,
    email: prismaUser.email,
    role: prismaUser.role,
  }
}
