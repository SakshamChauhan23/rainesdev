'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface WorkflowContentProps {
    overview: string;
    useCase: string;
}

export function WorkflowContent({ overview, useCase }: WorkflowContentProps) {
    return (
        <div className="space-y-8">
            <section>
                <h2 className="mb-4 text-2xl font-light tracking-tight text-gray-900">Workflow Overview</h2>
                <div className="prose prose-neutral max-w-none prose-headings:font-normal prose-headings:text-gray-900 prose-p:font-light prose-p:text-gray-700 dark:prose-invert">
                    <ReactMarkdown>{overview}</ReactMarkdown>
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-2xl font-light tracking-tight text-gray-900">Use Cases & Benefits</h2>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                    <div className="prose prose-neutral max-w-none prose-headings:font-normal prose-headings:text-gray-900 prose-p:font-light prose-p:text-gray-700 dark:prose-invert">
                        <ReactMarkdown>{useCase}</ReactMarkdown>
                    </div>
                </div>
            </section>
        </div>
    );
}
