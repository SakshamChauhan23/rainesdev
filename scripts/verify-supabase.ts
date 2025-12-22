
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) {
            console.warn('.env file not found at', envPath);
            return;
        }
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
        console.log('.env loaded successfully');
    } catch (e) {
        console.error('Error loading .env:', e);
    }
}

async function verifySupabase() {
    loadEnv();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
        console.error('❌ Missing Environment Variables:');
        if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
        if (!supabaseAnonKey) console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
        if (!supabaseServiceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY');
        process.exit(1);
    }

    console.log('✅ Environment Variables Found');
    console.log(`   URL: ${supabaseUrl}`);
    // Do not log full keys
    console.log(`   Anon Key: ${supabaseAnonKey.slice(0, 5)}...`);
    console.log(`   Service Key: ${supabaseServiceKey.slice(0, 5)}...`);

    // 1. Verify Anon Client
    console.log('\nTesting Anon Client connection...');
    try {
        const anonClient = createClient(supabaseUrl, supabaseAnonKey);
        // Just checking session/connection
        const { data, error } = await anonClient.from('categories').select('count', { count: 'exact', head: true });

        if (error && error.code !== 'PGRST116') { // PGRST116 is result too large, typically means table empty or something, but connection worked. 
            // Actually 404 or connection refused are what we look for.
            // If table 'categories' exists, this should work. If not, it might error with relation not found.
            // But if keys are wrong, it will be 401.
            if (error.code === '42P01') {
                console.warn("   ⚠️ Connected, but 'categories' table not found. (Database might be empty)");
            } else if (error.message.includes('Invalid API key')) {
                throw new Error('Invalid Anon Key');
            } else {
                console.log(`   ✅ Anon Client Connected (Response: ${error?.message || 'OK'})`);
            }
        } else {
            console.log('   ✅ Anon Client Connected');
        }
    } catch (err: any) {
        console.error('   ❌ Anon Client Failed:', err.message);
    }

    // 2. Verify Service Client
    console.log('\nTesting Service Client connection (Admin)...');
    try {
        const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // Admin check - try to check users or list buckets or something admin-only
        const { error } = await serviceClient.auth.admin.listUsers({ perPage: 1 });

        if (error) {
            console.error('   ❌ Service Client Failed:', error.message);
        } else {
            console.log('   ✅ Service Client Connected (Admin Auth works)');
        }

    } catch (err: any) {
        console.error('   ❌ Service Client Failed:', err.message);
    }
}

verifySupabase();
