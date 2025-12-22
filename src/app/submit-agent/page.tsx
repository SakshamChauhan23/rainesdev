
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/layout/container'
import { SubmitAgentForm } from '@/components/agent/submit-agent-form'

export default async function SubmitAgentPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?next=/submit-agent')
    }

    // Fetch categories for the select dropdown
    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    })

    return (
        <Container className="max-w-3xl py-12">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Submit New Agent</h1>
                <p className="text-muted-foreground">
                    Fill out the details below to list your AI agent workflow.
                </p>
            </div>

            <SubmitAgentForm categories={categories} />
        </Container>
    )
}
