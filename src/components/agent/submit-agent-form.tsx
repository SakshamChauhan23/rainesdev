
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createAgent, CreateAgentState } from '@/app/submit-agent/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Category } from '@/types/category' // We might need to sync this type or import from database.types

const initialState: CreateAgentState = {
    message: '',
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Submitting...' : 'Submit Agent for Review'}
        </Button>
    )
}

interface SubmitAgentFormProps {
    categories: { id: string; name: string }[]
}

export function SubmitAgentForm({ categories }: SubmitAgentFormProps) {
    // @ts-ignore - Types for useFormState can be tricky seamlessly between server/client actions in some versions
    const [state, formAction] = useFormState(createAgent, initialState)

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
                        <Input id="title" name="title" placeholder="e.g., Customer Support Bot Pro" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="49.99" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">Short Description</Label>
                        <Textarea
                            id="shortDescription"
                            name="shortDescription"
                            placeholder="Brief summary shown on cards..."
                            required
                            maxLength={200}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="workflowOverview">Workflow Overview (Markdown supported)</Label>
                        <Textarea
                            id="workflowOverview"
                            name="workflowOverview"
                            className="min-h-[150px]"
                            placeholder="# How it works..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="useCase">Use Case</Label>
                        <Textarea
                            id="useCase"
                            name="useCase"
                            className="min-h-[100px]"
                            placeholder="Best for SaaS companies..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="demoVideoUrl">Demo Video URL (YouTube/Loom)</Label>
                        <Input id="demoVideoUrl" name="demoVideoUrl" placeholder="https://youtube.com/..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thumbnailUrl">Thumbnail Image URL</Label>
                        <Input
                            id="thumbnailUrl"
                            name="thumbnailUrl"
                            placeholder="https://example.com/image.jpg"
                            type="url"
                        />
                        <p className="text-xs text-muted-foreground">
                            Recommended: 1200x630px, JPG or PNG
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="setupGuide">
                            Setup Guide (Markdown) <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="setupGuide"
                            name="setupGuide"
                            className="min-h-[200px] font-mono text-sm"
                            placeholder="# Step 1: Installation&#10;&#10;```bash&#10;npm install your-agent&#10;```&#10;&#10;# Step 2: Configuration&#10;..."
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            This will be locked until users purchase your agent. Include detailed setup instructions.
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
