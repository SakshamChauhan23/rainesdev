import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

async function checkUser(email: string) {
    console.log(`\n🔍 Checking for user: ${email}\n`)

    // Check in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
        console.error('❌ Error fetching auth users:', authError.message)
        return
    }

    const authUser = authData.users.find(u => u.email === email)

    if (authUser) {
        console.log('✅ User found in Supabase Auth:')
        console.log('   - ID:', authUser.id)
        console.log('   - Email:', authUser.email)
        console.log('   - Email Confirmed:', authUser.email_confirmed_at ? '✅ Yes' : '❌ No (needs email verification)')
        console.log('   - Created At:', authUser.created_at)
        console.log('   - Last Sign In:', authUser.last_sign_in_at || 'Never')
        console.log('   - Phone:', authUser.phone || 'Not set')
    } else {
        console.log('❌ User NOT found in Supabase Auth')
        console.log('   This user has not signed up yet.')
    }

    console.log('\n' + '='.repeat(60) + '\n')
}

const emailToCheck = process.argv[2] || 'sakshamchauhan23@gmail.com'
checkUser(emailToCheck).then(() => {
    console.log('✨ Check complete!\n')
    process.exit(0)
}).catch((error) => {
    console.error('💥 Error:', error)
    process.exit(1)
})
