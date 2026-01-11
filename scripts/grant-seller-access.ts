import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function grantSellerAccess() {
  const email = 'ivantitestemail31@gmail.com'

  try {
    console.log(`🔍 Looking for user: ${email}...`)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    if (!user) {
      console.log(`\n❌ User not found: ${email}`)
      console.log('The user needs to sign up first before we can grant seller access.')
      return
    }

    console.log(`\n✅ Found user:`)
    console.log(`   Name: ${user.name || 'Not set'}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Current Role: ${user.role}`)

    if (user.role === 'SELLER') {
      console.log(`\n✨ User already has SELLER role!`)
      return
    }

    // Update user role to SELLER
    console.log(`\n🔄 Updating role to SELLER...`)
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'SELLER' },
    })

    console.log(`\n✅ Successfully granted SELLER access!`)
    console.log(`   Name: ${updatedUser.name || 'Not set'}`)
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   New Role: ${updatedUser.role}`)

    // Check if seller profile exists, create if not
    console.log(`\n🔄 Checking seller profile...`)
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    })

    if (!sellerProfile) {
      console.log(`   Creating seller profile...`)
      await prisma.sellerProfile.create({
        data: {
          userId: user.id,
          portfolioUrlSlug: user.email.split('@')[0], // Use email prefix as default slug
          bio: null,
          socialLinks: {},
          verificationStatus: 'PENDING',
        },
      })
      console.log(`   ✅ Seller profile created!`)
    } else {
      console.log(`   ✅ Seller profile already exists!`)
    }

    console.log(`\n🎉 ${email} can now access the Seller Dashboard at /dashboard`)
    console.log(`   They can submit agents at /submit-agent`)

  } catch (error) {
    console.error('\n❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

grantSellerAccess()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
