'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = []
  const showEllipsisStart = currentPage > 3
  const showEllipsisEnd = currentPage < totalPages - 2

  // Always show first page
  pages.push(1)

  // Show ellipsis or pages near start
  if (showEllipsisStart) {
    pages.push(-1) // -1 represents ellipsis
  } else {
    for (let i = 2; i < Math.min(currentPage, 4); i++) {
      pages.push(i)
    }
  }

  // Show current page and neighbors
  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  // Show ellipsis or pages near end
  if (showEllipsisEnd) {
    pages.push(-2) // -2 represents ellipsis
  } else {
    for (let i = Math.max(currentPage + 2, totalPages - 2); i < totalPages; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }
  }

  // Always show last page
  if (!pages.includes(totalPages)) {
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page < 0) {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          )
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      })}

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
