'use client'
import { logger } from '@/lib/logger'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice } from '@/lib/utils'
import { Clock, CheckCircle2, Sparkles, Phone } from 'lucide-react'
import Link from 'next/link'
import { Decimal } from '@prisma/client/runtime/library'

interface SetupRequest {
  id: string
  setupCost: Decimal
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  complexity: 'QUICK' | 'STANDARD' | 'COMPLEX' | null
  adminNotes: string | null
  bookCallRequested: boolean
  callStatus: 'PENDING' | 'SCHEDULED' | 'COMPLETED'
  createdAt: Date
  completedAt: Date | null
  buyer: {
    id: string
    name: string | null
    email: string
  }
  agent: {
    id: string
    title: string
    slug: string
  }
  purchase: {
    id: string
    purchasedAt: Date
  }
}

interface SetupRequestsTableProps {
  initialRequests: SetupRequest[]
}

export function SetupRequestsTable({ initialRequests }: SetupRequestsTableProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})

  const updateRequest = async (
    requestId: string,
    updates: {
      status?: string
      complexity?: string | null
      adminNotes?: string
      callStatus?: string
    }
  ) => {
    setLoadingStates(prev => ({ ...prev, [requestId]: true }))

    try {
      const response = await fetch(`/api/admin/setup-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update setup request')
      }

      const { setupRequest } = await response.json()

      setRequests(prev => prev.map(req => (req.id === requestId ? setupRequest : req)))

      // Clear editing state for this request
      setEditingNotes(prev => {
        const newNotes = { ...prev }
        delete newNotes[requestId]
        return newNotes
      })
    } catch (error) {
      logger.error('Error updating setup request:', error)
      alert('Failed to update setup request')
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: false }))
    }
  }

  const handleComplexityChange = (requestId: string, complexity: string) => {
    updateRequest(requestId, { complexity: complexity === 'none' ? null : complexity })
  }

  const handleMarkComplete = (requestId: string) => {
    if (confirm('Mark this setup request as completed?')) {
      updateRequest(requestId, { status: 'COMPLETED' })
    }
  }

  const handleMarkInProgress = (requestId: string) => {
    updateRequest(requestId, { status: 'IN_PROGRESS' })
  }

  const handleCallStatusChange = (requestId: string, callStatus: string) => {
    updateRequest(requestId, { callStatus })
  }

  const handleSaveNotes = (requestId: string) => {
    const notes = editingNotes[requestId]
    updateRequest(requestId, { adminNotes: notes })
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING')
  const inProgressRequests = requests.filter(r => r.status === 'IN_PROGRESS')
  const completedRequests = requests.filter(r => r.status === 'COMPLETED')

  return (
    <div className="space-y-8">
      {/* Pending Requests */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Pending ({pendingRequests.length})
          </h2>
        </div>

        {pendingRequests.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No pending setup requests</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(request => (
              <Card key={request.id} className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-brand-orange" />
                        <Link
                          href={`/agents/${request.agent.slug}`}
                          className="text-lg font-semibold text-gray-900 transition-colors hover:text-brand-orange"
                        >
                          {request.agent.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Buyer: {request.buyer.name || request.buyer.email}</p>
                        <p>
                          Purchased: {new Date(request.purchase.purchasedAt).toLocaleDateString()}
                        </p>
                        <p>
                          Setup Cost:{' '}
                          {Number(request.setupCost) === 0
                            ? 'Free'
                            : formatPrice(Number(request.setupCost))}
                        </p>
                      </div>
                    </div>

                    <Badge className="border-brand-orange/30 bg-orange-100 text-orange-700">
                      Pending
                    </Badge>
                  </div>

                  {/* Complexity Selector */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Complexity
                    </label>
                    <Select
                      value={request.complexity || 'none'}
                      onValueChange={value => handleComplexityChange(request.id, value)}
                      disabled={loadingStates[request.id]}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not set</SelectItem>
                        <SelectItem value="QUICK">⚡ Quick (under 30 min)</SelectItem>
                        <SelectItem value="STANDARD">⏱️ Standard (30-60 min)</SelectItem>
                        <SelectItem value="COMPLEX">🔧 Complex (1+ hour)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Call Status - Only show if buyer requested book call */}
                  {request.bookCallRequested && (
                    <div className="rounded-lg border-2 border-orange-200 bg-brand-orange/5 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Phone className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-900">Book a Call Requested</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Call Status:</label>
                        <Select
                          value={request.callStatus}
                          onValueChange={value => handleCallStatusChange(request.id, value)}
                          disabled={loadingStates[request.id]}
                        >
                          <SelectTrigger className="w-48 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">⏳ Pending</SelectItem>
                            <SelectItem value="SCHEDULED">📅 Scheduled</SelectItem>
                            <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="mt-2 text-xs text-gray-600">
                        Buyer can book via: https://calendar.app.google/QyuK9XKQ52r6dNPD6
                      </p>
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Admin Notes
                    </label>
                    <Textarea
                      placeholder="Add notes about the setup process..."
                      className="min-h-[80px]"
                      value={editingNotes[request.id] ?? request.adminNotes ?? ''}
                      onChange={e =>
                        setEditingNotes(prev => ({
                          ...prev,
                          [request.id]: e.target.value,
                        }))
                      }
                      disabled={loadingStates[request.id]}
                    />
                    {editingNotes[request.id] !== undefined &&
                      editingNotes[request.id] !== (request.adminNotes ?? '') && (
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => handleSaveNotes(request.id)}
                          disabled={loadingStates[request.id]}
                        >
                          Save Notes
                        </Button>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleMarkInProgress(request.id)}
                      disabled={loadingStates[request.id]}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Mark as In Progress
                    </Button>
                    <Button
                      onClick={() => handleMarkComplete(request.id)}
                      disabled={loadingStates[request.id]}
                      className="bg-brand-orange hover:bg-brand-orange"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* In Progress Requests */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            In Progress ({inProgressRequests.length})
          </h2>
        </div>

        {inProgressRequests.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No setup requests in progress</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {inProgressRequests.map(request => (
              <Card key={request.id} className="border-blue-200 bg-blue-50 p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <Link
                          href={`/agents/${request.agent.slug}`}
                          className="text-lg font-semibold text-gray-900 transition-colors hover:text-brand-orange"
                        >
                          {request.agent.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Buyer: {request.buyer.name || request.buyer.email}</p>
                        <p>
                          Purchased: {new Date(request.purchase.purchasedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Badge className="border-blue-300 bg-blue-100 text-blue-700">In Progress</Badge>
                  </div>

                  {/* Call Status - Only show if buyer requested book call */}
                  {request.bookCallRequested && (
                    <div className="rounded-lg border-2 border-orange-200 bg-white p-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">Call Status:</span>
                        <Badge
                          variant={
                            request.callStatus === 'COMPLETED'
                              ? 'default'
                              : request.callStatus === 'SCHEDULED'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {request.callStatus === 'PENDING' && '⏳ Pending'}
                          {request.callStatus === 'SCHEDULED' && '📅 Scheduled'}
                          {request.callStatus === 'COMPLETED' && '✅ Completed'}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {request.adminNotes && (
                    <div className="rounded-lg border bg-white p-3">
                      <p className="text-sm text-gray-700">{request.adminNotes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleMarkComplete(request.id)}
                      disabled={loadingStates[request.id]}
                      className="bg-brand-orange hover:bg-brand-orange"
                      size="sm"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Requests */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-brand-orange" />
          <h2 className="text-xl font-semibold text-gray-900">
            Completed ({completedRequests.length})
          </h2>
        </div>

        {completedRequests.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No completed setup requests yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedRequests.map(request => (
              <Card key={request.id} className="bg-gray-50 p-6">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <Link
                          href={`/agents/${request.agent.slug}`}
                          className="text-lg font-semibold text-gray-900 transition-colors hover:text-brand-orange"
                        >
                          {request.agent.title}
                        </Link>
                        {request.complexity && (
                          <Badge variant="outline" className="text-xs">
                            {request.complexity === 'QUICK' && '⚡ Quick'}
                            {request.complexity === 'STANDARD' && '⏱️ Standard'}
                            {request.complexity === 'COMPLEX' && '🔧 Complex'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Buyer: {request.buyer.name || request.buyer.email}</p>
                        <p>
                          Completed:{' '}
                          {request.completedAt
                            ? new Date(request.completedAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <Badge className="border-brand-orange/30 bg-brand-orange/10 text-brand-orange">
                      Completed
                    </Badge>
                  </div>

                  {/* Admin Notes (if any) */}
                  {request.adminNotes && (
                    <div className="mt-2 rounded-lg border bg-white p-3">
                      <p className="text-sm text-gray-700">{request.adminNotes}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
