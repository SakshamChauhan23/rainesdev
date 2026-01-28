/**
 * Fix Seller Avatars Script
 *
 * Updates all sellers with working DiceBear avatars
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seller names and their avatar seeds (for consistent DiceBear avatars)
const SELLER_AVATARS: Record<string, string> = {
  'Chatwoot Team': 'chatwoot',
  'Hexastack': 'hexastack',
  'Tiledesk': 'tiledesk',
  'LobeHub': 'lobehub',
  'Alex Tselegidis': 'alextselegidis',
  'M. Junaid': 'mjunaid',
  'ExtremeCoder': 'extremecoder',
  'Aniket Work': 'aniketwork',
  'Filip Michalsky': 'filipmichalsky',
  'Matthew Dailey': 'matthewdailey',
  'Avijeet Biswal': 'avijeetbiswal',
  'Kaymen': 'kaymen',
  'Bright Data': 'brightdata',
  'Guillermo Ruiz': 'guillermoruiz',
  'Yorky': 'yorky',
  'AWS Samples': 'awssamples',
  'Sachin Shrestha': 'sachinshrestha',
  'Sujit Mahapatra': 'sujitmahapatra',
  'Elie Steinbock': 'eliesteinbock',
  'Haason SaaS': 'haasonsaas',
  'Semantic Sean': 'semanticsean',
  'LangChain AI': 'langchainai',
  'Klaudiusz': 'klaudiusz',
  'Social GPT Team': 'socialgpt',
  'Agentuity': 'agentuity',
  'Unclecode': 'unclecode',
  'HM Shahbaz': 'hmshahbaz',
  'ScraperAI Team': 'scraperai',
  'Firecrawl': 'firecrawl',
  'Zackriya Solutions': 'zacriya',
  'JF Costello': 'jfcostello',
  '0x77dev': '0x77dev',
  'Casbin': 'casbin',
  'Labring': 'labring',
  'Khoj AI': 'khojai',
  'AIHawk': 'aihawk',
  'Leon AI': 'leonai',
  'PKUCER': 'pkucer',
  'Marcin Szczygliński': 'marcinszczygliński',
  'Eigent AI': 'eigentai',
  'AI4Finance Foundation': 'ai4finance',
  'vas3k': 'vas3k',
  'Bigcapital HQ': 'bigcapital',
  'Anuj Dev Singh': 'anujdevsingh',
  'Bolna AI': 'bolnaai',
  'Twilio Labs': 'twiliolabs',
  'BentoML': 'bentoml',
  'Upside Lab': 'upsidelab',
  'Hoang Anh Vu': 'hoanganh',
  'Shopify': 'shopify',
  'Samin Khan': 'saminkhan',
  'Kaos599': 'kaos599',
  'Hardik Verma': 'hardikverma',
  'Naakaa': 'naakaa',
  'Embabel': 'embabel',
}

async function main() {
  console.log('\n🔧 Fixing Seller Avatars...\n')

  // Get all users that are sellers or admins
  const sellers = await prisma.user.findMany({
    where: {
      role: { in: ['SELLER', 'ADMIN'] },
    },
  })

  console.log(`Found ${sellers.length} sellers to check\n`)

  let updated = 0

  for (const seller of sellers) {
    if (!seller.name) continue

    const seed = SELLER_AVATARS[seller.name] || seller.name.toLowerCase().replace(/\s+/g, '')

    // Use DiceBear initials style for professional look
    const newAvatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f97316&textColor=ffffff&fontSize=40`

    try {
      await prisma.user.update({
        where: { id: seller.id },
        data: { avatarUrl: newAvatarUrl },
      })
      console.log(`✅ Updated: ${seller.name}`)
      updated++
    } catch (error) {
      console.log(`⚠️ Could not update ${seller.name}: ${error}`)
    }
  }

  // Also update the mock reviewers to use proper avatars
  const reviewers = await prisma.user.findMany({
    where: {
      email: { contains: '@mockreviewer.rouze.ai' },
    },
  })

  console.log(`\nUpdating ${reviewers.length} mock reviewers...\n`)

  for (const reviewer of reviewers) {
    if (!reviewer.name) continue

    const seed = reviewer.name.toLowerCase().replace(/\s+/g, '')
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`

    try {
      await prisma.user.update({
        where: { id: reviewer.id },
        data: { avatarUrl: newAvatarUrl },
      })
      updated++
    } catch {
      // Skip errors
    }
  }

  console.log('\n' + '='.repeat(40))
  console.log(`✅ Updated ${updated} user avatars`)
  console.log('='.repeat(40))

  await prisma.$disconnect()
}

main().catch(console.error)
