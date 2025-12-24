import { prisma } from '../src/lib/prisma'

async function makePurchaseEligible() {
  try {
    // Find first completed purchase
    const purchase = await prisma.purchase.findFirst({
      where: { status: 'COMPLETED' },
      include: {
        buyer: true,
        agent: true
      },
      orderBy: {
        purchasedAt: 'desc'
      }
    })

    if (!purchase) {
      console.log('❌ No completed purchases found')
      console.log('\nTo create a test purchase:')
      console.log('1. Log in as a buyer')
      console.log('2. Purchase an agent using test mode')
      console.log('3. Run this script again')
      return
    }

    console.log('Found purchase:')
    console.log(`  ID: ${purchase.id}`)
    console.log(`  Buyer: ${purchase.buyer.email} (${purchase.buyer.name || 'No name'})`)
    console.log(`  Agent: ${purchase.agent.title}`)
    console.log(`  Original purchase date: ${purchase.purchasedAt}`)

    // Set purchased date to 15 days ago (eligible for review)
    const fifteenDaysAgo = new Date()
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { purchasedAt: fifteenDaysAgo }
    })

    console.log(`\n✅ Purchase date updated to 15 days ago!`)
    console.log(`New purchase date: ${fifteenDaysAgo.toISOString()}`)

    console.log('\n' + '='.repeat(60))
    console.log('TESTING INSTRUCTIONS')
    console.log('='.repeat(60))
    console.log(`\n1. Log in as: ${purchase.buyer.email}`)
    console.log(`   Password: (use your test password or temp password)`)
    console.log(`\n2. Navigate to: http://localhost:3000/agents/${purchase.agent.slug}`)
    console.log(`\n3. Scroll to the Reviews section`)
    console.log(`\n4. You should now see the review form!`)
    console.log(`\n5. Submit a review with:`)
    console.log(`   - Star rating: 5`)
    console.log(`   - Comment: "Great agent! Automated our workflow."`)
    console.log('\n' + '='.repeat(60))

    // Check for existing review
    const existingReview = await prisma.review.findUnique({
      where: {
        agentVersionId_buyerId: {
          agentVersionId: purchase.agentVersionId,
          buyerId: purchase.buyerId
        }
      }
    })

    if (existingReview) {
      console.log('\n⚠️  WARNING: This user has already reviewed this agent version')
      console.log('You can still test by:')
      console.log('1. Deleting the review in Prisma Studio')
      console.log('2. Or using a different buyer account')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

makePurchaseEligible()
