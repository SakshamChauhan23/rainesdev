import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Optimized for serverless/edge environments
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Optimize for serverless - shorter connection timeout
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

// Cache the Prisma client globally in non-production
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
