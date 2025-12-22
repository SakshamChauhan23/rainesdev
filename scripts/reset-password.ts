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

async function resetPassword(email: string, newPassword: string) {
    console.log(`\n🔐 Resetting password for: ${email}\n`)

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        '7522627a-ee5b-44b2-b3b7-6fea85456913',
        { password: newPassword }
    )

    if (error) {
        console.error('❌ Error resetting password:', error.message)
        return
    }

    console.log('✅ Password reset successfully!')
    console.log('   New password:', newPassword)
    console.log('   You can now login with this password.\n')
}

const email = 'sakshamchauhan23@gmail.com'
const newPassword = 'TestPassword123!'

resetPassword(email, newPassword).then(() => {
    console.log('✨ Done!\n')
    process.exit(0)
}).catch((error) => {
    console.error('💥 Error:', error)
    process.exit(1)
})
