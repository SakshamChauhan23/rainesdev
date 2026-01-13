import { logger } from '@/lib/logger'

import { NextRequest, NextResponse } from 'next/server'
import { getUserWithRole } from '@/lib/user-sync'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const user = await getUserWithRole(userId)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ role: user.role })
    } catch (error) {
        logger.error('Error fetching user role:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
