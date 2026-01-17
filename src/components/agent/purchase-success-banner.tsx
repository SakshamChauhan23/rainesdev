'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowDown } from 'lucide-react';

export function PurchaseSuccessBanner() {
    const scrollToSetupGuide = () => {
        const element = document.getElementById('setup-guide');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-green-900">
                            Setup guide unlocked successfully!
                        </p>
                        <p className="text-sm text-green-700">
                            You now have lifetime access to the complete setup guide
                        </p>
                    </div>
                </div>
                <Button
                    onClick={scrollToSetupGuide}
                    variant="outline"
                    className="border-green-300 bg-white hover:bg-green-100"
                >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Go to Setup Guide
                </Button>
            </CardContent>
        </Card>
    );
}
