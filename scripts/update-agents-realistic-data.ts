import { PrismaClient, UserRole, PurchaseStatus, PurchaseSource } from '@prisma/client'

const prisma = new PrismaClient()

// Sample review comments for each rating
const reviewComments: Record<number, string[]> = {
  5: [
    'Absolutely fantastic! This agent saved me hours of work every week. Highly recommend!',
    'Best purchase I made this year. The setup was straightforward and it works flawlessly.',
    'Exceeded all my expectations. The documentation is excellent and support is responsive.',
    'Game changer for my workflow. Worth every penny and then some!',
    'Incredible value. Does exactly what it promises and more.',
    'This agent is brilliant. My team productivity has increased significantly.',
    'Top quality work. The developer clearly put a lot of thought into this.',
  ],
  4: [
    'Great agent overall. A few minor quirks but nothing major. Would recommend.',
    'Solid purchase. Works well for my use case with occasional hiccups.',
    'Very good agent. The setup took a bit longer than expected but results are great.',
    'Does the job well. Would love to see more features in future updates.',
    'Good value for money. Reliable and consistent performance.',
    'Pretty impressed with this one. Minor improvements could make it perfect.',
    'Works great for most tasks. Documentation could be more detailed.',
  ],
}

// First names for fake users
const firstNames = [
  'Alex',
  'Jordan',
  'Taylor',
  'Morgan',
  'Casey',
  'Riley',
  'Jamie',
  'Avery',
  'Quinn',
  'Cameron',
  'Skyler',
  'Drew',
  'Reese',
  'Parker',
  'Charlie',
  'Blake',
  'Hayden',
  'Emerson',
  'Rowan',
  'Finley',
  'Sage',
  'River',
  'Phoenix',
  'Kai',
]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomRating(): number {
  // Weighted towards 4 and 5 stars
  const weights = [0, 0, 0, 0.15, 0.35, 0.5] // 0, 1, 2, 3, 4, 5 stars
  const random = Math.random()
  let cumulative = 0

  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i]
    if (random <= cumulative) {
      return i
    }
  }
  return 5
}

async function main() {
  console.log('Starting realistic data update...\n')

  // Step 1: Update all agents to $14.99
  console.log('Step 1: Updating all agent prices to $14.99...')
  await prisma.agent.updateMany({
    where: {},
    data: { price: 14.99 },
  })
  console.log('✅ All agent prices updated to $14.99\n')

  // Step 2: Get all approved agents
  const agents = await prisma.agent.findMany({
    where: { status: 'APPROVED' },
    select: { id: true, title: true, slug: true },
  })
  console.log(`Found ${agents.length} approved agents\n`)

  // Step 3: Create demo buyer users if they don't exist
  console.log('Step 2: Creating demo buyer users...')
  const demoUsers: { id: string; email: string; name: string }[] = []

  for (let i = 1; i <= 30; i++) {
    const firstName = firstNames[(i - 1) % firstNames.length]
    const lastName = `User${i}`
    const email = `demo.buyer${i}@rouze.ai`
    const userId = `demo-buyer-${i}`

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: email,
        name: `${firstName} ${lastName}`,
        role: UserRole.BUYER,
      },
    })
    demoUsers.push({ id: user.id, email: user.email, name: user.name || email })
  }
  console.log(`✅ ${demoUsers.length} demo users created/verified\n`)

  // Step 4: For each agent, add realistic stats and reviews
  console.log('Step 3: Adding realistic views, purchases, and reviews...\n')

  for (const agent of agents) {
    // Generate realistic views (100-2500)
    const viewCount = getRandomInt(150, 2500)

    // Generate purchases (1-5% of views, minimum 3)
    const purchaseRatio = getRandomInt(1, 5) / 100
    const purchaseCount = Math.max(3, Math.floor(viewCount * purchaseRatio))

    // Update agent stats
    await prisma.agent.update({
      where: { id: agent.id },
      data: { viewCount, purchaseCount },
    })

    // Number of reviews should be less than or equal to purchases
    const reviewCount = Math.min(
      purchaseCount,
      getRandomInt(Math.floor(purchaseCount * 0.3), Math.floor(purchaseCount * 0.7))
    )

    // Select random users for purchases and reviews
    const shuffledUsers = [...demoUsers].sort(() => Math.random() - 0.5)
    const purchaseUsers = shuffledUsers.slice(0, purchaseCount)
    const reviewUsers = purchaseUsers.slice(0, reviewCount)

    // Create purchases for users
    for (const user of purchaseUsers) {
      try {
        await prisma.purchase.upsert({
          where: {
            buyerId_agentVersionId: {
              buyerId: user.id,
              agentVersionId: agent.id,
            },
          },
          update: {},
          create: {
            buyerId: user.id,
            agentId: agent.id,
            agentVersionId: agent.id,
            amountPaid: 14.99,
            status: PurchaseStatus.COMPLETED,
            source: PurchaseSource.TEST_MODE,
            purchasedAt: new Date(Date.now() - getRandomInt(1, 90) * 24 * 60 * 60 * 1000), // Random date in last 90 days
          },
        })
      } catch (error) {
        // Skip if purchase already exists
      }
    }

    // Create reviews from users who purchased
    let totalRating = 0
    let createdReviews = 0

    for (const user of reviewUsers) {
      const rating = getRandomRating()
      if (rating < 4) continue // Only 4 and 5 star reviews

      totalRating += rating
      const comments = reviewComments[rating] || reviewComments[5]
      const comment = getRandomElement(comments)

      try {
        await prisma.review.upsert({
          where: {
            agentVersionId_buyerId: {
              agentVersionId: agent.id,
              buyerId: user.id,
            },
          },
          update: { rating, comment },
          create: {
            agentId: agent.id,
            buyerId: user.id,
            agentVersionId: agent.id,
            rating,
            comment,
            verifiedPurchase: true,
            createdAt: new Date(Date.now() - getRandomInt(1, 60) * 24 * 60 * 60 * 1000), // Random date in last 60 days
          },
        })
        createdReviews++
      } catch (error) {
        // Skip if review already exists
      }
    }

    const avgRating = createdReviews > 0 ? (totalRating / createdReviews).toFixed(1) : 'N/A'
    console.log(
      `✅ ${agent.title}: ${viewCount} views, ${purchaseCount} purchases, ${createdReviews} reviews (avg: ${avgRating}⭐)`
    )
  }

  console.log('\n✅ All agents updated with realistic data!')
  console.log('\n📊 Summary:')
  console.log('   - All prices set to $14.99')
  console.log('   - Views: 150-2500 per agent')
  console.log('   - Purchases: 1-5% of views')
  console.log('   - Reviews: 30-70% of purchases')
  console.log('   - Ratings: 4-5 stars only')
}

main()
  .catch(e => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
