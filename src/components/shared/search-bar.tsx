'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = 'Search agents...',
  defaultValue = '',
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const onSearchRef = useRef(onSearch)
  const isInitialMount = useRef(true)

  // Keep ref updated
  useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  // Debounce search - only trigger on value changes after initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const timer = setTimeout(() => {
      onSearchRef.current(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className={`pl-10 ${className}`}
      />
    </div>
  )
}
