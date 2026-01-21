/**
 * Update Sales Dojo agent thumbnail with a different featured image
 * Run: npx tsx scripts/update-sales-dojo-thumbnail.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sales/coaching themed image - showing business coaching/training
const NEW_THUMBNAIL_URL =
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'

async function main() {
  console.log('🔍 Looking for Sales Dojo agent...\n')

  // Find the Sales Dojo agent by title (partial match)
  const agent = await prisma.agent.findFirst({
    where: {
      OR: [
        { title: { contains: 'Sales Dojo', mode: 'insensitive' } },
        { slug: { contains: 'sales-dojo', mode: 'insensitive' } },
      ],
    },
    select: { id: true, title: true, slug: true, thumbnailUrl: true },
  })

  if (!agent) {
    console.log('❌ Sales Dojo agent not found')
    console.log('\n📋 Listing all agents with their thumbnails:\n')

    const allAgents = await prisma.agent.findMany({
      select: { title: true, slug: true, thumbnailUrl: true },
      orderBy: { createdAt: 'desc' },
    })

    allAgents.forEach(a => {
      console.log(`  - ${a.title}`)
      console.log(`    slug: ${a.slug}`)
      console.log(`    thumbnail: ${a.thumbnailUrl?.slice(0, 60) || 'none'}...\n`)
    })

    await prisma.$disconnect()
    return
  }

  console.log(`✓ Found agent: ${agent.title}`)
  console.log(`  Current thumbnail: ${agent.thumbnailUrl || 'none'}`)
  console.log(`  New thumbnail: ${NEW_THUMBNAIL_URL}\n`)

  await prisma.agent.update({
    where: { id: agent.id },
    data: { thumbnailUrl: NEW_THUMBNAIL_URL },
  })

  console.log('✅ Thumbnail updated successfully!')
  await prisma.$disconnect()
}

main().catch(async e => {
  console.error('Error:', e)
  await prisma.$disconnect()
  process.exit(1)
})
