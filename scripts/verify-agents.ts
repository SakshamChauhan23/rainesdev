import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyAgents() {
  try {
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        price: true,
        viewCount: true,
        purchaseCount: true,
        version: true,
        createdAt: true,
      },
    })

    console.log(`\n📊 Total agents in database: ${agents.length}\n`)

    agents.forEach(agent => {
      console.log(`✅ ${agent.title}`)
      console.log(`   Slug: ${agent.slug}`)
      console.log(`   Status: ${agent.status}`)
      console.log(`   Price: $${agent.price}`)
      console.log(`   Version: ${agent.version}`)
      console.log(`   Views: ${agent.viewCount}`)
      console.log(`   Purchases: ${agent.purchaseCount}`)
      console.log(`   Created: ${agent.createdAt.toLocaleDateString()}`)
      console.log('')
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyAgents()
