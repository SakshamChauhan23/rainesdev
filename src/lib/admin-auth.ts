import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
        redirect('/login?next=/admin')
    }

    // Check if user has admin role
    // Note: You'll need to ensure the user.role field is accessible
    // This might require customizing your Supabase auth or using metadata
    const userRole = (user as any).user_metadata?.role || (user as any).role

    if (userRole !== 'ADMIN') {
        redirect('/403') // Unauthorized page
    }

    return user
}
