/**
 * Fix Avatars with UI Avatars (PNG format)
 *
 * UI Avatars returns PNG images that work well with Next.js Image optimization
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateUIAvatar(name: string): string {
  // UI Avatars API - returns PNG
  const encodedName = encodeURIComponent(name)
  return `https://ui-avatars.com/api/?name=${encodedName}&background=f97316&color=ffffff&size=128&bold=true&format=png`
}

async function main() {
  console.log('\n🔧 Fixing Avatars with UI Avatars...\n')

  // Update all seller users
  const sellers = await prisma.user.findMany({
    where: {
      OR: [
        { role: 'SELLER' },
        { email: { contains: '@sellers.rouze.ai' } },
      ],
    },
  })

  console.log(`Found ${sellers.length} sellers to update\n`)

  let updated = 0

  for (const seller of sellers) {
    if (!seller.name) continue

    const newAvatarUrl = generateUIAvatar(seller.name)

    try {
      await prisma.user.update({
        where: { id: seller.id },
        data: { avatarUrl: newAvatarUrl },
      })
      console.log(`✅ ${seller.name}`)
      updated++
    } catch (error) {
      console.log(`⚠️ Could not update ${seller.name}`)
    }
  }

  // Also update mock reviewers
  const reviewers = await prisma.user.findMany({
    where: { email: { contains: '@mockreviewer.rouze.ai' } },
  })

  console.log(`\nUpdating ${reviewers.length} reviewers...\n`)

  for (const reviewer of reviewers) {
    if (!reviewer.name) continue

    // Use different background colors for reviewers
    const colors = ['0d9488', '3b82f6', '8b5cf6', 'ec4899', '10b981']
    const colorIndex = reviewer.name.length % colors.length
    const bgColor = colors[colorIndex]

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewer.name)}&background=${bgColor}&color=ffffff&size=128&bold=true&format=png`

    try {
      await prisma.user.update({
        where: { id: reviewer.id },
        data: { avatarUrl },
      })
      updated++
    } catch {
      // Skip
    }
  }

  // Update admin user too
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (admin) {
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        avatarUrl: 'https://ui-avatars.com/api/?name=Rouze+Admin&background=000000&color=f97316&size=128&bold=true&format=png',
      },
    })
    updated++
  }

  console.log('\n' + '='.repeat(40))
  console.log(`✅ Updated ${updated} avatars`)
  console.log('='.repeat(40))

  await prisma.$disconnect()
}

main().catch(console.error)
