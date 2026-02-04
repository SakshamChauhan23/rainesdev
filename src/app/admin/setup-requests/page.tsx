import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/user-sync'
import { Container } from '@/components/layout/container'
import { SetupRequestsTable } from '@/components/admin/setup-requests-table'
import { prisma } from '@/lib/prisma'

export default async function SetupRequestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login?next=/admin/setup-requests')
  }

  const userWithRole = await getUserWithRole(user.id)

  if (!userWithRole || userWithRole.role !== 'ADMIN') {
    redirect('/')
  }

  // Fetch setup requests
  const setupRequests = await prisma.setupRequest.findMany({
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      agent: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      purchase: {
        select: {
          id: true,
          purchasedAt: true,
        },
      },
    },
    orderBy: [
      { status: 'asc' }, // PENDING first
      { createdAt: 'desc' }, // Most recent first
    ],
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Setup Requests</h1>
          <p className="mt-2 text-gray-600">
            Manage admin-assisted setup requests for agent purchases
          </p>
        </div>

        <SetupRequestsTable initialRequests={setupRequests} />
      </Container>
    </div>
  )
}
