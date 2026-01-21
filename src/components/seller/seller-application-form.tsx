'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitSellerApplication, SellerApplicationState } from '@/app/become-seller/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

const initialState: SellerApplicationState = {
  message: '',
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Application'}
    </Button>
  )
}

export function SellerApplicationForm() {
  const [state, formAction] = useFormState(submitSellerApplication, initialState)

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Seller Application</CardTitle>
          <CardDescription>
            Tell us about yourself and the agents you plan to create
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {state.message && !state.success && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          {state.success && (
            <div className="flex items-center gap-2 rounded-md bg-green-500/15 p-3 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input id="fullName" name="fullName" placeholder="Your full name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">
              Background & Experience <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="experience"
              name="experience"
              className="min-h-[120px]"
              placeholder="Tell us about your experience with AI agents, automation, or software development. What makes you qualified to create and sell agents on our platform?"
              required
            />
            <p className="text-xs text-muted-foreground">Minimum 50 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agentIdeas">
              Agent Ideas <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="agentIdeas"
              name="agentIdeas"
              className="min-h-[120px]"
              placeholder="Describe the types of AI agents you plan to create. What problems will they solve? Who is your target audience?"
              required
            />
            <p className="text-xs text-muted-foreground">Minimum 30 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relevantLinks">Relevant Links (Optional)</Label>
            <Textarea
              id="relevantLinks"
              name="relevantLinks"
              placeholder="Portfolio, GitHub, LinkedIn, or any other relevant links (one per line)"
              className="min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">
              Share links that demonstrate your work or expertise
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 p-6">
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  )
}
