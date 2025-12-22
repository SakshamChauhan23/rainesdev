import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Note: User authentication is handled by Supabase Auth
  // Users must be created through Supabase, then synced to Prisma DB
  // This seed file only creates categories and other non-auth data

  console.log('⚠️  Users must be created via Supabase Auth (signup flow)')

  // Create Categories
  const categories = [
    {
      name: 'Customer Support',
      slug: 'customer-support',
      description: 'AI agents that automate customer service and support workflows',
      displayOrder: 1,
    },
    {
      name: 'Sales & Marketing',
      slug: 'sales-marketing',
      description: 'Agents for lead generation, email campaigns, and sales automation',
      displayOrder: 2,
    },
    {
      name: 'Data Analysis',
      slug: 'data-analysis',
      description: 'Intelligent agents for data processing, analysis, and reporting',
      displayOrder: 3,
    },
    {
      name: 'Content Creation',
      slug: 'content-creation',
      description: 'AI-powered content writing, editing, and optimization agents',
      displayOrder: 4,
    },
    {
      name: 'Development Tools',
      slug: 'development-tools',
      description: 'Coding assistants, code review, and development automation agents',
      displayOrder: 5,
    },
    {
      name: 'Productivity',
      slug: 'productivity',
      description: 'Task automation, scheduling, and workflow optimization agents',
      displayOrder: 6,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log('✅ Categories created')

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('📝 To create users:')
  console.log('   1. Use the /signup page in the application')
  console.log('   2. Or create users directly in Supabase Auth dashboard')
  console.log('   3. Users will be automatically synced to the database on signup')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
