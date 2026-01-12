import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, Sparkles } from 'lucide-react'

interface SetupStatusProps {
  status: 'PENDING' | 'COMPLETED'
  setupCost: number
  completedAt: Date | null
  adminNotes: string | null
}

export function SetupStatus({ status, setupCost, completedAt, adminNotes }: SetupStatusProps) {
  const isPending = status === 'PENDING'

  return (
    <Card className={`p-6 ${isPending ? 'border-2 border-orange-300 bg-orange-50' : 'border-2 border-green-300 bg-green-50'}`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${isPending ? 'bg-orange-100' : 'bg-green-100'}`}>
          {isPending ? (
            <Clock className="h-6 w-6 text-orange-600" />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Admin-Assisted Setup
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                {setupCost === 0 ? 'Free setup included' : `Setup cost: $${setupCost.toFixed(2)}`}
              </p>
            </div>

            <Badge className={isPending ? 'bg-orange-600 text-white' : 'bg-green-600 text-white'}>
              {isPending ? 'In Progress' : 'Completed'}
            </Badge>
          </div>

          {isPending ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-800">
                <strong>Our team is working on your setup!</strong>
              </p>
              <p className="text-sm text-gray-700">
                You'll receive a notification once your agent has been configured and connected to your tools.
                We'll email you when the setup is complete.
              </p>
              <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600">
                  <strong>What we're doing:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                  <li>✓ Configuring initial agent settings</li>
                  <li>✓ Connecting your required tools</li>
                  <li>✓ Testing the setup</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-800">
                <strong>Setup completed!</strong>
              </p>
              <p className="text-sm text-gray-700">
                Your agent has been fully configured and is ready to use.
                {completedAt && ` Completed on ${new Date(completedAt).toLocaleDateString()}.`}
              </p>
              {adminNotes && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Setup Notes:</p>
                  <p className="text-xs text-gray-600">{adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
