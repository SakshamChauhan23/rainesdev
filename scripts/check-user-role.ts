import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUserRole(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    if (!user) {
      console.log(`❌ User not found: ${email}`)
      return
    }

    console.log('\n✅ User found:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Name:  ${user.name || 'N/A'}`)
    console.log(`Email: ${user.email}`)
    console.log(`Role:  ${user.role}`)
    console.log(`ID:    ${user.id}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    if (user.role === 'ADMIN') {
      console.log('✓ User has ADMIN role - should see admin features')
    } else {
      console.log(`⚠ User has ${user.role} role - will not see admin features`)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line or use default
const email = process.argv[2] || 'your-email@example.com'
console.log(`Checking user role for: ${email}\n`)
checkUserRole(email)
