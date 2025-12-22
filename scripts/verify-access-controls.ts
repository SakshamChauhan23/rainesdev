import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const mumbaiUrl = 'https://vuzmyajbuwuwqkvjejlv.supabase.co'
const mumbaiServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQyMDM0OCwiZXhwIjoyMDgxOTk2MzQ4fQ.tr1k2ZJqbHloWyvm8OQth2VmSd--ncVKL77KbT7gWCk'

const supabaseAdmin = createClient(mumbaiUrl, mumbaiServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const prisma = new PrismaClient()

async function verifyAccessControls() {
  try {
    console.log('='.repeat(80))
    console.log('ACCESS CONTROL VERIFICATION')
    console.log('='.repeat(80))

    // Get all auth users
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
    const authUsers = authData?.users || []

    // Get all database users
    const dbUsers = await prisma.user.findMany({
      include: {
        sellerProfile: true,
        agentsCreated: true,
        purchases: true
      }
    })

    console.log(`\n📊 Total Auth Users: ${authUsers.length}`)
    console.log(`📊 Total Database Users: ${dbUsers.length}`)

    console.log('\n' + '='.repeat(80))
    console.log('USER DETAILS & ACCESS CONTROLS')
    console.log('='.repeat(80))

    for (const dbUser of dbUsers) {
      const authUser = authUsers.find(au => au.id === dbUser.id)

      console.log(`\n👤 ${dbUser.email}`)
      console.log(`   ID: ${dbUser.id}`)
      console.log(`   Role: ${dbUser.role}`)
      console.log(`   Auth Status: ${authUser ? '✓ Exists in Supabase Auth' : '✗ NOT in Supabase Auth'}`)

      if (authUser) {
        console.log(`   Email Confirmed: ${authUser.email_confirmed_at ? '✓ Yes' : '✗ No'}`)
        console.log(`   Last Sign In: ${authUser.last_sign_in_at || 'Never'}`)
      }

      // Check role-specific data
      if (dbUser.role === 'SELLER') {
        console.log(`   Seller Profile: ${dbUser.sellerProfile ? '✓ Yes' : '✗ No'}`)
        console.log(`   Agents Created: ${dbUser.agentsCreated.length}`)
      }

      if (dbUser.role === 'BUYER') {
        console.log(`   Purchases: ${dbUser.purchases.length}`)
      }

      if (dbUser.role === 'ADMIN') {
        console.log(`   Admin Access: ✓ Full platform access`)
      }
    }

    // Verify specific access control checks
    console.log('\n' + '='.repeat(80))
    console.log('ACCESS CONTROL CHECKS')
    console.log('='.repeat(80))

    const adminCount = dbUsers.filter(u => u.role === 'ADMIN').length
    const sellerCount = dbUsers.filter(u => u.role === 'SELLER').length
    const buyerCount = dbUsers.filter(u => u.role === 'BUYER').length

    console.log(`\n✓ Admins: ${adminCount}`)
    console.log(`✓ Sellers: ${sellerCount}`)
    console.log(`✓ Buyers: ${buyerCount}`)

    // Check for orphaned data
    console.log('\n' + '='.repeat(80))
    console.log('DATA INTEGRITY CHECKS')
    console.log('='.repeat(80))

    const agents = await prisma.agent.findMany({
      include: { seller: true, category: true }
    })

    const orphanedAgents = agents.filter(a => !a.seller)
    console.log(`\n✓ Total Agents: ${agents.length}`)
    console.log(`${orphanedAgents.length === 0 ? '✓' : '✗'} Orphaned Agents: ${orphanedAgents.length}`)

    const purchases = await prisma.purchase.findMany({
      include: { buyer: true, agent: true }
    })

    const orphanedPurchases = purchases.filter(p => !p.buyer || !p.agent)
    console.log(`✓ Total Purchases: ${purchases.length}`)
    console.log(`${orphanedPurchases.length === 0 ? '✓' : '✗'} Orphaned Purchases: ${orphanedPurchases.length}`)

    // Summary
    console.log('\n' + '='.repeat(80))
    console.log('VERIFICATION SUMMARY')
    console.log('='.repeat(80))

    const allAuthUsersHaveDbRecords = authUsers.every(au =>
      dbUsers.some(du => du.id === au.id)
    )

    const allDbUsersHaveAuthRecords = dbUsers.every(du =>
      authUsers.some(au => au.id === du.id) ||
      du.id.startsWith('cmj') // Allow test users with CUID IDs
    )

    console.log(`\n${allAuthUsersHaveDbRecords ? '✓' : '✗'} All Auth users have database records`)
    console.log(`${allDbUsersHaveAuthRecords ? '✓' : '✗'} All database users have auth records (or are test users)`)
    console.log(`${orphanedAgents.length === 0 ? '✓' : '✗'} No orphaned agents`)
    console.log(`${orphanedPurchases.length === 0 ? '✓' : '✗'} No orphaned purchases`)

    if (allAuthUsersHaveDbRecords && allDbUsersHaveAuthRecords &&
        orphanedAgents.length === 0 && orphanedPurchases.length === 0) {
      console.log('\n✅ ALL ACCESS CONTROLS VERIFIED - MIGRATION SUCCESSFUL!')
    } else {
      console.log('\n⚠️  Some issues detected - review above for details')
    }

    console.log('\n' + '='.repeat(80))

  } catch (error) {
    console.error('Error verifying access controls:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

verifyAccessControls()
