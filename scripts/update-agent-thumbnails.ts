/**
 * Update agent thumbnails with featured images
 * Run: npx tsx scripts/update-agent-thumbnails.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Thumbnail mappings - using Unsplash free images
const AGENT_THUMBNAILS: Record<string, string> = {
  'health-insights-agent-hia':
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
  'ai-medical-diagnostics-agent':
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop',
  'stockagent-llm-trading-simulator':
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
}

async function main() {
  console.log('🖼️  Updating agent thumbnails...\n')

  for (const [slug, thumbnailUrl] of Object.entries(AGENT_THUMBNAILS)) {
    try {
      const agent = await prisma.agent.findUnique({
        where: { slug },
        select: { id: true, title: true },
      })

      if (!agent) {
        console.log(`  ⚠️  Agent not found: ${slug}`)
        continue
      }

      await prisma.agent.update({
        where: { slug },
        data: { thumbnailUrl },
      })

      console.log(`  ✅ Updated: ${agent.title}`)
    } catch (error) {
      console.error(`  ❌ Failed to update ${slug}:`, error)
    }
  }

  console.log('\n✅ Done!')
  await prisma.$disconnect()
}

main()
