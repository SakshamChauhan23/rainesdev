import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

// Connect to Mumbai database (using current .env)
const prisma = new PrismaClient()

async function importData() {
  try {
    console.log('Connecting to Mumbai database...')
    await prisma.$connect()

    console.log('Reading backup data...')
    const dataStr = fs.readFileSync('./scripts/export-backup.json', 'utf-8')
    const data = JSON.parse(dataStr)

    console.log('\nImporting data to Mumbai database...')

    // Import in order (respecting foreign key dependencies)

    // 1. Categories (no dependencies)
    console.log(`\nImporting ${data.categories.length} categories...`)
    for (const category of data.categories) {
      await prisma.category.create({ data: category })
    }
    console.log(`✓ Imported ${data.categories.length} categories`)

    // 2. Users (no dependencies)
    console.log(`\nImporting ${data.users.length} users...`)
    for (const user of data.users) {
      await prisma.user.create({ data: user })
    }
    console.log(`✓ Imported ${data.users.length} users`)

    // 3. Seller Profiles (depends on Users)
    console.log(`\nImporting ${data.sellerProfiles.length} seller profiles...`)
    for (const profile of data.sellerProfiles) {
      await prisma.sellerProfile.create({ data: profile })
    }
    console.log(`✓ Imported ${data.sellerProfiles.length} seller profiles`)

    // 4. Agents (depends on Users and Categories, and potentially other Agents via parentAgentId)
    // Import agents without parentAgentId first, then agents with parentAgentId
    console.log(`\nImporting ${data.agents.length} agents...`)
    const agentsWithoutParent = data.agents.filter((a: any) => !a.parentAgentId)
    const agentsWithParent = data.agents.filter((a: any) => a.parentAgentId)

    console.log(`  - Importing ${agentsWithoutParent.length} parent agents...`)
    for (const agent of agentsWithoutParent) {
      await prisma.agent.create({ data: agent })
    }

    console.log(`  - Importing ${agentsWithParent.length} child agents...`)
    for (const agent of agentsWithParent) {
      await prisma.agent.create({ data: agent })
    }
    console.log(`✓ Imported ${data.agents.length} agents`)

    // 5. Purchases (depends on Users and Agents)
    console.log(`\nImporting ${data.purchases.length} purchases...`)
    for (const purchase of data.purchases) {
      await prisma.purchase.create({ data: purchase })
    }
    console.log(`✓ Imported ${data.purchases.length} purchases`)

    // 6. Support Requests (depends on Purchases, Users, Agents)
    console.log(`\nImporting ${data.supportRequests.length} support requests...`)
    for (const supportRequest of data.supportRequests) {
      await prisma.supportRequest.create({ data: supportRequest })
    }
    console.log(`✓ Imported ${data.supportRequests.length} support requests`)

    // 7. Reviews (depends on Agents and Users)
    console.log(`\nImporting ${data.reviews.length} reviews...`)
    for (const review of data.reviews) {
      await prisma.review.create({ data: review })
    }
    console.log(`✓ Imported ${data.reviews.length} reviews`)

    // 8. Admin Logs (depends on Users)
    console.log(`\nImporting ${data.adminLogs.length} admin logs...`)
    for (const log of data.adminLogs) {
      await prisma.adminLog.create({ data: log })
    }
    console.log(`✓ Imported ${data.adminLogs.length} admin logs`)

    console.log('\n✅ All data imported successfully to Mumbai database!')

    // Verify counts
    console.log('\nVerifying import:')
    const [categories, users, agents, purchases, sellerProfiles] = await Promise.all([
      prisma.category.count(),
      prisma.user.count(),
      prisma.agent.count(),
      prisma.purchase.count(),
      prisma.sellerProfile.count(),
    ])

    console.log(`- Categories: ${categories}`)
    console.log(`- Users: ${users}`)
    console.log(`- Seller Profiles: ${sellerProfiles}`)
    console.log(`- Agents: ${agents}`)
    console.log(`- Purchases: ${purchases}`)

  } catch (error) {
    console.error('Error importing data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

importData()
