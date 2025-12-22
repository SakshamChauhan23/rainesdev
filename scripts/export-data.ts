import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

// Connect to Australia database directly
const australiaUrl = 'postgresql://postgres.mlwvzapijdtcbvtlqkhq:7BJfhUvAeeSjrkKZ@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: australiaUrl
    }
  }
})

async function exportData() {
  try {
    console.log('Connecting to Australia database...')
    await prisma.$connect()

    console.log('Exporting data from Australia database...')

    // Export all data in order (respecting foreign key dependencies)
    const categories = await prisma.category.findMany()
    console.log(`✓ Exported ${categories.length} categories`)

    const users = await prisma.user.findMany()
    console.log(`✓ Exported ${users.length} users`)

    const sellerProfiles = await prisma.sellerProfile.findMany()
    console.log(`✓ Exported ${sellerProfiles.length} seller profiles`)

    const agents = await prisma.agent.findMany()
    console.log(`✓ Exported ${agents.length} agents`)

    const purchases = await prisma.purchase.findMany()
    console.log(`✓ Exported ${purchases.length} purchases`)

    const supportRequests = await prisma.supportRequest.findMany()
    console.log(`✓ Exported ${supportRequests.length} support requests`)

    const reviews = await prisma.review.findMany()
    console.log(`✓ Exported ${reviews.length} reviews`)

    const adminLogs = await prisma.adminLog.findMany()
    console.log(`✓ Exported ${adminLogs.length} admin logs`)

    const data = {
      categories,
      users,
      sellerProfiles,
      agents,
      purchases,
      supportRequests,
      reviews,
      adminLogs,
    }

    console.log('\nExport summary:')
    console.log(`- Categories: ${categories.length}`)
    console.log(`- Users: ${users.length}`)
    console.log(`- Seller Profiles: ${sellerProfiles.length}`)
    console.log(`- Agents: ${agents.length}`)
    console.log(`- Purchases: ${purchases.length}`)
    console.log(`- Support Requests: ${supportRequests.length}`)
    console.log(`- Reviews: ${reviews.length}`)
    console.log(`- Admin Logs: ${adminLogs.length}`)

    // Write to file
    fs.writeFileSync(
      './scripts/export-backup.json',
      JSON.stringify(data, null, 2)
    )

    console.log('\n✅ Data exported successfully to scripts/export-backup.json')
  } catch (error) {
    console.error('Error exporting data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
