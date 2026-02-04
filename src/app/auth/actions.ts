'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { syncUserToPrisma, getUserWithRole } from '@/lib/user-sync'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

/**
 * Handle post-login redirect based on user role
 */
export async function handlePostLoginRedirect(nextUrl?: string) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login')
  }

  // Sync user to Prisma
  await syncUserToPrisma(user)

  // Get user role
  const prismaUser = await getUserWithRole(user.id)

  if (!prismaUser) {
    throw new Error('User not found in database')
  }

  // Determine redirect based on role
  if (nextUrl) {
    // If there's a next URL, redirect there
    redirect(nextUrl)
  } else if (prismaUser.role === 'ADMIN') {
    redirect('/admin')
  } else if (prismaUser.role === 'SELLER') {
    redirect('/dashboard')
  } else {
    // BUYER - redirect to marketplace
    redirect('/agents')
  }
}

/**
 * Login action
 */
export async function loginAction(email: string, password: string, nextUrl?: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Login failed' }
    }

    // Sync user to Prisma database
    await syncUserToPrisma(data.user)

    // Get user role
    const prismaUser = await getUserWithRole(data.user.id)

    if (!prismaUser) {
      return { success: false, error: 'User not found' }
    }

    // Determine redirect URL based on role
    let redirectUrl = '/agents'

    if (nextUrl) {
      redirectUrl = nextUrl
    } else if (prismaUser.role === 'ADMIN') {
      redirectUrl = '/admin'
    } else if (prismaUser.role === 'SELLER') {
      redirectUrl = '/dashboard'
    }

    revalidatePath('/', 'layout')

    return {
      success: true,
      redirectUrl,
      role: prismaUser.role,
    }
  } catch (error) {
    logger.error('Login error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    }
  }
}

/**
 * Signup action
 */
export async function signupAction(email: string, password: string, name?: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || null,
        },
        // Skip email confirmation in development
        // Set to false in production or configure Supabase email templates
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Signup failed' }
    }

    // Check if email confirmation is required
    const isEmailConfirmed = data.user.confirmed_at !== null

    // Sync user to Prisma database with default BUYER role
    await syncUserToPrisma(data.user)

    revalidatePath('/', 'layout')

    // If email confirmation is disabled in Supabase, user can login immediately
    if (isEmailConfirmed) {
      return {
        success: true,
        message: 'Account created successfully!',
        redirectUrl: '/agents', // Buyers go to marketplace
      }
    } else {
      // Email confirmation required
      return {
        success: true,
        message:
          'Account created! Please check your email to verify your account before logging in.',
        redirectUrl: '/login',
        requiresEmailConfirmation: true,
      }
    }
  } catch (error) {
    logger.error('Signup error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed',
    }
  }
}

/**
 * Logout action
 */
export async function logoutAction() {
  const supabase = await createClient()

  try {
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    logger.error('Logout error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    }
  }
}
