import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with optimized connection pool settings for VPS deployment
const createPrismaClient = () => {
  // Build connection URL with pooling parameters if not already present
  let databaseUrl = process.env.DATABASE_URL || ''

  // Add connection pooling parameters for VPS performance
  // These can be overridden by setting them directly in DATABASE_URL
  if (databaseUrl && !databaseUrl.includes('connection_limit')) {
    const separator = databaseUrl.includes('?') ? '&' : '?'
    databaseUrl = `${databaseUrl}${separator}connection_limit=10&pool_timeout=20`
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })
}

// Use singleton pattern to prevent connection exhaustion
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Always cache globally (both dev and production)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}
