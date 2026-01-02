import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function grantAdminAccess(email: string) {
  try {
    console.log(`\n🔍 Searching for user: ${email}`)

    // Get user from Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('❌ Auth error:', authError)
      return
    }

    const authUser = authUsers.users.find(u => u.email === email)

    if (!authUser) {
      console.log(`\n❌ User not found: ${email}`)
      console.log('\n💡 The user needs to sign up first.')
      return
    }

    console.log(`\n✅ Found user in Supabase Auth`)
    console.log(`   Email: ${authUser.email}`)
    console.log(`   Auth ID: ${authUser.id}`)

    // Use raw SQL to check and update user
    const { data: existingUser, error: checkError } = await supabase
      .rpc('grant_admin_access', {
        user_id: authUser.id,
        user_email: authUser.email!,
        user_name: authUser.user_metadata?.name || authUser.email!.split('@')[0]
      })

    if (checkError) {
      // Function doesn't exist, use direct table access with service role
      console.log('\n⚙️  Using direct database access...')

      // Check if user exists
      const { data: users, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .limit(1)

      if (selectError) {
        console.error('❌ Database error:', selectError)
        console.log('\n💡 Try running this SQL directly in Supabase SQL Editor:')
        console.log(`
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
VALUES (
  '${authUser.id}',
  '${authUser.email}',
  '${authUser.user_metadata?.name || authUser.email!.split('@')[0]}',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (id)
DO UPDATE SET role = 'ADMIN', updated_at = NOW()
RETURNING *;
        `)
        return
      }

      const user = users?.[0]

      if (!user) {
        // Create user
        console.log('\n⚠️  User not in database. Creating with ADMIN role...')
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
            role: 'ADMIN'
          })
          .select()
          .single()

        if (insertError) {
          console.error('❌ Insert error:', insertError)
          console.log('\n💡 Try the SQL query shown above in Supabase SQL Editor')
          return
        }

        console.log(`\n✅ Created user with ADMIN role!`)
        console.log(`   Name: ${newUser.name}`)
        console.log(`   Email: ${newUser.email}`)
        console.log(`   Role: ${newUser.role}`)
        console.log(`\n🎉 ${email} now has admin access!`)
        return
      }

      if (user.role === 'ADMIN') {
        console.log(`\n✅ User is already an ADMIN`)
        console.log(`   Name: ${user.name}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Role: ${user.role}`)
        return
      }

      // Update to ADMIN
      console.log(`\n⬆️  Upgrading ${user.role} to ADMIN...`)
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ role: 'ADMIN' })
        .eq('id', authUser.id)
        .select()
        .single()

      if (updateError) {
        console.error('❌ Update error:', updateError)
        return
      }

      console.log(`\n✅ Successfully granted ADMIN access!`)
      console.log(`   Name: ${updatedUser.name}`)
      console.log(`   Email: ${updatedUser.email}`)
      console.log(`   Role: ${updatedUser.role}`)
      console.log(`\n🎉 ${email} now has admin access!`)
    }

  } catch (error) {
    console.error('\n❌ Error:', error)
  }
}

const email = process.argv[2] || 'sal@rainesdev.ai'
grantAdminAccess(email)
