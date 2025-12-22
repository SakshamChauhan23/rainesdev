
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { AgentHero } from '@/components/agent/agent-hero';
import { SellerCard } from '@/components/agent/seller-card';
import { VideoPlayer } from '@/components/agent/video-player';
import { WorkflowContent } from '@/components/agent/workflow-content';
import { LockedSetupGuide } from '@/components/agent/locked-setup-guide';
import { UnlockedSetupGuide } from '@/components/agent/unlocked-setup-guide';
import { PurchaseSuccessBanner } from '@/components/agent/purchase-success-banner';
import { getAgentBySlug } from '@/lib/agents';
import { hasPurchased } from '@/lib/purchases';
import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';

interface AgentPageProps {
    params: {
        slug: string;
    };
    searchParams?: {
        unlocked?: string;
    };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
    const agent = await getAgentBySlug(params.slug);

    if (!agent) {
        return {
            title: 'Agent Not Found',
        };
    }

    return {
        title: `${agent.title} | Neura`,
        description: agent.shortDescription,
    };
}

export default async function AgentPage({ params, searchParams }: AgentPageProps) {
    const agent = await getAgentBySlug(params.slug);

    if (!agent) {
        notFound();
    }

    // Check if user is logged in and has purchased
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isPurchased = user ? await hasPurchased(user.id, agent.id) : false;
    const showSuccessBanner = searchParams?.unlocked === 'true';

    return (
        <div className="bg-white">
            <Container className="py-12 md:py-16">
                {showSuccessBanner && isPurchased && (
                    <PurchaseSuccessBanner />
                )}

                <AgentHero
                    title={agent.title}
                    shortDescription={agent.shortDescription}
                    price={Number(agent.price)}
                    category={agent.category}
                    viewCount={agent.viewCount}
                    purchaseCount={agent.purchaseCount}
                    agentId={agent.id}
                    agentSlug={agent.slug}
                    isPurchased={isPurchased}
                    isApproved={agent.status === 'APPROVED'}
                />

                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    {/* Main Content (Left Column) */}
                    <div className="space-y-8 lg:col-span-2">
                        <VideoPlayer
                            url={agent.demoVideoUrl}
                            thumbnailUrl={agent.thumbnailUrl}
                        />

                        <WorkflowContent
                            overview={agent.workflowOverview}
                            useCase={agent.useCase}
                        />

                        {/* Setup Guide - Locked or Unlocked */}
                        {isPurchased ? (
                            <UnlockedSetupGuide setupGuide={agent.setupGuide} />
                        ) : (
                            <LockedSetupGuide
                                agentId={agent.id}
                                isApproved={agent.status === 'APPROVED'}
                            />
                        )}
                    </div>

                    {/* Sidebar (Right Column) */}
                    <div className="space-y-6">
                        <SellerCard
                            name={agent.seller.name || 'Anonymous Seller'}
                            avatarUrl={agent.seller.avatarUrl}
                            bio={agent.seller.sellerProfile?.bio || null}
                            portfolioSlug={agent.seller.sellerProfile?.portfolioUrlSlug || '#'}
                            socialLinks={agent.seller.sellerProfile?.socialLinks as Record<string, string> | null}
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
}
