
import { PrismaClient } from '@prisma/client';
import { slugify } from '../src/lib/utils'; // You might need to adjust import path or copy slugify function

const prisma = new PrismaClient();

async function main() {
    console.log('Creating test agent for detail page verification...');

    const sellerEmail = 'seller@example.com';
    const categorySlug = 'customer-support';

    // 1. Get Seller
    const seller = await prisma.user.findUnique({ where: { email: sellerEmail } });
    if (!seller) throw new Error('Seller not found. Run db:seed first.');

    // 2. Get Category
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) throw new Error('Category not found.');

    // 3. Create Agent
    const title = "Auto-Reply Support Agent 2.0";
    const slug = slugify(title); // auto-reply-support-agent-2.0

    const agent = await prisma.agent.upsert({
        where: { slug: slug },
        update: {},
        create: {
            sellerId: seller.id,
            categoryId: category.id,
            title: title,
            slug: slug,
            shortDescription: "Automatically drafts responses to customer support tickets using GPT-4 and your knowledge base.",
            price: 49.99,
            supportAddonPrice: 19.99,
            status: 'APPROVED',

            // Markdown Content
            workflowOverview: `
# How it works

This agent connects to your **Zendesk** or **Intercom** API. It listens for new tickets and:

1.  **Analyzes** the customer inquiry.
2.  **Searches** your attached Notion/docs for relevant answers.
3.  **Drafts** a polite, helpful response.

## Key Benefits
*   Reduces response time by 80%
*   Consistent tone of voice
*   Never misses a ticket
      `,

            useCase: `
### Perfect for SaaS Teams

If you receive 50+ tickets a day asking "How do I reset my password?" or "Where is the API key?", this agent is a life-saver.

> "It pays for itself in one day." - Early Beta User
      `,

            setupGuide: "This is locked content. You should not see this unless you purchased.",

            demoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rick Roll for testing :D
            thumbnailUrl: null
        }
    });

    console.log(`✅ Test Agent Created!`);
    console.log(`👉 Access it at: http://localhost:3000/agents/${slug}`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => await prisma.$disconnect());
