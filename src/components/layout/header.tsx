'use client'

import Link from 'next/link'
import { Container } from './container'
import { Button } from '@/components/ui/button'
import { Bot, Menu, X } from 'lucide-react'
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
        if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes
          setUserRole(role)
          return
        }
      }

      const response = await fetch(`/api/user/role?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserRole(data.role)
        // Cache the role
        localStorage.setItem(cacheKey, JSON.stringify({
          role: data.role,
          timestamp: Date.now()
        }))
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <div className="flex flex-col">
              <span className="text-xl font-bold">Neura</span>
              <span className="text-[10px] font-light text-gray-500">powered by RainesDev</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="/agents"
              className="text-sm font-normal transition-colors hover:text-[#8DEC42]"
            >
              Browse Agents
            </Link>
            <Link
              href="/agents"
              className="text-sm font-normal transition-colors hover:text-[#8DEC42]"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-sm font-normal transition-colors hover:text-[#8DEC42]"
            >
              How It Works
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {userRole && (
                        <p className="text-xs leading-none text-muted-foreground capitalize">
                          Role: {userRole.toLowerCase()}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <UserNavItems role={userRole || undefined} />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-normal">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#8DEC42] font-normal hover:bg-[#7ACC3B]">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/agents"
                className="text-sm font-normal transition-colors hover:text-[#8DEC42]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Agents
              </Link>
              <Link
                href="/agents"
                className="text-sm font-normal transition-colors hover:text-[#8DEC42]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="text-sm font-normal transition-colors hover:text-[#8DEC42]"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              
              {user && (
                <>
                  <div className="border-t pt-4">
                    <MobileNavItems role={userRole || undefined} onNavigate={() => setMobileMenuOpen(false)} />
                  </div>
                </>
              )}

              <div className="flex flex-col space-y-2 pt-4 border-t">
                {user ? (
                  <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                    Log out
                  </Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full font-normal">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#8DEC42] font-normal hover:bg-[#7ACC3B]">Get Started</Button>
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
