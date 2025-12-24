import { prisma } from '../src/lib/prisma'

async function createTestReview() {
  try {
    console.log('Creating test review for seller dashboard...\n')

    // Find a completed purchase for a seller's agent
    const purchase = await prisma.purchase.findFirst({
      where: {
        status: 'COMPLETED'
      },
      include: {
        agent: {
          include: {
            seller: true
          }
        },
        buyer: true
      }
    })

    if (!purchase) {
      console.log('❌ No completed purchases found')
      console.log('Please create a test purchase first')
      return
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        agentVersionId_buyerId: {
          agentVersionId: purchase.agentVersionId,
          buyerId: purchase.buyerId
        }
      }
    })

    if (existingReview) {
      console.log('✅ Review already exists for this purchase')
      console.log(`\nReview details:`)
      console.log(`  Rating: ${existingReview.rating} stars`)
      console.log(`  Comment: ${existingReview.comment || '(no comment)'}`)
      console.log(`  Created: ${existingReview.createdAt}`)
    } else {
      // Create test review
      const review = await prisma.review.create({
        data: {
          agentId: purchase.agentId,
          agentVersionId: purchase.agentVersionId,
          buyerId: purchase.buyerId,
          rating: 5,
          comment: 'This agent completely transformed our lead generation process! We went from manually researching 20 leads per week to automatically qualifying 200+ per day. The setup was straightforward, and the ROI was positive within the first month. Highly recommend for any B2B company looking to scale their outreach.',
          verifiedPurchase: true
        }
      })

      console.log('✅ Test review created successfully!\n')
      console.log(`Review details:`)
      console.log(`  Rating: ${review.rating} stars`)
      console.log(`  Buyer: ${purchase.buyer.email}`)
      console.log(`  Agent: ${purchase.agent.title}`)
      console.log(`  Seller: ${purchase.agent.seller.email}`)
    }

    console.log('\n' + '='.repeat(60))
    console.log('SELLER DASHBOARD TEST')
    console.log('='.repeat(60))
    console.log(`\n1. Log in as seller: ${purchase.agent.seller.email}`)
    console.log(`   Password: /nS5iW3kixgUUX/O4JKykQ==Aa1!`)
    console.log(`\n2. Go to: http://localhost:3000/dashboard`)
    console.log(`\n3. Scroll to the bottom to see "Reviews" section`)
    console.log(`\n4. You should see:`)
    console.log(`   - Overall Review Stats card`)
    console.log(`   - Reviews by Agent section`)
    console.log(`   - Click to expand and see individual reviews`)
    console.log('\n' + '='.repeat(60))

    // Show what seller will see
    const sellerReviews = await prisma.review.findMany({
      where: {
        agent: {
          sellerId: purchase.agent.sellerId
        }
      },
      include: {
        agent: true,
        buyer: true
      }
    })

    console.log(`\nSeller has ${sellerReviews.length} total review(s)`)

    if (sellerReviews.length > 0) {
      const totalRating = sellerReviews.reduce((sum, r) => sum + r.rating, 0)
      const avgRating = (totalRating / sellerReviews.length).toFixed(1)
      console.log(`Average rating: ${avgRating} ⭐`)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestReview()
