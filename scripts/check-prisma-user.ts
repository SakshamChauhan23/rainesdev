import { prisma } from '../src/lib/prisma'

async function checkUser(email: string) {
    console.log(`\n🔍 Checking for user in Prisma DB: ${email}\n`)

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            sellerProfile: true,
            agentsCreated: true,
        }
    })

    if (user) {
        console.log('✅ User found in Prisma (users table):')
        console.log('   - ID:', user.id)
        console.log('   - Email:', user.email)
        console.log('   - Role:', user.role)
        console.log('   - Name:', user.name || 'Not set')
        console.log('   - Created At:', user.createdAt)
        console.log('   - Has Seller Profile:', user.sellerProfile ? '✅ Yes' : '❌ No')
        console.log('   - Agents Created:', user.agentsCreated.length)
    } else {
        console.log('❌ User NOT found in Prisma database')
        console.log('   User exists in Supabase Auth but not in your Prisma database!')
        console.log('   This is likely the issue.')
    }

    console.log('\n' + '='.repeat(60) + '\n')
    await prisma.$disconnect()
}

const emailToCheck = process.argv[2] || 'sakshamchauhan23@gmail.com'
checkUser(emailToCheck).then(() => {
    console.log('✨ Check complete!\n')
    process.exit(0)
}).catch((error) => {
    console.error('💥 Error:', error)
    process.exit(1)
})
