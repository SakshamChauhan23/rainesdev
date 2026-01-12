'use client'

import { AssistedSetupOption } from './assisted-setup-option'

interface AssistedSetupWrapperProps {
  enabled: boolean
  price: number
  agentId: string
}

export function AssistedSetupWrapper({ enabled, price, agentId }: AssistedSetupWrapperProps) {
  const handleSelectionChange = (selected: boolean) => {
    // Store selection in session storage for checkout page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`assistedSetup_${agentId}`, selected.toString())
    }
  }

  return (
    <AssistedSetupOption
      enabled={enabled}
      price={price}
      onSelectionChange={handleSelectionChange}
    />
  )
}
