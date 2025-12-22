'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Star, CheckCircle2, Check, Copy } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface AgentHeroProps {
    title: string;
    shortDescription: string;
    price: number;
    category: { name: string; slug: string };
    viewCount: number;
    purchaseCount: number;
    agentId: string;
    agentSlug: string;
    isPurchased: boolean;
    isApproved: boolean;
}

export function AgentHero({ title, shortDescription, price, category, viewCount, purchaseCount, agentId, agentSlug, isPurchased, isApproved }: AgentHeroProps) {
    const [copied, setCopied] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/agents/${agentSlug}` : '';

    const handleShare = () => {
        setShareDialogOpen(true);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setShareDialogOpen(false);
            }, 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-gray-300 pb-8 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                    <Link href={`/agents?category=${category.slug}`}>
                        <Badge variant="secondary" className="mb-2 bg-gray-100 font-light text-gray-600 transition-colors hover:bg-[#8DEC42]/10 hover:text-[#8DEC42]">
                            {category.name}
                        </Badge>
                    </Link>
                    <h1 className="text-3xl font-light tracking-tight text-black sm:text-4xl">
                        {title}
                    </h1>
                    <p className="max-w-2xl text-lg font-light text-gray-700">
                        {shortDescription}
                    </p>
                    <div className="flex items-center gap-4 text-sm font-light text-gray-600">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-normal text-black">New</span>
                        </div>
                        <span>•</span>
                        <span>{viewCount} views</span>
                        <span>•</span>
                        <span>{purchaseCount} purchases</span>
                    </div>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col md:items-end">
                    <div className="text-3xl font-normal text-black">
                        {formatPrice(price)}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="border-gray-300 text-gray-600 hover:border-[#8DEC42] hover:bg-[#8DEC42]/10 hover:text-[#8DEC42]" onClick={handleShare} title="Share this agent">
                            {copied ? (
                                <Check className="h-4 w-4 text-green-600" />
                            ) : (
                                <Share2 className="h-4 w-4" />
                            )}
                        </Button>
                        {isPurchased ? (
                            <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700" disabled>
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                Already Unlocked
                            </Button>
                        ) : isApproved ? (
                            <Link href={`/checkout/${agentId}`}>
                                <Button size="lg" className="w-full sm:w-auto bg-[#8DEC42] font-normal hover:bg-[#7ACC3B]">
                                    Unlock Setup Guide
                                </Button>
                            </Link>
                        ) : (
                            <Button size="lg" className="w-full sm:w-auto bg-[#D1D5DB] text-gray-600" disabled>
                                Not Available
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Share Dialog */}
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share this agent</DialogTitle>
                        <DialogDescription>
                            Copy the link below to share this agent with others
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                        <Input
                            value={shareUrl}
                            readOnly
                            className="flex-1"
                        />
                        <Button onClick={copyToClipboard} size="icon">
                            {copied ? (
                                <Check className="h-4 w-4 text-green-600" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    {copied && (
                        <p className="text-sm text-green-600">Link copied to clipboard!</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
