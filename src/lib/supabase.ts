
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Supabase client for client-side (browser) - uses SSR-compatible client with cookie storage
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
