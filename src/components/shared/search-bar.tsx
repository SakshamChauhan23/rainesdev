'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
}

export function SearchBar({
  onSearch,
  placeholder = 'Search agents...',
  defaultValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value, onSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
