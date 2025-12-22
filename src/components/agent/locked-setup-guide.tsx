
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';

interface LockedSetupGuideProps {
    agentId: string;
    isApproved: boolean;
}

export function LockedSetupGuide({ agentId, isApproved }: LockedSetupGuideProps) {
    return (
        <section className="relative mt-12 overflow-hidden rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="rounded-full bg-orange-100 p-4">
                    <Lock className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-normal text-gray-900">Unlock the Setup Guide</h2>
                <p className="max-w-md font-light text-gray-600">
                    Purchase this agent to get instant access to the step-by-step implementation guide, configuration files, and expert tips.
                </p>
                {isApproved ? (
                    <Link href={`/checkout/${agentId}`}>
                        <Button size="lg" className="mt-4 bg-gray-900 hover:bg-gray-800">
                            Unlock Setup Guide
                        </Button>
                    </Link>
                ) : (
                    <Button size="lg" className="mt-4 bg-gray-300 text-gray-500" disabled>
                        Not Available for Purchase
                    </Button>
                )}
            </div>

            {/* Visual noise/blur effect behind */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent opacity-80" />
        </section>
    );
}
