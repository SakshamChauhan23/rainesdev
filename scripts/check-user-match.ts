import { createClient } from '@supabase/supabase-js'
import { prisma } from '../src/lib/prisma'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function checkUserMatch(email: string) {
    console.log(`\n🔍 Checking user match for: ${email}\n`)

    // Get Supabase Auth user
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = authData.users.find(u => u.email === email)

    // Get Prisma user
    const prismaUser = await prisma.user.findUnique({
        where: { email }
    })

    console.log('Supabase Auth User:')
    console.log('  ID:', authUser?.id)
    console.log('  Email:', authUser?.email)
    console.log('')
    console.log('Prisma Database User:')
    console.log('  ID:', prismaUser?.id)
    console.log('  Email:', prismaUser?.email)
    console.log('')

    if (authUser?.id === prismaUser?.id) {
        console.log('✅ IDs MATCH! Everything is correct.')
    } else {
        console.log('❌ IDs DO NOT MATCH!')
        console.log('   This will cause foreign key errors.')
        console.log('   Supabase expects:', authUser?.id)
        console.log('   Prisma has:', prismaUser?.id)
    }

    await prisma.$disconnect()
}

checkUserMatch('sakshamchauhan23@gmail.com').catch(console.error)
