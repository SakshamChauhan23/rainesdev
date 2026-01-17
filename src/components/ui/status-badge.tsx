import { Badge } from './badge'
import { cn } from '@/lib/utils'

type AgentStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'

interface StatusBadgeProps {
  status: AgentStatus
  className?: string
}

const statusConfig = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    className: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  APPROVED: {
    label: 'Live',
    className: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700 border-red-300',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn('border font-medium', config.className, className)}>
      {config.label}
    </Badge>
  )
}
