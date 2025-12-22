/**
 * Script to sync existing Supabase Auth users to Prisma database
 * Run with: npx tsx scripts/sync-users.ts
 */

import { createClient } from '@supabase/supabase-js'
import { prisma } from '../src/lib/prisma'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function syncUsers() {
    try {
        console.log('🔄 Fetching users from Supabase Auth...')

        // Fetch all users from Supabase Auth
        const { data: { users }, error } = await supabase.auth.admin.listUsers()

        if (error) {
            throw error
        }

        console.log(`📊 Found ${users.length} users in Supabase Auth`)

        let synced = 0
        let skipped = 0

        for (const user of users) {
            try {
                // Check if user exists in Prisma
                const existingUser = await prisma.user.findUnique({
                    where: { id: user.id }
                })

                if (existingUser) {
                    console.log(`⏭️  User already exists: ${user.email}`)
                    skipped++
                    continue
                }

                // Create user in Prisma
                await prisma.user.create({
                    data: {
                        id: user.id,
                        email: user.email!,
                        name: user.user_metadata?.name || null,
                        avatarUrl: user.user_metadata?.avatar_url || null,
                        role: 'BUYER' // Default role
                    }
                })

                console.log(`✅ Synced user: ${user.email}`)
                synced++
            } catch (err) {
                console.error(`❌ Error syncing user ${user.email}:`, err)
            }
        }

        console.log('\n📈 Sync Summary:')
        console.log(`   ✅ Synced: ${synced}`)
        console.log(`   ⏭️  Skipped: ${skipped}`)
        console.log(`   📊 Total: ${users.length}`)

        // Prompt to set admin role
        console.log('\n💡 To set a user as ADMIN, run:')
        console.log(`   npx prisma studio`)
        console.log('   Or use SQL:')
        console.log(`   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';`)

    } catch (error) {
        console.error('❌ Error syncing users:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

syncUsers()
    .then(() => {
        console.log('\n✨ User sync completed!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n💥 User sync failed:', error)
        process.exit(1)
    })
