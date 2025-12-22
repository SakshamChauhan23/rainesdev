import pkg from 'pg'
const { Client } = pkg
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })

const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

async function checkRLS() {
    await client.connect()
    console.log('🔍 Checking RLS status on all tables...\n')

    const result = await client.query(`
        SELECT 
            schemaname,
            tablename,
            rowsecurity
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN ('users', 'seller_profiles', 'categories', 'agents', 'purchases', 'support_requests', 'reviews', 'admin_logs')
        ORDER BY tablename;
    `)

    console.log('Table                  | RLS Enabled')
    console.log('──────────────────────────────────────────────────')
    
    for (const row of result.rows) {
        const status = row.rowsecurity ? '🔒 YES' : '🔓 NO'
        const tableName = String(row.tablename).padEnd(22)
        console.log(tableName + ' | ' + status)
    }

    await client.end()
    console.log('\n')
}

checkRLS().catch(console.error)
