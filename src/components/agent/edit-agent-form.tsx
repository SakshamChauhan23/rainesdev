'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { updateAgent, UpdateAgentState } from '@/app/dashboard/agents/[id]/edit/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import type { Agent } from '@prisma/client'
import { SubmitConfirmationDialog } from './submit-confirmation-dialog'

const initialState: UpdateAgentState = {
    message: '',
}

function SaveButton({ isReadOnly }: { isReadOnly: boolean }) {
    const { pending } = useFormStatus()

    if (isReadOnly) {
        return (
            <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        )
    }

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Saving...' : 'Save Changes'}
        </Button>
    )
}

interface EditAgentFormProps {
    agent: Agent & { category: { id: string; name: string } }
    categories: { id: string; name: string }[]
    isReadOnly: boolean
}

export function EditAgentForm({ agent, categories, isReadOnly }: EditAgentFormProps) {
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

    // @ts-ignore - Types for useFormState can be tricky
    const [state, formAction] = useFormState(
        updateAgent.bind(null, agent.id),
        initialState
    )

    return (
        <form action={formAction}>
            <Card>
                <CardContent className="space-y-6 pt-6">
                    {state.message && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <span>{state.message}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Agent Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g., Customer Support Bot Pro"
                            defaultValue={agent.title}
                            required
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug (Cannot be changed)</Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={agent.slug}
                            disabled
                            className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">
                            The URL slug cannot be changed after creation
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            defaultValue={agent.categoryId}
                            disabled={isReadOnly}
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="49.99"
                            defaultValue={Number(agent.price)}
                            required
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">Short Description</Label>
                        <Textarea
                            id="shortDescription"
                            name="shortDescription"
                            placeholder="Brief summary shown on cards..."
                            defaultValue={agent.shortDescription}
                            required
                            maxLength={200}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="workflowOverview">Workflow Overview (Markdown supported)</Label>
                        <Textarea
                            id="workflowOverview"
                            name="workflowOverview"
                            className="min-h-[150px]"
                            placeholder="# How it works..."
                            defaultValue={agent.workflowOverview}
                            required
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="useCase">Use Case</Label>
                        <Textarea
                            id="useCase"
                            name="useCase"
                            className="min-h-[100px]"
                            placeholder="Best for SaaS companies..."
                            defaultValue={agent.useCase}
                            required
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="demoVideoUrl">Demo Video URL (YouTube/Loom)</Label>
                        <Input
                            id="demoVideoUrl"
                            name="demoVideoUrl"
                            placeholder="https://youtube.com/..."
                            defaultValue={agent.demoVideoUrl || ''}
                            disabled={isReadOnly}
                        />
                    </div>

                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-6">
                    <div className="flex w-full gap-3">
                        <SaveButton isReadOnly={isReadOnly} />

                        {(agent.status === 'DRAFT' || agent.status === 'REJECTED') && !isReadOnly && (
                            <Button
                                type="button"
                                onClick={() => setSubmitDialogOpen(true)}
                                variant="default"
                                className="w-full"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                {agent.status === 'REJECTED' ? 'Resubmit for Review' : 'Submit for Review'}
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>

            <SubmitConfirmationDialog
                agentId={agent.id}
                agentTitle={agent.title}
                isOpen={submitDialogOpen}
                onClose={() => setSubmitDialogOpen(false)}
            />
        </form>
    )
}
