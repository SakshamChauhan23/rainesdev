'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PurchaseConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  agentId: string
  agentTitle: string
  assistedSetupEnabled: boolean
}

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  agentId,
  agentTitle,
  assistedSetupEnabled,
}: PurchaseConfirmationModalProps) {
  const router = useRouter()
  const [assistedSetupChoice, setAssistedSetupChoice] = useState<'yes' | 'no' | null>(null)

  const handleProceedToCheckout = () => {
    // Store assisted setup choice in session storage (if enabled)
    if (assistedSetupEnabled && assistedSetupChoice === 'yes') {
      sessionStorage.setItem(`assistedSetup_${agentId}`, 'true')
    }

    onClose()
    router.push(`/checkout/${agentId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-slate">
            Ready to unlock {agentTitle}?
          </DialogTitle>
          <DialogDescription className="text-brand-slate/70">
            You&apos;re about to purchase this AI agent. Complete your purchase to get instant
            access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Admin-Assisted Setup Option - Only show if enabled by admin */}
          {assistedSetupEnabled && (
            <div className="rounded-2xl border-2 border-brand-teal/30 bg-gradient-to-br from-brand-teal/5 to-brand-teal/10 p-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-teal/10">
                  <Calendar className="h-5 w-5 text-brand-teal" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-brand-slate">
                    Do you want an Admin to assist you in setting-up this Agent?
                  </h3>
                  <p className="text-sm text-brand-slate/70">
                    Get personalized help from our admin team to configure and set up your agent
                    according to your specific needs.
                  </p>
                </div>
              </div>

              <div className="space-y-2" role="radiogroup" aria-label="Admin assistance preference">
                <button
                  onClick={() => setAssistedSetupChoice('yes')}
                  role="radio"
                  aria-checked={assistedSetupChoice === 'yes'}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    assistedSetupChoice === 'yes'
                      ? 'border-brand-teal bg-brand-teal/10'
                      : 'border-brand-slate/20 hover:border-brand-teal/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-brand-slate">
                      Yes, I need admin assistance
                    </span>
                    {assistedSetupChoice === 'yes' && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-teal" aria-hidden="true">
                        <ArrowRight className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setAssistedSetupChoice('no')}
                  role="radio"
                  aria-checked={assistedSetupChoice === 'no'}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    assistedSetupChoice === 'no'
                      ? 'border-brand-slate bg-brand-slate/5'
                      : 'border-brand-slate/20 hover:border-brand-slate/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-brand-slate">
                      No thanks, I&apos;ll set it up myself
                    </span>
                    {assistedSetupChoice === 'no' && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-slate" aria-hidden="true">
                        <ArrowRight className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Call to action */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 flex-1 rounded-xl border-brand-slate/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToCheckout}
              disabled={assistedSetupEnabled && assistedSetupChoice === null}
              className="h-12 flex-1 rounded-xl bg-brand-teal font-semibold text-white shadow-lg shadow-brand-teal/30 hover:bg-brand-teal/90"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {assistedSetupEnabled && assistedSetupChoice === 'yes' && (
            <p className="text-center text-xs text-brand-slate/60">
              Our admin team will help you set up your agent after purchase. You&apos;ll be able to
              schedule a call with them from your library.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
