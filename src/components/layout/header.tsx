'use client'
import { logger } from '@/lib/logger'

import Link from 'next/link'
import Image from 'next/image'
import { Container } from './container'
import { Button } from '@/components/ui/button'
import { Menu, X, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { UserNavItems, MobileNavItems } from './nav-items'
import { logoutAction } from '@/app/auth/actions'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<'BUYER' | 'SELLER' | 'ADMIN' | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      }
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      } else {
        setUserRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId: string) => {
    try {
      // Check cache first (5 minute TTL)
      const cacheKey = `user_role_${userId}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { role, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          // 5 minutes
          setUserRole(role)
          return
        }
      }

      const response = await fetch(`/api/user/role?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserRole(data.role)
        // Cache the role
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            role: data.role,
            timestamp: Date.now(),
          })
        )
      }
    } catch (error) {
      logger.error('Error fetching user role:', error)
    }
  }

  const handleSignOut = async () => {
    await logoutAction()
    setUser(null)
    setUserRole(null)
    // Clear cached role on logout
    if (user?.id) {
      localStorage.removeItem(`user_role_${user.id}`)
    }
    // Use window.location for hard redirect to ensure session is cleared
    window.location.href = '/'
  }

  const getRoleBadgeStyle = () => {
    switch (userRole) {
      case 'ADMIN':
        return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
      case 'SELLER':
        return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
      default:
        return 'bg-brand-slate/10 text-brand-slate border-brand-slate/20'
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-slate/10 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            <Image
              src="/logo.png"
              alt="Rouze.ai"
              width={200}
              height={56}
              className="h-16 w-auto transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/agents"
              className="text-sm font-medium text-brand-slate/70 transition-all hover:scale-105 hover:text-brand-orange"
            >
              Browse Agents
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-brand-slate/70 transition-all hover:scale-105 hover:text-brand-orange"
            >
              How It Works
            </Link>
            <Link
              href="/submit-agent"
              className="text-sm font-medium text-brand-orange transition-all hover:scale-105 hover:text-brand-orange/80"
            >
              Become a Seller
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 gap-2 rounded-xl px-3 hover:bg-brand-cream"
                  >
                    <Avatar className="h-8 w-8 border-2 border-brand-orange/20">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback className="bg-brand-orange font-semibold text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {userRole && (
                      <span
                        className={`hidden items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium sm:inline-flex ${getRoleBadgeStyle()}`}
                      >
                        {userRole === 'ADMIN' && <Sparkles className="h-3 w-3" />}
                        {userRole.charAt(0)}
                        {userRole.slice(1).toLowerCase()}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 rounded-2xl border-brand-slate/10 p-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="p-3 font-normal">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold text-brand-slate">Account</p>
                      <p className="truncate text-xs text-brand-slate/60">{user.email}</p>
                      {userRole && (
                        <span
                          className={`inline-flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${getRoleBadgeStyle()}`}
                        >
                          {userRole === 'ADMIN' && <Sparkles className="h-3 w-3" />}
                          {userRole.charAt(0)}
                          {userRole.slice(1).toLowerCase()}
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-brand-slate/10" />
                  <UserNavItems role={userRole || undefined} />
                  <DropdownMenuSeparator className="bg-brand-slate/10" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-xl text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="rounded-xl font-medium text-brand-slate hover:bg-brand-cream hover:text-brand-orange"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-xl p-2 transition-colors hover:bg-brand-cream md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-brand-slate" />
            ) : (
              <Menu className="h-6 w-6 text-brand-slate" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="animate-fade-in border-t border-brand-slate/10 py-4 md:hidden">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/agents"
                className="rounded-xl px-4 py-3 text-sm font-medium text-brand-slate/70 transition-colors hover:bg-brand-cream hover:text-brand-orange"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Agents
              </Link>
              <Link
                href="/#how-it-works"
                className="rounded-xl px-4 py-3 text-sm font-medium text-brand-slate/70 transition-colors hover:bg-brand-cream hover:text-brand-orange"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/submit-agent"
                className="rounded-xl px-4 py-3 text-sm font-medium text-brand-orange transition-colors hover:bg-brand-cream hover:text-brand-orange/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become a Seller
              </Link>

              {user && userRole && (
                <>
                  <div className="mt-2 border-t border-brand-slate/10 pt-2">
                    <div className="px-4 py-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${getRoleBadgeStyle()}`}
                      >
                        {userRole === 'ADMIN' && <Sparkles className="h-3 w-3" />}
                        {userRole.charAt(0)}
                        {userRole.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <MobileNavItems
                      role={userRole || undefined}
                      onNavigate={() => setMobileMenuOpen(false)}
                    />
                  </div>
                </>
              )}

              <div className="mt-2 flex flex-col space-y-2 border-t border-brand-slate/10 pt-4">
                {user ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl text-red-600 hover:bg-red-50 hover:text-red-600"
                    onClick={handleSignOut}
                  >
                    Log out
                  </Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full rounded-xl font-medium hover:bg-brand-cream hover:text-brand-orange"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl bg-brand-orange font-semibold text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  )
}
