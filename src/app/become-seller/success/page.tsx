import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ApplicationSuccessPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <Container className="max-w-2xl py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Application Submitted!</CardTitle>
          <CardDescription>Thank you for applying to become a seller</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Our team will review your application and get back to you within 24-48 hours.
            You&apos;ll receive an email notification once a decision has been made.
          </p>

          <div className="rounded-md bg-muted p-4">
            <h3 className="mb-2 font-medium">What happens next?</h3>
            <ul className="space-y-2 text-left text-sm text-muted-foreground">
              <li>• Our team reviews your application</li>
              <li>• You receive an email with the decision</li>
              <li>• If approved, you can start creating and selling agents</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/">Browse Agents</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/become-seller">Check Status</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}
