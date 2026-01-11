import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupAgents() {
  try {
    console.log('🔍 Fetching all agents...')

    // Get all agents
    const allAgents = await prisma.agent.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    })

    console.log(`\n📊 Found ${allAgents.length} total agents:`)
    allAgents.forEach(agent => {
      console.log(`  - ${agent.title} (${agent.slug}) - ${agent.status}`)
    })

    // Find 'The Supplier Watchdog'
    const keepAgent = allAgents.find(agent =>
      agent.title.toLowerCase().includes('supplier watchdog')
    )

    if (!keepAgent) {
      console.log('\n❌ Could not find "The Supplier Watchdog" agent!')
      console.log('Please verify the exact title and try again.')
      return
    }

    console.log(`\n✅ Will keep: "${keepAgent.title}" (ID: ${keepAgent.id})`)

    // Get agents to delete
    const agentsToDelete = allAgents.filter(agent => agent.id !== keepAgent.id)

    if (agentsToDelete.length === 0) {
      console.log('\n✨ No agents to delete. Only "The Supplier Watchdog" exists.')
      return
    }

    console.log(`\n🗑️  Will delete ${agentsToDelete.length} agents:`)
    agentsToDelete.forEach(agent => {
      console.log(`  - ${agent.title} (${agent.slug})`)
    })

    console.log('\n⚠️  This will also delete related:')
    console.log('  - Reviews')
    console.log('  - Purchases')
    console.log('  - Admin logs')

    // Delete related data first (due to foreign key constraints)
    console.log('\n🔄 Deleting related data...')

    const agentIdsToDelete = agentsToDelete.map(a => a.id)

    // Delete reviews
    const deletedReviews = await prisma.review.deleteMany({
      where: {
        agentId: {
          in: agentIdsToDelete
        }
      }
    })
    console.log(`  ✓ Deleted ${deletedReviews.count} reviews`)

    // Delete purchases
    const deletedPurchases = await prisma.purchase.deleteMany({
      where: {
        agentId: {
          in: agentIdsToDelete
        }
      }
    })
    console.log(`  ✓ Deleted ${deletedPurchases.count} purchases`)

    // Delete admin logs related to these agents
    const deletedLogs = await prisma.adminLog.deleteMany({
      where: {
        entityType: 'AGENT',
        entityId: {
          in: agentIdsToDelete
        }
      }
    })
    console.log(`  ✓ Deleted ${deletedLogs.count} admin logs`)

    // Now delete the agents
    console.log('\n🗑️  Deleting agents...')
    const deletedAgents = await prisma.agent.deleteMany({
      where: {
        id: {
          in: agentIdsToDelete
        }
      }
    })
    console.log(`  ✓ Deleted ${deletedAgents.count} agents`)

    console.log('\n✅ Cleanup complete!')
    console.log(`\n📊 Remaining agent:`)
    console.log(`  - ${keepAgent.title} (${keepAgent.slug})`)

  } catch (error) {
    console.error('\n❌ Error during cleanup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanupAgents()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
