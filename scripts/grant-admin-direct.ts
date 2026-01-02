import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const prisma = new PrismaClient()

async function grantAdminAccess(email: string) {
  try {
    console.log(`\n🔍 Searching for user: ${email}`)

    // First, check if user exists in Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('❌ Auth error:', authError)
      return
    }

    const authUser = authUsers.users.find(u => u.email === email)

    if (!authUser) {
      console.log(`\n❌ User not found in Supabase Auth: ${email}`)
      console.log('\n💡 The user needs to sign up first.')
      return
    }

    console.log(`\n✅ Found user in Supabase Auth`)
    console.log(`   Email: ${authUser.email}`)
    console.log(`   Auth ID: ${authUser.id}`)

    // Check if user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { id: authUser.id }
    })

    if (!dbUser) {
      console.log(`\n⚠️  User exists in Auth but not in database. Creating user record...`)

      // Create user in database
      dbUser = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
          role: 'ADMIN' // Create directly as ADMIN
        }
      })

      console.log(`\n✅ Created user in database with ADMIN role`)
      console.log(`   Name: ${dbUser.name}`)
      console.log(`   Email: ${dbUser.email}`)
      console.log(`   Role: ${dbUser.role}`)
      console.log(`\n🎉 ${email} now has admin access!`)
      return
    }

    // User exists in database
    if (dbUser.role === 'ADMIN') {
      console.log(`\n✅ User is already an ADMIN`)
      console.log(`   Name: ${dbUser.name}`)
      console.log(`   Email: ${dbUser.email}`)
      console.log(`   Role: ${dbUser.role}`)
      return
    }

    console.log(`\n👤 Found user in database:`)
    console.log(`   Name: ${dbUser.name}`)
    console.log(`   Email: ${dbUser.email}`)
    console.log(`   Current Role: ${dbUser.role}`)

    console.log(`\n⬆️  Upgrading to ADMIN...`)

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
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

const email = process.argv[2] || 'sal@rainesdev.ai'
grantAdminAccess(email)
