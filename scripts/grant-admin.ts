import { PrismaClient } from '@prisma/client'

// Use DIRECT_URL for scripts to avoid connection pool limits
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
})

async function grantAdminAccess(email: string) {
  try {
    console.log(`\n🔍 Searching for user: ${email}`)

    const user = await prisma.user.findFirst({
      where: { email }
    })

    if (!user) {
      console.log(`\n❌ User not found with email: ${email}`)
      console.log('\n💡 The user needs to sign up on the platform first.')
      console.log('   1. Go to https://hireyourai.netlify.app')
      console.log('   2. Sign up with this email')
      console.log('   3. Then run this script again')
      return
    }

    if (user.role === 'ADMIN') {
      console.log(`\n✅ User is already an ADMIN`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      return
    }

    console.log(`\n👤 Found user:`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Current Role: ${user.role}`)

    console.log(`\n⬆️  Upgrading to ADMIN...`)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    })

    console.log(`\n✅ Successfully granted ADMIN access!`)
    console.log(`   Name: ${updatedUser.name}`)
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   New Role: ${updatedUser.role}`)
    console.log(`\n🎉 ${email} now has admin access to the platform!`)

  } catch (error) {
    console.error('\n❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line argument or use default
const email = process.argv[2] || 'sal@rainesdev.ai'

grantAdminAccess(email)
