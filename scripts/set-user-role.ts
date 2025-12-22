/**
 * Script to set user role
 * Usage: npx tsx scripts/set-user-role.ts <email> <role>
 * Example: npx tsx scripts/set-user-role.ts admin@example.com ADMIN
 */

import { prisma } from '../src/lib/prisma'

const email = process.argv[2]
const role = process.argv[3] as 'BUYER' | 'SELLER' | 'ADMIN'

const validRoles = ['BUYER', 'SELLER', 'ADMIN']

if (!email || !role) {
    console.error('❌ Usage: npx tsx scripts/set-user-role.ts <email> <role>')
    console.error('   Valid roles: BUYER, SELLER, ADMIN')
    console.error('   Example: npx tsx scripts/set-user-role.ts admin@example.com ADMIN')
    process.exit(1)
}

if (!validRoles.includes(role)) {
    console.error(`❌ Invalid role: ${role}`)
    console.error(`   Valid roles: ${validRoles.join(', ')}`)
    process.exit(1)
}

async function setUserRole() {
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role },
            select: {
                id: true,
                email: true,
                role: true,
                name: true
            }
        })

        console.log('✅ User role updated successfully!')
        console.log(`   Email: ${user.email}`)
        console.log(`   Name: ${user.name || '(not set)'}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   ID: ${user.id}`)

    } catch (error: any) {
        if (error.code === 'P2025') {
            console.error(`❌ User not found: ${email}`)
            console.error('   Make sure the user has logged in at least once.')
        } else {
            console.error('❌ Error updating user role:', error)
        }
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

setUserRole()
    .then(() => {
        console.log('\n✨ Done!')
        process.exit(0)
    })
    .catch(() => {
        process.exit(1)
    })
