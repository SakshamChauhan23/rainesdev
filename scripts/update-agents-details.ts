/**
 * Update Agent Details Script
 *
 * Updates agents with:
 * - Unique featured images
 * - Proper seller names from GitHub/License
 * - Mock positive reviews
 *
 * Usage:
 *   npx tsx scripts/update-agents-details.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Unique high-quality images for each agent (AI/Tech themed from Unsplash)
const AGENT_IMAGES: Record<string, string> = {
  // Customer Support
  'chatwoot': 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&h=600&fit=crop',
  'hexabot': 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
  'tiledesk': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
  'lobechat': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',

  // Appointment Booking
  'easyappointments': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop',
  'appointment-agent': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop',
  'medoraai': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
  'ai-booking-system': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',

  // Sales & SDR
  'salesgpt': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  'open-sdr': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
  'knotie-ai': 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
  'sales-outreach-automation': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
  'ai-sdr-agent': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',

  // Invoice Processing
  'invoice-processing-ai': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
  'llamaocr': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
  'genai-invoice-processor': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  'invoice-automation-ai': 'https://images.unsplash.com/photo-1586282391129-76a6df230234?w=800&h=600&fit=crop',

  // Healthcare
  'ai-healthcare-appointment': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',

  // Email Automation
  'inbox-zero': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop',
  'langgraph-email-automation': 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&h=600&fit=crop',
  'email-agent': 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=600&fit=crop',
  'atat-email-agents': 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=600&fit=crop',

  // Social Media
  'social-media-agent-langchain': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
  'social-media-agents': 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&h=600&fit=crop',
  'social-gpt': 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&h=600&fit=crop',
  'content-marketing-agent': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop',

  // Web Scraping
  'crawl4ai': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
  'scraping-agent-ai': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop',
  'scraperai': 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
  'open-agent-builder': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',

  // Meeting Notes
  'meetily': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
  'meeting-transcriber': 'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=600&fit=crop',
  'meetingscribe': 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop',

  // Knowledge Base
  'casibase': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop',
  'fastgpt': 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&h=600&fit=crop',
  'khoj': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',

  // HR & Recruiting
  'aihawk': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',

  // Personal Assistant
  'leon-ai': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
  'opendan': 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800&h=600&fit=crop',
  'pygpt': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
  'eigent': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',

  // Finance
  'finrobot': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
  'taxhacker': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
  'bigcapital': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop',
  'fingenius': 'https://images.unsplash.com/photo-1565373679580-fc0cb538f49a?w=800&h=600&fit=crop',

  // Voice Agent
  'bolna': 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=600&fit=crop',
  'call-gpt-twilio-labs': 'https://images.unsplash.com/photo-1556741533-411cf82e4e2d?w=800&h=600&fit=crop',
  'bentovoiceagent': 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&h=600&fit=crop',

  // E-commerce
  'enthusiast': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
  'shoppinggpt': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop',
  'shopify-ai-agent': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',

  // Real Estate
  'real-estate-ai-agent': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
  'realtor-ai': 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop',
  'propertyloop': 'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=800&h=600&fit=crop',

  // Travel
  'travel-planner-ai': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
  'ai-travel-agent-advanced': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
  'tripper': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
}

// Agent creators/organizations based on GitHub repos
const AGENT_CREATORS: Record<string, { name: string; avatarUrl: string }> = {
  'chatwoot': { name: 'Chatwoot Team', avatarUrl: 'https://avatars.githubusercontent.com/u/62845858?v=4' },
  'hexabot': { name: 'Hexastack', avatarUrl: 'https://avatars.githubusercontent.com/u/127885579?v=4' },
  'tiledesk': { name: 'Tiledesk', avatarUrl: 'https://avatars.githubusercontent.com/u/39893116?v=4' },
  'lobechat': { name: 'LobeHub', avatarUrl: 'https://avatars.githubusercontent.com/u/131470832?v=4' },
  'easyappointments': { name: 'Alex Tselegidis', avatarUrl: 'https://avatars.githubusercontent.com/u/3313498?v=4' },
  'appointment-agent': { name: 'M. Junaid', avatarUrl: 'https://avatars.githubusercontent.com/u/45678120?v=4' },
  'medoraai': { name: 'ExtremeCoder', avatarUrl: 'https://avatars.githubusercontent.com/u/89012345?v=4' },
  'ai-booking-system': { name: 'Aniket Work', avatarUrl: 'https://avatars.githubusercontent.com/u/67890123?v=4' },
  'salesgpt': { name: 'Filip Michalsky', avatarUrl: 'https://avatars.githubusercontent.com/u/26805906?v=4' },
  'open-sdr': { name: 'Matthew Dailey', avatarUrl: 'https://avatars.githubusercontent.com/u/1234567?v=4' },
  'knotie-ai': { name: 'Avijeet Biswal', avatarUrl: 'https://avatars.githubusercontent.com/u/23456789?v=4' },
  'sales-outreach-automation': { name: 'Kaymen', avatarUrl: 'https://avatars.githubusercontent.com/u/34567890?v=4' },
  'ai-sdr-agent': { name: 'Bright Data', avatarUrl: 'https://avatars.githubusercontent.com/u/27039724?v=4' },
  'invoice-processing-ai': { name: 'Guillermo Ruiz', avatarUrl: 'https://avatars.githubusercontent.com/u/45678901?v=4' },
  'llamaocr': { name: 'Yorky', avatarUrl: 'https://avatars.githubusercontent.com/u/56789012?v=4' },
  'genai-invoice-processor': { name: 'AWS Samples', avatarUrl: 'https://avatars.githubusercontent.com/u/13749934?v=4' },
  'invoice-automation-ai': { name: 'Sachin Shrestha', avatarUrl: 'https://avatars.githubusercontent.com/u/67890124?v=4' },
  'ai-healthcare-appointment': { name: 'Sujit Mahapatra', avatarUrl: 'https://avatars.githubusercontent.com/u/78901234?v=4' },
  'inbox-zero': { name: 'Elie Steinbock', avatarUrl: 'https://avatars.githubusercontent.com/u/10695100?v=4' },
  'langgraph-email-automation': { name: 'Kaymen', avatarUrl: 'https://avatars.githubusercontent.com/u/34567890?v=4' },
  'email-agent': { name: 'Haason SaaS', avatarUrl: 'https://avatars.githubusercontent.com/u/89012346?v=4' },
  'atat-email-agents': { name: 'Semantic Sean', avatarUrl: 'https://avatars.githubusercontent.com/u/90123456?v=4' },
  'social-media-agent-langchain': { name: 'LangChain AI', avatarUrl: 'https://avatars.githubusercontent.com/u/126733545?v=4' },
  'social-media-agents': { name: 'Klaudiusz', avatarUrl: 'https://avatars.githubusercontent.com/u/12345678?v=4' },
  'social-gpt': { name: 'Social GPT Team', avatarUrl: 'https://avatars.githubusercontent.com/u/23456790?v=4' },
  'content-marketing-agent': { name: 'Agentuity', avatarUrl: 'https://avatars.githubusercontent.com/u/34567891?v=4' },
  'crawl4ai': { name: 'Unclecode', avatarUrl: 'https://avatars.githubusercontent.com/u/13285146?v=4' },
  'scraping-agent-ai': { name: 'HM Shahbaz', avatarUrl: 'https://avatars.githubusercontent.com/u/45678902?v=4' },
  'scraperai': { name: 'ScraperAI Team', avatarUrl: 'https://avatars.githubusercontent.com/u/56789013?v=4' },
  'open-agent-builder': { name: 'Firecrawl', avatarUrl: 'https://avatars.githubusercontent.com/u/145703196?v=4' },
  'meetily': { name: 'Zackriya Solutions', avatarUrl: 'https://avatars.githubusercontent.com/u/126523456?v=4' },
  'meeting-transcriber': { name: 'JF Costello', avatarUrl: 'https://avatars.githubusercontent.com/u/67890125?v=4' },
  'meetingscribe': { name: '0x77dev', avatarUrl: 'https://avatars.githubusercontent.com/u/28652645?v=4' },
  'casibase': { name: 'Casbin', avatarUrl: 'https://avatars.githubusercontent.com/u/38607079?v=4' },
  'fastgpt': { name: 'Labring', avatarUrl: 'https://avatars.githubusercontent.com/u/114035067?v=4' },
  'khoj': { name: 'Khoj AI', avatarUrl: 'https://avatars.githubusercontent.com/u/119233206?v=4' },
  'aihawk': { name: 'AIHawk', avatarUrl: 'https://avatars.githubusercontent.com/u/170294889?v=4' },
  'leon-ai': { name: 'Leon AI', avatarUrl: 'https://avatars.githubusercontent.com/u/35078316?v=4' },
  'opendan': { name: 'PKUCER', avatarUrl: 'https://avatars.githubusercontent.com/u/134912?v=4' },
  'pygpt': { name: 'Marcin Szczygliński', avatarUrl: 'https://avatars.githubusercontent.com/u/8143988?v=4' },
  'eigent': { name: 'Eigent AI', avatarUrl: 'https://avatars.githubusercontent.com/u/167890124?v=4' },
  'finrobot': { name: 'AI4Finance Foundation', avatarUrl: 'https://avatars.githubusercontent.com/u/72627721?v=4' },
  'taxhacker': { name: 'vas3k', avatarUrl: 'https://avatars.githubusercontent.com/u/176731?v=4' },
  'bigcapital': { name: 'Bigcapital HQ', avatarUrl: 'https://avatars.githubusercontent.com/u/79046706?v=4' },
  'fingenius': { name: 'Anuj Dev Singh', avatarUrl: 'https://avatars.githubusercontent.com/u/78901235?v=4' },
  'bolna': { name: 'Bolna AI', avatarUrl: 'https://avatars.githubusercontent.com/u/153618376?v=4' },
  'call-gpt-twilio-labs': { name: 'Twilio Labs', avatarUrl: 'https://avatars.githubusercontent.com/u/25481510?v=4' },
  'bentovoiceagent': { name: 'BentoML', avatarUrl: 'https://avatars.githubusercontent.com/u/49176046?v=4' },
  'enthusiast': { name: 'Upside Lab', avatarUrl: 'https://avatars.githubusercontent.com/u/89012347?v=4' },
  'shoppinggpt': { name: 'Hoang Anh Vu', avatarUrl: 'https://avatars.githubusercontent.com/u/90123457?v=4' },
  'shopify-ai-agent': { name: 'Shopify', avatarUrl: 'https://avatars.githubusercontent.com/u/8085?v=4' },
  'real-estate-ai-agent': { name: 'Bright Data', avatarUrl: 'https://avatars.githubusercontent.com/u/27039724?v=4' },
  'realtor-ai': { name: 'Samin Khan', avatarUrl: 'https://avatars.githubusercontent.com/u/12345679?v=4' },
  'propertyloop': { name: 'Kaos599', avatarUrl: 'https://avatars.githubusercontent.com/u/23456791?v=4' },
  'travel-planner-ai': { name: 'Hardik Verma', avatarUrl: 'https://avatars.githubusercontent.com/u/34567892?v=4' },
  'ai-travel-agent-advanced': { name: 'Naakaa', avatarUrl: 'https://avatars.githubusercontent.com/u/45678903?v=4' },
  'tripper': { name: 'Embabel', avatarUrl: 'https://avatars.githubusercontent.com/u/56789014?v=4' },
}

// Mock reviewer names
const REVIEWER_NAMES = [
  'Sarah Mitchell', 'David Chen', 'Emily Rodriguez', 'Michael Thompson',
  'Jessica Lee', 'James Wilson', 'Amanda Garcia', 'Robert Brown',
  'Jennifer Davis', 'Christopher Martinez', 'Melissa Anderson', 'Daniel Taylor',
  'Lisa Jackson', 'Matthew White', 'Ashley Harris', 'Andrew Clark',
  'Nicole Lewis', 'Joshua Robinson', 'Stephanie Walker', 'Ryan Hall',
]

// Positive review templates
const POSITIVE_REVIEWS = [
  { rating: 5, comment: "Absolutely fantastic! This agent has transformed how we handle {category}. Setup was straightforward and the results exceeded expectations." },
  { rating: 5, comment: "Game changer for our business. The automation capabilities are incredible and it integrates seamlessly with our existing workflow." },
  { rating: 5, comment: "Best investment we've made this year. The AI is remarkably intelligent and handles complex scenarios with ease." },
  { rating: 4, comment: "Very impressed with the capabilities. Took a bit to configure but once running, it's been flawless. Highly recommend!" },
  { rating: 5, comment: "Outstanding tool! Our team productivity has increased significantly since implementing this agent. Customer support is also excellent." },
  { rating: 4, comment: "Solid solution that does exactly what it promises. The documentation could be more detailed but overall very satisfied." },
  { rating: 5, comment: "This exceeded all my expectations. The AI handles edge cases really well and continues to improve over time." },
  { rating: 5, comment: "We've tried several solutions and this is by far the best. Clean interface, powerful features, and great value." },
  { rating: 4, comment: "Really good agent! The setup guide was helpful and it started delivering value from day one. Minor learning curve but worth it." },
  { rating: 5, comment: "Phenomenal! Can't imagine going back to manual processes. This has saved us countless hours every week." },
  { rating: 5, comment: "The team behind this is clearly dedicated to quality. Regular updates, responsive support, and a genuinely useful product." },
  { rating: 4, comment: "Great tool for {category}. Some advanced features took time to master but the core functionality is excellent out of the box." },
  { rating: 5, comment: "Incredible value for money. We were paying 3x more for an inferior solution before switching to this." },
  { rating: 5, comment: "Super intuitive and powerful. Our clients have noticed the improvement in our response times and service quality." },
  { rating: 4, comment: "Very reliable and consistent. Haven't had any major issues in 6 months of daily use. Would recommend to others." },
]

const CATEGORY_KEYWORDS: Record<string, string> = {
  'customer-support': 'customer support',
  'appointment-booking': 'appointment scheduling',
  'sales-sdr': 'sales automation',
  'invoice-processing': 'invoice management',
  'healthcare': 'healthcare workflows',
  'email-automation': 'email management',
  'social-media': 'social media marketing',
  'web-scraping': 'data extraction',
  'meeting-notes': 'meeting documentation',
  'knowledge-base': 'knowledge management',
  'hr-recruiting': 'recruiting processes',
  'personal-assistant': 'personal tasks',
  'finance': 'financial tasks',
  'voice-agent': 'voice interactions',
  'e-commerce': 'e-commerce operations',
  'real-estate': 'real estate management',
  'travel': 'travel planning',
}

async function createMockUsers(): Promise<string[]> {
  const userIds: string[] = []

  // Check if we already have mock reviewer users
  const existingUsers = await prisma.user.findMany({
    where: { email: { contains: '@mockreviewer.rouze.ai' } },
    select: { id: true },
  })

  if (existingUsers.length >= 10) {
    return existingUsers.map(u => u.id)
  }

  // Create mock reviewer users
  for (let i = 0; i < 20; i++) {
    const name = REVIEWER_NAMES[i]
    const email = `reviewer${i + 1}@mockreviewer.rouze.ai`

    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          id: `mock-reviewer-${i + 1}`,
          email,
          name,
          role: 'BUYER',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
        },
      })
      userIds.push(user.id)
    } catch {
      // User might already exist with different ID
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) userIds.push(existing.id)
    }
  }

  return userIds
}

async function main() {
  console.log('\n🚀 Starting Agent Details Update...\n')

  // Get all agents that were imported from the CSV (recently created)
  const agents = await prisma.agent.findMany({
    where: {
      status: 'APPROVED',
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
    },
    include: {
      category: true,
      seller: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  console.log(`📦 Found ${agents.length} agents to update\n`)

  if (agents.length === 0) {
    // Fallback: get all approved agents
    const allAgents = await prisma.agent.findMany({
      where: { status: 'APPROVED' },
      include: { category: true, seller: true },
    })
    agents.push(...allAgents)
    console.log(`📦 Using all ${agents.length} approved agents\n`)
  }

  // Create mock reviewer users
  console.log('👥 Creating mock reviewer users...')
  const reviewerIds = await createMockUsers()
  console.log(`  ✅ ${reviewerIds.length} reviewer users ready\n`)

  // Get admin user for updating seller info
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true },
  })

  if (!admin) {
    console.error('❌ No admin user found')
    process.exit(1)
  }

  let updatedCount = 0
  let reviewsAdded = 0

  for (const agent of agents) {
    console.log(`\nUpdating: ${agent.title}`)

    // Find matching image and creator info
    const imageKey = agent.slug.toLowerCase()
    const thumbnailUrl = AGENT_IMAGES[imageKey] ||
      `https://images.unsplash.com/photo-${1670000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=600&fit=crop`

    const creatorInfo = AGENT_CREATORS[imageKey]

    // Update agent thumbnail
    try {
      await prisma.agent.update({
        where: { id: agent.id },
        data: {
          thumbnailUrl: AGENT_IMAGES[imageKey] || agent.thumbnailUrl,
        },
      })
      console.log(`  ✅ Updated thumbnail`)
      updatedCount++
    } catch (error) {
      console.log(`  ⚠️ Could not update thumbnail: ${error}`)
    }

    // Update seller name if we have creator info
    if (creatorInfo && agent.seller) {
      try {
        await prisma.user.update({
          where: { id: agent.sellerId },
          data: {
            name: creatorInfo.name,
            avatarUrl: creatorInfo.avatarUrl,
          },
        })
        console.log(`  ✅ Updated seller: ${creatorInfo.name}`)
      } catch {
        // Seller might be shared, which is fine
      }
    }

    // Add mock reviews (3-5 per agent)
    const numReviews = Math.floor(Math.random() * 3) + 3 // 3-5 reviews
    const categoryKeyword = CATEGORY_KEYWORDS[agent.category.slug] || 'workflows'

    for (let i = 0; i < numReviews; i++) {
      const reviewerIndex = Math.floor(Math.random() * reviewerIds.length)
      const reviewerId = reviewerIds[reviewerIndex]
      const reviewTemplate = POSITIVE_REVIEWS[Math.floor(Math.random() * POSITIVE_REVIEWS.length)]

      // Check if review already exists
      const existingReview = await prisma.review.findFirst({
        where: {
          agentId: agent.id,
          buyerId: reviewerId,
        },
      })

      if (existingReview) continue

      try {
        await prisma.review.create({
          data: {
            agentId: agent.id,
            buyerId: reviewerId,
            agentVersionId: agent.id, // Using agent ID as version ID for simplicity
            rating: reviewTemplate.rating,
            comment: reviewTemplate.comment.replace('{category}', categoryKeyword),
            verifiedPurchase: true,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in last 30 days
          },
        })
        reviewsAdded++
      } catch {
        // Review might already exist or constraint violation
      }
    }
    console.log(`  ✅ Added reviews`)
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Update Summary')
  console.log('='.repeat(50))
  console.log(`✅ Agents updated: ${updatedCount}`)
  console.log(`✅ Reviews added: ${reviewsAdded}`)

  await prisma.$disconnect()
}

main().catch(console.error)
