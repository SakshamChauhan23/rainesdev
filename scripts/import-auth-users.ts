import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as crypto from 'crypto'

// Mumbai Supabase credentials
const mumbaiUrl = 'https://vuzmyajbuwuwqkvjejlv.supabase.co'
const mumbaiServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQyMDM0OCwiZXhwIjoyMDgxOTk2MzQ4fQ.tr1k2ZJqbHloWyvm8OQth2VmSd--ncVKL77KbT7gWCk'

const supabaseAdmin = createClient(mumbaiUrl, mumbaiServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Generate a secure temporary password
function generateTempPassword(): string {
  return crypto.randomBytes(16).toString('base64').slice(0, 24) + 'Aa1!'
}

async function importAuthUsers() {
  try {
    console.log('Reading auth users backup...')
    const data = JSON.parse(fs.readFileSync('./scripts/auth-users-backup.json', 'utf-8'))

    console.log(`\nFound ${data.length} auth users to import`)
    console.log('Connecting to Mumbai Supabase...\n')

    const tempPassword = generateTempPassword()
    console.log(`Generated temporary password: ${tempPassword}`)
    console.log('(All users will use this password initially and should reset it)\n')

    const results = {
      success: [] as string[],
      failed: [] as { email: string; error: string }[],
      skipped: [] as string[]
    }

    for (const user of data) {
      try {
        console.log(`Importing ${user.email}...`)

        // Create user with admin API
        const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: tempPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: user.user_metadata || {},
          app_metadata: user.app_metadata || {},
        })

        if (error) {
          // Check if user already exists
          if (error.message.includes('already registered')) {
            console.log(`  ⚠️  User already exists, skipping`)
            results.skipped.push(user.email)
          } else {
            console.log(`  ✗ Failed: ${error.message}`)
            results.failed.push({ email: user.email, error: error.message })
          }
        } else {
          console.log(`  ✓ Created successfully (ID: ${newUser.user?.id})`)
          results.success.push(user.email)
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error: any) {
        console.log(`  ✗ Error: ${error.message}`)
        results.failed.push({ email: user.email, error: error.message })
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('IMPORT SUMMARY')
    console.log('='.repeat(60))
    console.log(`✓ Successfully imported: ${results.success.length}`)
    console.log(`⚠️  Skipped (already exist): ${results.skipped.length}`)
    console.log(`✗ Failed: ${results.failed.length}`)

    if (results.success.length > 0) {
      console.log('\n✅ Successfully imported users:')
      results.success.forEach(email => console.log(`  - ${email}`))
    }

    if (results.skipped.length > 0) {
      console.log('\n⚠️  Skipped users (already exist):')
      results.skipped.forEach(email => console.log(`  - ${email}`))
    }

    if (results.failed.length > 0) {
      console.log('\n✗ Failed imports:')
      results.failed.forEach(({ email, error }) => console.log(`  - ${email}: ${error}`))
    }

    console.log('\n' + '='.repeat(60))
    console.log('IMPORTANT NEXT STEPS:')
    console.log('='.repeat(60))
    console.log(`1. Temporary password for all users: ${tempPassword}`)
    console.log('2. Send password reset links to users, OR')
    console.log('3. Share temporary password and ask users to change it')
    console.log('4. User roles are already set in the database (no action needed)')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('Error importing auth users:', error)
    throw error
  }
}

importAuthUsers()
