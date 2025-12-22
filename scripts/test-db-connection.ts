
import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Manual .env parser (since we can't rely on dotenv flow if it's failing)
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.error('Error loading .env:', e);
    }
}

async function testConnection() {
    loadEnv();

    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        console.error('❌ DATABASE_URL is missing in .env');
        return;
    }

    // Mask password for logging
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`Checking connection to: ${maskedUrl}`);

    // Parse host to check DNS resolution specifically
    try {
        const match = dbUrl.match(/@([^:/]+)/);
        if (match) {
            const host = match[1];
            console.log(`Target Host: ${host}`);
        }
    } catch (e) { }

    const client = new pg.Client({
        connectionString: dbUrl,
        connectionTimeoutMillis: 5000,
    });

    try {
        console.log('Attempting to connect...');
        await client.connect();
        console.log('✅ Success! Connected to Postgres database.');
        const res = await client.query('SELECT NOW()');
        console.log('   Database Time:', res.rows[0].now);

        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('\nExisting Tables:', tables.rows.map(r => r.table_name));

        await client.end();
    } catch (err: any) {
        console.error('❌ Connection Failed:', err.message);
        if (err.code) console.error('   Code:', err.code);
        if (err.address) console.error('   Address:', err.address);
        if (err.port) console.error('   Port:', err.port);

        console.log('\nTroubleshooting Tips:');
        if (err.message.includes('getaddrinfo')) {
            console.log('   -> Hostname could not be resolved. Check if the URL is correct.');
            console.log('   -> Supabase pooler URLs often look like: aws-0-us-east-1.pooler.supabase.com');
        } else if (err.message.includes('password authentication failed')) {
            console.log('   -> Password is incorrect.');
            console.log('   -> If your password has special characters, ensure they are URL encoded.');
        } else if (err.message.includes('timeout')) {
            console.log('   -> Connection timed out. Check firewall or if port 5432/6543 is blocked.');
        }
    }
}

testConnection();
