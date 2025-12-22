import pkg from 'pg'
const { Client } = pkg
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })

const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

async function disableRLS() {
    await client.connect()
    console.log('🔓 Disabling Row Level Security on all tables...\n')

    const tables = [
        'users',
        'seller_profiles',
        'categories',
        'agents',
        'purchases',
        'support_requests',
        'reviews',
        'admin_logs'
    ]

    for (const table of tables) {
        try {
            await client.query(`ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`)
            console.log(`✅ Disabled RLS on: ${table}`)
        } catch (err: any) {
            console.log(`⚠️  ${table}: ${err.message}`)
        }
    }

    await client.end()
    console.log('\n✨ Done! RLS disabled on all tables.\n')
}

disableRLS().catch(console.error)
