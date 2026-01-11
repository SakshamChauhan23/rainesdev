import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyUser() {
  const email = 'ivantitestemail31@gmail.com'

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        sellerProfile: true,
      },
    })

    if (!user) {
      console.log(`❌ User not found: ${email}`)
      return
    }

    console.log(`\n✅ User Details:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Name: ${user.name || 'Not set'}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Avatar: ${user.avatarUrl || 'Not set'}`)
    console.log(`   Created: ${user.createdAt.toLocaleDateString()}`)

    if (user.sellerProfile) {
      console.log(`\n✅ Seller Profile:`)
      console.log(`   ID: ${user.sellerProfile.id}`)
      console.log(`   Portfolio Slug: ${user.sellerProfile.portfolioUrlSlug}`)
      console.log(`   Bio: ${user.sellerProfile.bio || 'Not set'}`)
      console.log(`   Verification: ${user.sellerProfile.verificationStatus}`)
      console.log(`   Created: ${user.sellerProfile.createdAt.toLocaleDateString()}`)
    } else {
      console.log(`\n❌ No seller profile found`)
    }

    // Check agents created
    const agentsCreated = await prisma.agent.count({
      where: { sellerId: user.id },
    })

    console.log(`\n📊 Agents Created: ${agentsCreated}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyUser()
