'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PurchaseConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  agentId: string
  agentTitle: string
  bookCallEnabled: boolean
}

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  agentId,
  agentTitle,
  bookCallEnabled
}: PurchaseConfirmationModalProps) {
  const router = useRouter()
  const [bookingChoice, setBookingChoice] = useState<'yes' | 'no' | null>(null)

  const handleProceedToCheckout = () => {
    // Store booking choice in session storage
    if (bookCallEnabled && bookingChoice === 'yes') {
      sessionStorage.setItem(`bookCall_${agentId}`, 'true')
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
            You're about to purchase this AI agent. Complete your purchase to get instant access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Book a Call Option - Only show if enabled by seller */}
          {bookCallEnabled && (
            <div className="rounded-2xl border-2 border-brand-orange/30 bg-gradient-to-br from-brand-orange/5 to-brand-orange/10 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
                  <Calendar className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-slate mb-1">
                    Need help getting started?
                  </h3>
                  <p className="text-sm text-brand-slate/70">
                    Book a free 30-minute consultation call with our team after purchase to help you set up and configure your agent.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setBookingChoice('yes')}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    bookingChoice === 'yes'
                      ? 'border-brand-orange bg-brand-orange/10'
                      : 'border-brand-slate/20 hover:border-brand-orange/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-brand-slate">
                      Yes, I'd like to book a call
                    </span>
                    {bookingChoice === 'yes' && (
                      <div className="h-5 w-5 rounded-full bg-brand-orange flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setBookingChoice('no')}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    bookingChoice === 'no'
                      ? 'border-brand-slate bg-brand-slate/5'
                      : 'border-brand-slate/20 hover:border-brand-slate/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-brand-slate">
                      No thanks, I'll set it up myself
                    </span>
                    {bookingChoice === 'no' && (
                      <div className="h-5 w-5 rounded-full bg-brand-slate flex items-center justify-center">
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
              className="flex-1 h-12 rounded-xl border-brand-slate/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToCheckout}
              disabled={bookCallEnabled && bookingChoice === null}
              className="flex-1 h-12 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white font-semibold shadow-lg shadow-brand-teal/30"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {bookCallEnabled && bookingChoice === 'yes' && (
            <p className="text-xs text-center text-brand-slate/60">
              After completing your purchase, you'll receive an email with a link to schedule your consultation call.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
