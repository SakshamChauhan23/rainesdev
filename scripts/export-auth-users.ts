import { createClient } from '@supabase/supabase-js'

// Australia Supabase credentials
const australiaUrl = 'https://mlwvzapijdtcbvtlqkhq.supabase.co'
const australiaServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3Z6YXBpamR0Y2J2dGxxa2hxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE0NzU0MCwiZXhwIjoyMDgxNzIzNTQwfQ.6LE0SXw8mIgz94VkBNLj7QBUA7CNw5BBvsH2nT1jV8A'

const supabaseAdmin = createClient(australiaUrl, australiaServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function exportAuthUsers() {
  try {
    console.log('Connecting to Australia Supabase...')

    // Fetch all auth users using admin API
    const { data: authUsers, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Error fetching auth users:', error)
      throw error
    }

    console.log(`\n✓ Found ${authUsers.users.length} auth users`)

    // Export user data
    const usersToExport = authUsers.users.map(user => ({
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      phone: user.phone,
      phone_confirmed_at: user.phone_confirmed_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_sign_in_at: user.last_sign_in_at,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata,
      // Note: We cannot export encrypted passwords for security reasons
      // Users will need to reset passwords or we'll create temporary ones
    }))

    console.log('\nAuth Users to export:')
    usersToExport.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (ID: ${user.id})`)
    })

    // Write to file
    const fs = require('fs')
    fs.writeFileSync(
      './scripts/auth-users-backup.json',
      JSON.stringify(usersToExport, null, 2)
    )

    console.log('\n✅ Auth users exported successfully to scripts/auth-users-backup.json')
    console.log('\nNote: Passwords cannot be exported for security reasons.')
    console.log('Options:')
    console.log('1. Ask users to reset their passwords after migration')
    console.log('2. Create temporary passwords and send reset links')

  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

exportAuthUsers()
