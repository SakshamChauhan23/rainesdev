import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
    const email = 'sakshamchauhan23@gmail.com'
    const password = 'TestPassword123!'

    console.log('🔐 Testing login...\n')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('')

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('❌ Login failed!')
        console.error('Error:', error.message)
        console.error('Status:', error.status)
        console.error('Details:', error)
        return
    }

    console.log('✅ Login successful!\n')
    console.log('User ID:', data.user?.id)
    console.log('Email:', data.user?.email)
    console.log('Session expires at:', data.session?.expires_at)
    console.log('Access token (first 50 chars):', data.session?.access_token?.substring(0, 50) + '...')
    console.log('\n✨ Authentication is working!\n')
}

testLogin().catch(console.error)
