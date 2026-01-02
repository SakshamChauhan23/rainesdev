import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function grantAdminAccess(email: string) {
  try {
    console.log(`\n🔍 Searching for user: ${email}`)

    // Query the database directly using Supabase
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (fetchError || !user) {
      console.log(`\n❌ User not found with email: ${email}`)
      console.log('\n💡 The user needs to sign up on the platform first.')
      console.log('   1. Go to https://hireyourai.netlify.app')
      console.log('   2. Sign up with this email')
      console.log('   3. Then run this script again')

      // Show all users for debugging
      const { data: allUsers } = await supabase
        .from('users')
        .select('id, email, name, role')

      if (allUsers && allUsers.length > 0) {
        console.log('\n📋 Current users in database:')
        allUsers.forEach(u => {
          console.log(`   - ${u.email} (${u.role})`)
        })
      }
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

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ role: 'ADMIN' })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error(`\n❌ Error updating user:`, updateError)
      return
    }

    console.log(`\n✅ Successfully granted ADMIN access!`)
    console.log(`   Name: ${updatedUser.name}`)
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   New Role: ${updatedUser.role}`)
    console.log(`\n🎉 ${email} now has admin access to the platform!`)

  } catch (error) {
    console.error('\n❌ Error:', error)
  }
}

// Get email from command line argument or use default
const email = process.argv[2] || 'sal@rainesdev.ai'

grantAdminAccess(email)
