import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with connection pool limits for serverless
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
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
