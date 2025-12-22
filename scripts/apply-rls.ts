import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

async function applyRLS() {
    console.log('🔒 Setting up Row Level Security policies...\n')

    const sql = readFileSync(resolve(__dirname, 'setup-rls.sql'), 'utf-8')
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(s => s.trim().length > 0)

    for (const statement of statements) {
        const trimmed = statement.trim()
        if (!trimmed) continue

        try {
            const { error } = await supabaseAdmin.rpc('exec_sql', { sql_query: trimmed })
            
            if (error) {
                console.error('❌ Error executing SQL:', error.message)
                console.error('Statement:', trimmed.substring(0, 100) + '...')
            } else {
                console.log('✅ Executed:', trimmed.substring(0, 80) + '...')
            }
        } catch (err: any) {
            console.error('💥 Exception:', err.message)
        }
    }

    console.log('\n✨ RLS setup complete!\n')
}

applyRLS().then(() => process.exit(0)).catch(err => {
    console.error(err)
    process.exit(1)
})
