import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

// Mumbai Supabase credentials
const mumbaiUrl = 'https://vuzmyajbuwuwqkvjejlv.supabase.co'
const mumbaiServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQyMDM0OCwiZXhwIjoyMDgxOTk2MzQ4fQ.tr1k2ZJqbHloWyvm8OQth2VmSd--ncVKL77KbT7gWCk'

const supabaseAdmin = createClient(mumbaiUrl, mumbaiServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const prisma = new PrismaClient()

async function syncUserIds() {
  try {
    console.log('Syncing User IDs between Supabase Auth and Database...\n')

    // Read the original auth users to get old ID mappings
    const oldAuthUsers = JSON.parse(fs.readFileSync('./scripts/auth-users-backup.json', 'utf-8'))

    // Get new auth users from Mumbai
    const { data: newAuthData, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) throw error

    // Create mapping of email -> old ID and email -> new ID
    const oldIdByEmail: Record<string, string> = {}
    const newIdByEmail: Record<string, string> = {}

    oldAuthUsers.forEach((user: any) => {
      oldIdByEmail[user.email] = user.id
    })

    newAuthData.users.forEach(user => {
      if (user.email) {
        newIdByEmail[user.email] = user.id
      }
    })

    console.log('ID Mappings:')
    console.log('='.repeat(80))

    const idMappings: Array<{ email: string; oldId: string; newId: string }> = []

    for (const email of Object.keys(oldIdByEmail)) {
      const oldId = oldIdByEmail[email]
      const newId = newIdByEmail[email]

      if (newId) {
        console.log(`${email}`)
        console.log(`  Old ID: ${oldId}`)
        console.log(`  New ID: ${newId}`)
        console.log()
        idMappings.push({ email, oldId, newId })
      }
    }

    console.log('='.repeat(80))
    console.log(`\nFound ${idMappings.length} users to update\n`)

    // Update database User records with new IDs
    console.log('Updating database records...\n')

    for (const mapping of idMappings) {
      try {
        // Check if user exists with old ID
        const existingUser = await prisma.user.findUnique({
          where: { id: mapping.oldId }
        })

        if (!existingUser) {
          console.log(`⚠️  User ${mapping.email} not found in database (old ID: ${mapping.oldId})`)
          continue
        }

        // Update the user ID using raw SQL (since Prisma doesn't allow updating @id fields)
        await prisma.$executeRawUnsafe(`
          UPDATE users SET id = $1 WHERE id = $2
        `, mapping.newId, mapping.oldId)

        console.log(`✓ Updated ${mapping.email}: ${mapping.oldId.slice(0, 8)}... → ${mapping.newId.slice(0, 8)}...`)

      } catch (error: any) {
        console.log(`✗ Failed to update ${mapping.email}: ${error.message}`)
      }
    }

    console.log('\n✅ User ID synchronization complete!')

    // Verify the update
    console.log('\nVerifying updates...')
    const userCount = await prisma.user.count()
    console.log(`Total users in database: ${userCount}`)

    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    })

    console.log('\nCurrent users in database:')
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}): ${user.id}`)
    })

  } catch (error) {
    console.error('Error syncing user IDs:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

syncUserIds()
