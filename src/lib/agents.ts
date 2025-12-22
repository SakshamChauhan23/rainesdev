
import { prisma } from './prisma';

export async function getAgentBySlug(slug: string) {
    try {
        const agent = await prisma.agent.findUnique({
            where: { slug },
            include: {
                seller: {
                    select: {
                        name: true,
                        avatarUrl: true,
                        sellerProfile: {
                            select: {
                                bio: true,
                                portfolioUrlSlug: true,
                                socialLinks: true,
                            }
                        }
                    }
                },
                category: {
                    select: {
                        name: true,
                        slug: true,
                    }
                }
            }
        });

        // Don't return approved agents with pending updates (they're being updated)
        if (agent?.status === 'APPROVED' && agent?.hasActiveUpdate) {
            return null;
        }

        return agent;
    } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
    }
}

export type GetAgentsOptions = {
    SEARCH?: string;
    CATEGORY?: string;
    PAGE?: number;
    LIMIT?: number;
};

export async function getAllAgents({
    SEARCH,
    CATEGORY,
    PAGE = 1,
    LIMIT = 12
}: GetAgentsOptions = {}) {
    try {
        const skip = (PAGE - 1) * LIMIT;

        // Build where clause
        const where: any = {
            status: 'APPROVED',
            hasActiveUpdate: false // Hide approved agents with pending updates
        };

        if (CATEGORY && CATEGORY !== 'All') {
            where.category = {
                slug: CATEGORY
            };
        }

        if (SEARCH) {
            where.OR = [
                { title: { contains: SEARCH, mode: 'insensitive' } },
                { shortDescription: { contains: SEARCH, mode: 'insensitive' } }
            ];
        }

        // Get total count and agents
        const [agents, total] = await Promise.all([
            prisma.agent.findMany({
                where,
                skip,
                take: LIMIT,
                orderBy: [
                    { featured: 'desc' },
                    { createdAt: 'desc' }
                ],
                include: {
                    seller: {
                        select: {
                            name: true,
                            avatarUrl: true,
                            sellerProfile: {
                                select: {
                                    portfolioUrlSlug: true
                                }
                            }
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            }),
            prisma.agent.count({ where })
        ]);

        return { agents, total };
    } catch (error) {
        console.error('Error fetching agents:', error);
        return { agents: [], total: 0 };
    }
}


export async function getRelatedAgents(categoryId: string, currentAgentId: string, limit = 3) {
    try {
        const agents = await prisma.agent.findMany({
            where: {
                categoryId,
                id: { not: currentAgentId },
                status: 'APPROVED',
                hasActiveUpdate: false // Hide approved agents with pending updates
            },
            take: limit,
            select: {
                title: true,
                slug: true,
                price: true,
                thumbnailUrl: true,
                seller: {
                    select: {
                        name: true,
                        avatarUrl: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return agents;
    } catch (error) {
        console.error('Error fetching related agents:', error);
        return [];
    }
}
