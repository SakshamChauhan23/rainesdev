'use client'

import Link from 'next/link'
import { Package, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function UserNavItems({ role }: { role?: 'BUYER' | 'SELLER' | 'ADMIN' }) {
  if (!role) return null

  return (
    <>
      {/* Buyers can see their library */}
      <DropdownMenuItem asChild>
        <Link href="/library">
          <Package className="mr-2 h-4 w-4" />
          My Library
        </Link>
      </DropdownMenuItem>

      {/* Sellers can see dashboard AND library (they can buy too) */}
      {(role === 'SELLER' || role === 'ADMIN') && (
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Seller Dashboard
          </Link>
        </DropdownMenuItem>
      )}

      {/* Admins can see admin panel */}
      {role === 'ADMIN' && (
        <DropdownMenuItem asChild>
          <Link href="/admin">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Admin Panel
          </Link>
        </DropdownMenuItem>
      )}
    </>
  )
}

export function MobileNavItems({
  role,
  onNavigate,
}: {
  role?: 'BUYER' | 'SELLER' | 'ADMIN'
  onNavigate: () => void
}) {
  if (!role) return null

  return (
    <>
      <Link
        href="/library"
        onClick={onNavigate}
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        My Library
      </Link>

      {(role === 'SELLER' || role === 'ADMIN') && (
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Seller Dashboard
        </Link>
      )}

      {role === 'ADMIN' && (
        <Link
          href="/admin"
          onClick={onNavigate}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Admin Panel
        </Link>
      )}
    </>
  )
}
