/**
 * Create Individual Sellers Script
 *
 * Creates unique seller users for each agent creator and reassigns agents
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Agent slug -> Creator info mapping
const AGENT_CREATORS: Record<string, { name: string; slug: string }> = {
  'chatwoot': { name: 'Chatwoot Team', slug: 'chatwoot-team' },
  'hexabot': { name: 'Hexastack', slug: 'hexastack' },
  'tiledesk': { name: 'Tiledesk', slug: 'tiledesk' },
  'lobechat': { name: 'LobeHub', slug: 'lobehub' },
  'easyappointments': { name: 'Alex Tselegidis', slug: 'alex-tselegidis' },
  'appointment-agent': { name: 'M. Junaid', slug: 'm-junaid' },
  'medoraai': { name: 'ExtremeCoder', slug: 'extremecoder' },
  'ai-booking-system': { name: 'Aniket Work', slug: 'aniket-work' },
  'salesgpt': { name: 'Filip Michalsky', slug: 'filip-michalsky' },
  'open-sdr': { name: 'Matthew Dailey', slug: 'matthew-dailey' },
  'knotie-ai': { name: 'Avijeet Biswal', slug: 'avijeet-biswal' },
  'sales-outreach-automation': { name: 'Kaymen', slug: 'kaymen' },
  'ai-sdr-agent': { name: 'Bright Data', slug: 'bright-data' },
  'invoice-processing-ai': { name: 'Guillermo Ruiz', slug: 'guillermo-ruiz' },
  'llamaocr': { name: 'Yorky', slug: 'yorky' },
  'genai-invoice-processor': { name: 'AWS Samples', slug: 'aws-samples' },
  'invoice-automation-ai': { name: 'Sachin Shrestha', slug: 'sachin-shrestha' },
  'ai-healthcare-appointment': { name: 'Sujit Mahapatra', slug: 'sujit-mahapatra' },
  'inbox-zero': { name: 'Elie Steinbock', slug: 'elie-steinbock' },
  'langgraph-email-automation': { name: 'Kaymen', slug: 'kaymen' },
  'email-agent': { name: 'Haason SaaS', slug: 'haason-saas' },
  'atat-email-agents': { name: 'Semantic Sean', slug: 'semantic-sean' },
  'social-media-agent-langchain': { name: 'LangChain AI', slug: 'langchain-ai' },
  'social-media-agents': { name: 'Klaudiusz', slug: 'klaudiusz' },
  'social-gpt': { name: 'Social GPT Team', slug: 'social-gpt' },
  'content-marketing-agent': { name: 'Agentuity', slug: 'agentuity' },
  'crawl4ai': { name: 'Unclecode', slug: 'unclecode' },
  'scraping-agent-ai': { name: 'HM Shahbaz', slug: 'hm-shahbaz' },
  'scraperai': { name: 'ScraperAI Team', slug: 'scraperai' },
  'open-agent-builder': { name: 'Firecrawl', slug: 'firecrawl' },
  'meetily': { name: 'Zackriya Solutions', slug: 'zackriya-solutions' },
  'meeting-transcriber': { name: 'JF Costello', slug: 'jf-costello' },
  'meetingscribe': { name: '0x77dev', slug: '0x77dev' },
  'casibase': { name: 'Casbin', slug: 'casbin' },
  'fastgpt': { name: 'Labring', slug: 'labring' },
  'khoj': { name: 'Khoj AI', slug: 'khoj-ai' },
  'aihawk': { name: 'AIHawk', slug: 'aihawk' },
  'leon-ai': { name: 'Leon AI', slug: 'leon-ai' },
  'opendan': { name: 'PKUCER', slug: 'pkucer' },
  'pygpt': { name: 'Marcin Szczygliński', slug: 'marcin-szczygliński' },
  'eigent': { name: 'Eigent AI', slug: 'eigent-ai' },
  'finrobot': { name: 'AI4Finance Foundation', slug: 'ai4finance' },
  'taxhacker': { name: 'vas3k', slug: 'vas3k' },
  'bigcapital': { name: 'Bigcapital HQ', slug: 'bigcapital-hq' },
  'fingenius': { name: 'Anuj Dev Singh', slug: 'anuj-dev-singh' },
  'bolna': { name: 'Bolna AI', slug: 'bolna-ai' },
  'call-gpt-twilio-labs': { name: 'Twilio Labs', slug: 'twilio-labs' },
  'bentovoiceagent': { name: 'BentoML', slug: 'bentoml' },
  'enthusiast': { name: 'Upside Lab', slug: 'upside-lab' },
  'shoppinggpt': { name: 'Hoang Anh Vu', slug: 'hoang-anh-vu' },
  'shopify-ai-agent': { name: 'Shopify', slug: 'shopify' },
  'real-estate-ai-agent': { name: 'Bright Data', slug: 'bright-data' },
  'realtor-ai': { name: 'Samin Khan', slug: 'samin-khan' },
  'propertyloop': { name: 'Kaos599', slug: 'kaos599' },
  'travel-planner-ai': { name: 'Hardik Verma', slug: 'hardik-verma' },
  'ai-travel-agent-advanced': { name: 'Naakaa', slug: 'naakaa' },
  'tripper': { name: 'Embabel', slug: 'embabel' },
}

async function main() {
  console.log('\n🚀 Creating Individual Sellers...\n')

  // Cache for created sellers
  const sellerCache = new Map<string, string>()

  // Get all agents
  const agents = await prisma.agent.findMany({
    where: { status: 'APPROVED' },
    select: { id: true, slug: true, title: true, sellerId: true },
  })

  console.log(`Found ${agents.length} agents to process\n`)

  let sellersCreated = 0
  let agentsUpdated = 0

  for (const agent of agents) {
    const creatorInfo = AGENT_CREATORS[agent.slug]
    if (!creatorInfo) {
      console.log(`⏭️  No creator info for: ${agent.title}`)
      continue
    }

    // Check if we already created this seller
    let sellerId = sellerCache.get(creatorInfo.slug)

    if (!sellerId) {
      // Check if seller already exists
      const email = `${creatorInfo.slug}@sellers.rouze.ai`
      let seller = await prisma.user.findUnique({ where: { email } })

      if (!seller) {
        // Create new seller
        const avatarSeed = creatorInfo.slug.replace(/-/g, '')
        const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=f97316&textColor=ffffff&fontSize=40`

        try {
          seller = await prisma.user.create({
            data: {
              id: `seller-${creatorInfo.slug}`,
              email,
              name: creatorInfo.name,
              role: 'SELLER',
              avatarUrl,
            },
          })
          console.log(`✅ Created seller: ${creatorInfo.name}`)
          sellersCreated++

          // Create seller profile
          await prisma.sellerProfile.create({
            data: {
              userId: seller.id,
              portfolioUrlSlug: creatorInfo.slug,
              verificationStatus: 'VERIFIED',
            },
          })
        } catch (error) {
          console.log(`⚠️ Could not create seller ${creatorInfo.name}: ${error}`)
          continue
        }
      }

      sellerId = seller.id
      sellerCache.set(creatorInfo.slug, sellerId)
    }

    // Update agent to use this seller
    try {
      await prisma.agent.update({
        where: { id: agent.id },
        data: { sellerId },
      })
      agentsUpdated++
    } catch (error) {
      console.log(`⚠️ Could not update agent ${agent.title}: ${error}`)
    }
  }

  // Fix the admin user name back to something neutral
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (admin) {
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        name: 'Rouze Admin',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=rouze&backgroundColor=000000&textColor=f97316&fontSize=40',
      },
    })
    console.log('\n✅ Reset admin user name to "Rouze Admin"')
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary')
  console.log('='.repeat(50))
  console.log(`✅ Sellers created: ${sellersCreated}`)
  console.log(`✅ Agents updated: ${agentsUpdated}`)

  await prisma.$disconnect()
}

main().catch(console.error)
