import { prisma } from '../src/lib/prisma'

async function testReviewEligibility() {
  // Find a completed purchase
  const purchase = await prisma.purchase.findFirst({
    where: {
      status: 'COMPLETED'
    },
    include: {
      agent: true,
      buyer: true
    }
  })

  if (!purchase) {
    console.log('No completed purchases found')
    return
  }

  console.log('Found purchase:')
  console.log(`  Buyer: ${purchase.buyer.email} (${purchase.buyerId})`)
  console.log(`  Agent: ${purchase.agent.title} (${purchase.agentId})`)
  console.log(`  Purchased: ${purchase.purchasedAt}`)
  console.log(`  Agent Version ID: ${purchase.agentVersionId}`)

  const eligibilityDate = new Date(purchase.purchasedAt)
  eligibilityDate.setDate(eligibilityDate.getDate() + 14)

  const now = new Date()
  const daysUntilEligible = Math.ceil((eligibilityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  console.log(`\nEligibility date: ${eligibilityDate.toISOString()}`)
  console.log(`Days until eligible: ${daysUntilEligible}`)
  console.log(`Is eligible: ${now >= eligibilityDate}`)

  // Check for existing review
  const existingReview = await prisma.review.findUnique({
    where: {
      agentVersionId_buyerId: {
        agentVersionId: purchase.agentVersionId,
        buyerId: purchase.buyerId
      }
    }
  })

  console.log(`\nExisting review: ${existingReview ? 'Yes' : 'No'}`)

  console.log(`\nTest URL:`)
  console.log(`http://localhost:3000/api/reviews/eligibility?userId=${purchase.buyerId}&agentId=${purchase.agentId}`)

  await prisma.$disconnect()
}

testReviewEligibility()
