/**
 * One-time migration script: Create LEGACY_GRACE subscriptions for existing purchasers.
 *
 * Finds all users who have at least one COMPLETED purchase and creates a
 * LEGACY_GRACE subscription with a 30-day grace period.
 *
 * This script is idempotent — it skips users who already have a subscription.
 *
 * Usage: npx tsx scripts/migrate-legacy-users.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const GRACE_PERIOD_DAYS = 30

async function migrateLegacyUsers() {
  console.log('Starting legacy user migration...')
  console.log(`Grace period: ${GRACE_PERIOD_DAYS} days`)

  // Find all users with completed purchases
  const usersWithPurchases = await prisma.purchase.findMany({
    where: { status: 'COMPLETED' },
    select: { buyerId: true },
    distinct: ['buyerId'],
  })

  console.log(`Found ${usersWithPurchases.length} users with completed purchases`)

  let created = 0
  let skipped = 0
  let errors = 0

  for (const { buyerId } of usersWithPurchases) {
    try {
      // Check if subscription already exists
      const existing = await prisma.subscription.findUnique({
        where: { userId: buyerId },
      })

      if (existing) {
        console.log(`  Skipped user ${buyerId} — subscription already exists (${existing.status})`)
        skipped++
        continue
      }

      // Create legacy grace subscription
      const gracePeriodEnd = new Date()
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + GRACE_PERIOD_DAYS)

      await prisma.subscription.create({
        data: {
          userId: buyerId,
          status: 'LEGACY_GRACE',
          gracePeriodEnd,
        },
      })

      console.log(
        `  Created LEGACY_GRACE for user ${buyerId} — expires ${gracePeriodEnd.toISOString()}`
      )
      created++
    } catch (error) {
      console.error(`  Error migrating user ${buyerId}:`, error)
      errors++
    }
  }

  console.log('\nMigration complete:')
  console.log(`  Created: ${created}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Errors:  ${errors}`)
}

migrateLegacyUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
