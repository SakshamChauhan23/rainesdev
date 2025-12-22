
import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Manual .env parser 
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
    } catch (e) { console.error(e); }
}

async function dropAllTables() {
    loadEnv();
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('No DATABASE_URL');
        process.exit(1);
    }

    const client = new pg.Client({ connectionString: dbUrl });

    try {
        await client.connect();
        console.log('Connected. Dropping public schema...');

        // Drop and recreate public schema to wipe everything
        await client.query('DROP SCHEMA public CASCADE;');
        await client.query('CREATE SCHEMA public;');
        await client.query('GRANT ALL ON SCHEMA public TO postgres;');
        await client.query('GRANT ALL ON SCHEMA public TO public;');

        console.log('✅ Public schema wiped and recreated.');

        await client.end();
    } catch (err: any) {
        console.error('❌ Failed:', err.message);
    }
}

dropAllTables();
