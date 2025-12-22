
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Cache categories for 5 minutes
export const revalidate = 300
// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

export async function GET() {
  const startTime = Date.now()

  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    const queryTime = Date.now() - startTime
    console.log(`[Categories API] Query completed in ${queryTime}ms`)

    const response = NextResponse.json({ success: true, data: categories })

    // Add cache headers for CDN/browser caching
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

    return response
  } catch (error) {
    console.error('[Categories API] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}
