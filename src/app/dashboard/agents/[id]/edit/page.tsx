import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { EditAgentForm } from '@/components/agent/edit-agent-form'
import { VideoPlayer } from '@/components/agent/video-player'

export default async function EditAgentPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/dashboard/agents/' + id + '/edit')
  }

  // Fetch agent with relations
  const agent = await prisma.agent.findUnique({
    where: { id },
    include: {
      category: true,
      seller: true,
    },
  })

  // Verify ownership and existence
  if (!agent || agent.sellerId !== user.id) {
    redirect('/dashboard')
  }

  // Check if editable
  const isEditable = agent.status === 'DRAFT' || agent.status === 'REJECTED'

  // Fetch categories for dropdown
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <Container className="max-w-3xl py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Agent</h1>
        <p className="text-muted-foreground">
          {isEditable
            ? 'Update your agent details below.'
            : 'This agent cannot be edited in its current state.'}
        </p>
      </div>

      {agent.status === 'REJECTED' && agent.rejectionReason && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
          <p className="mb-2 font-semibold">Agent Rejected</p>
          <p className="text-sm">
            <strong>Reason:</strong> {agent.rejectionReason}
          </p>
        </div>
      )}

      {(agent.status === 'UNDER_REVIEW' || agent.status === 'APPROVED') && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">
          <p className="mb-2 font-semibold">Editing Disabled</p>
          <p className="text-sm">
            {agent.status === 'UNDER_REVIEW'
              ? 'This agent is currently under review and cannot be edited.'
              : 'This agent is live on the marketplace and cannot be edited.'}
          </p>
        </div>
      )}

      {agent.demoVideoUrl && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Current Demo Video</h2>
          <VideoPlayer url={agent.demoVideoUrl} thumbnailUrl={agent.thumbnailUrl} />
        </div>
      )}

      <EditAgentForm agent={agent} categories={categories} isReadOnly={!isEditable} />
    </Container>
  )
}
