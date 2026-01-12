
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
import { getUserWithRole } from '@/lib/user-sync';
import { ReviewSection } from '@/components/reviews/review-section';
import { AssistedSetupConfig } from '@/components/admin/assisted-setup-config';
import { AssistedSetupWrapper } from '@/components/agent/assisted-setup-wrapper';
import { SetupStatus } from '@/components/agent/setup-status';
import { BookCallCard } from '@/components/agent/book-call-card';
import { prisma } from '@/lib/prisma';
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

    // Get user role for review section
    const userWithRole = user ? await getUserWithRole(user.id) : null;

    // Check if user has an active setup request for this agent
    let setupRequest = null;
    if (user && isPurchased) {
        setupRequest = await prisma.setupRequest.findFirst({
            where: {
                buyerId: user.id,
                agentId: agent.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

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

                        {/* Setup Status - Show if purchased with assisted setup */}
                        {isPurchased && setupRequest && (
                            <SetupStatus
                                status={setupRequest.status}
                                setupCost={Number(setupRequest.setupCost)}
                                completedAt={setupRequest.completedAt}
                                adminNotes={setupRequest.adminNotes}
                            />
                        )}

                        {/* Assisted Setup Option - Show only if not purchased */}
                        {!isPurchased && agent.assistedSetupEnabled && (
                            <AssistedSetupWrapper
                                enabled={agent.assistedSetupEnabled}
                                price={Number(agent.assistedSetupPrice)}
                                agentId={agent.id}
                            />
                        )}

                        {/* Book a Call Card - Show to buyers (not admins) */}
                        {userWithRole?.role !== 'ADMIN' && userWithRole?.role !== 'SELLER' && (
                            <BookCallCard />
                        )}

                        {/* Setup Guide - Locked or Unlocked */}
                        {isPurchased ? (
                            <UnlockedSetupGuide setupGuide={agent.setupGuide} />
                        ) : (
                            <LockedSetupGuide
                                agentId={agent.id}
                                isApproved={agent.status === 'APPROVED'}
                            />
                        )}

                        {/* Reviews Section */}
                        <ReviewSection
                            agentId={agent.id}
                            userId={user?.id || null}
                            userRole={userWithRole?.role}
                        />
                    </div>

                    {/* Sidebar (Right Column) */}
                    <div className="space-y-6">
                        {/* Admin: Assisted Setup Configuration */}
                        {userWithRole?.role === 'ADMIN' && (
                            <AssistedSetupConfig
                                agentId={agent.id}
                                currentEnabled={agent.assistedSetupEnabled}
                                currentPrice={Number(agent.assistedSetupPrice)}
                            />
                        )}

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
