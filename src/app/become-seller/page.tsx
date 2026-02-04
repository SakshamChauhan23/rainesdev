import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { SellerApplicationForm } from '@/components/seller/seller-application-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function BecomeSellerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/become-seller')
  }

  // Check user's current role and application status
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      role: true,
      sellerApplication: {
        select: {
          id: true,
          status: true,
          rejectionReason: true,
          createdAt: true,
        },
      },
    },
  })

  // If already a seller or admin, redirect to dashboard
  if (dbUser?.role === 'SELLER' || dbUser?.role === 'ADMIN') {
    redirect('/dashboard')
  }

  const application = dbUser?.sellerApplication

  // Show status if application exists and is pending
  if (application?.status === 'PENDING_REVIEW') {
    return (
      <Container className="max-w-2xl py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Application Under Review</CardTitle>
            <CardDescription>Your seller application is being reviewed by our team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              We typically review applications within 24-48 hours. You&apos;ll receive an email
              notification once a decision has been made.
            </p>
            <p className="text-sm text-muted-foreground">
              Submitted on {application.createdAt.toLocaleDateString()}
            </p>
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  // Show rejection status with option to reapply
  if (application?.status === 'REJECTED') {
    return (
      <Container className="max-w-2xl py-12">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Application Not Approved</CardTitle>
            <CardDescription>
              Unfortunately, your previous application was not approved
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.rejectionReason && (
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium">Reason:</p>
                <p className="text-sm text-muted-foreground">{application.rejectionReason}</p>
              </div>
            )}
            <p className="text-center text-muted-foreground">
              You can submit a new application addressing the feedback above.
            </p>
          </CardContent>
        </Card>

        <SellerApplicationForm />
      </Container>
    )
  }

  // Show application form for new applicants
  return (
    <Container className="max-w-2xl py-12">
      <div className="mb-8 space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Become a Seller</h1>
        <p className="text-muted-foreground">
          Join our marketplace and start selling your AI agent workflows to thousands of buyers.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Quality First</h3>
          <p className="text-xs text-muted-foreground">Curated marketplace for premium agents</p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Fair Revenue</h3>
          <p className="text-xs text-muted-foreground">Competitive commission rates</p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Support</h3>
          <p className="text-xs text-muted-foreground">Dedicated seller support team</p>
        </div>
      </div>

      <SellerApplicationForm />
    </Container>
  )
}
