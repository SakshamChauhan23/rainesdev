import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up test agents...\n')

  // Get or create seller profile for admin
  const admin = await prisma.user.findUnique({
    where: { email: 'sakshamchauhan23@gmail.com' },
    include: { sellerProfile: true }
  })

  if (!admin) {
    console.error('❌ Admin user not found')
    return
  }

  let sellerProfile = admin.sellerProfile

  if (!sellerProfile) {
    console.log('Creating seller profile for admin...')
    sellerProfile = await prisma.sellerProfile.create({
      data: {
        userId: admin.id,
        portfolioUrlSlug: 'saksham-chauhan',
        bio: 'Full-stack developer and AI automation expert',
        verificationStatus: 'VERIFIED',
      }
    })
    console.log('✓ Seller profile created\n')
  } else {
    console.log('✓ Seller profile already exists\n')
  }

  // Get categories
  const categories = await prisma.category.findMany()
  if (categories.length === 0) {
    console.error('❌ No categories found. Run seed script first.')
    return
  }

  console.log('Creating test agents...\n')

  // Agent 1: The Supplier Watchdog
  const agent1 = await prisma.agent.create({
    data: {
      title: 'The Supplier Watchdog',
      slug: 'the-supplier-watchdog',
      shortDescription: 'Monitor supplier performance and get real-time alerts on delivery issues',
      workflowOverview: 'This AI agent continuously monitors your supplier network, tracking delivery times, quality metrics, and pricing changes. It automatically flags anomalies and sends alerts when intervention is needed.',
      useCase: 'Perfect for procurement teams managing multiple suppliers who need to maintain visibility over their supply chain without manual tracking.',
      setupGuide: `# Setup Guide

## Prerequisites
- Access to your supplier management system or ERP
- List of critical suppliers to monitor
- Alert notification preferences (email, Slack, etc.)

## Step 1: Connect Your Data Sources
1. Integrate with your supplier management system
2. Configure API credentials
3. Test the connection

## Step 2: Configure Monitoring Rules
1. Set delivery time thresholds
2. Define quality score criteria
3. Configure price change alerts

## Step 3: Set Up Notifications
1. Choose notification channels
2. Set alert frequency
3. Define escalation rules

## Step 4: Start Monitoring
The agent will begin monitoring automatically and send alerts based on your configured rules.`,
      price: 49.99,
      version: 1,
      status: 'APPROVED',
      categoryId: categories.find(c => c.slug === 'productivity')?.id || categories[0].id,
      sellerId: admin.id,
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/placeholder-agent.jpg',
      assistedSetupEnabled: true,
      assistedSetupPrice: 25.00,
    }
  })
  console.log(`✓ Created: ${agent1.title}`)

  // Agent 2: Email Campaign Automator
  const agent2 = await prisma.agent.create({
    data: {
      title: 'Email Campaign Automator',
      slug: 'email-campaign-automator',
      shortDescription: 'Automate personalized email campaigns based on customer behavior and engagement',
      workflowOverview: 'This agent analyzes customer interactions and automatically sends personalized follow-up emails at optimal times. It segments audiences, A/B tests subject lines, and optimizes send times for maximum engagement.',
      useCase: 'Ideal for marketing teams running email campaigns who want to increase open rates and conversions through intelligent automation.',
      setupGuide: `# Setup Guide

## Prerequisites
- Email marketing platform account (MailChimp, SendGrid, etc.)
- Customer database or CRM access
- Email templates ready

## Step 1: Connect Email Platform
1. Add your email service API key
2. Verify domain authentication
3. Import email templates

## Step 2: Configure Audience Segments
1. Define customer segments
2. Set behavior triggers
3. Create personalization rules

## Step 3: Set Up Campaign Rules
1. Define email sequences
2. Configure send time optimization
3. Set up A/B testing parameters

## Step 4: Launch Campaigns
Review your settings and activate the automation. The agent will handle the rest!`,
      price: 79.99,
      version: 1,
      status: 'APPROVED',
      categoryId: categories.find(c => c.slug === 'sales-marketing')?.id || categories[1].id,
      sellerId: admin.id,
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/placeholder-agent.jpg',
      assistedSetupEnabled: true,
      assistedSetupPrice: 35.00,
    }
  })
  console.log(`✓ Created: ${agent2.title}`)

  // Agent 3: Customer Support Chatbot
  const agent3 = await prisma.agent.create({
    data: {
      title: 'Smart Customer Support Assistant',
      slug: 'smart-customer-support-assistant',
      shortDescription: 'AI-powered chatbot that handles customer inquiries 24/7 with human-like responses',
      workflowOverview: 'This intelligent chatbot understands customer questions, searches your knowledge base, and provides accurate answers instantly. It escalates complex issues to human agents and learns from every interaction.',
      useCase: 'Perfect for customer support teams looking to reduce response times and handle high volumes of common questions automatically.',
      setupGuide: `# Setup Guide

## Prerequisites
- Knowledge base or FAQ documentation
- Customer support platform (Zendesk, Intercom, etc.)
- Integration credentials

## Step 1: Train Your Chatbot
1. Upload knowledge base articles
2. Add FAQ content
3. Train on past support tickets

## Step 2: Configure Behavior
1. Set response tone and style
2. Define escalation rules
3. Configure business hours

## Step 3: Integrate Support Platform
1. Connect to your support tool
2. Set up routing rules
3. Test the integration

## Step 4: Go Live
Activate the chatbot and monitor performance. It will improve over time!`,
      price: 99.99,
      version: 1,
      status: 'APPROVED',
      categoryId: categories.find(c => c.slug === 'customer-support')?.id || categories[0].id,
      sellerId: admin.id,
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/placeholder-agent.jpg',
      assistedSetupEnabled: false, // This one without assisted setup for variety
      assistedSetupPrice: 0,
    }
  })
  console.log(`✓ Created: ${agent3.title}`)

  // Agent 4: Data Analysis Dashboard
  const agent4 = await prisma.agent.create({
    data: {
      title: 'Automated Data Insights Dashboard',
      slug: 'automated-data-insights-dashboard',
      shortDescription: 'Transform raw data into actionable insights with AI-powered analytics and visualizations',
      workflowOverview: 'This agent connects to your data sources, automatically identifies trends and patterns, and generates visual dashboards with key insights. It sends weekly reports and alerts you to significant changes.',
      useCase: 'Essential for business analysts and decision-makers who need quick insights from complex datasets without manual analysis.',
      setupGuide: `# Setup Guide

## Prerequisites
- Database or data warehouse access
- List of key metrics to track
- Dashboard requirements

## Step 1: Connect Data Sources
1. Add database credentials
2. Configure data refresh schedule
3. Test connection

## Step 2: Define Metrics
1. Select KPIs to track
2. Set up calculations
3. Configure thresholds

## Step 3: Design Dashboard
1. Choose visualization types
2. Arrange layout
3. Set up filters

## Step 4: Schedule Reports
Configure automated reports and start tracking your metrics!`,
      price: 129.99,
      version: 1,
      status: 'APPROVED',
      categoryId: categories.find(c => c.slug === 'data-analysis')?.id || categories[2].id,
      sellerId: admin.id,
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/placeholder-agent.jpg',
      assistedSetupEnabled: true,
      assistedSetupPrice: 50.00,
    }
  })
  console.log(`✓ Created: ${agent4.title}\n`)

  console.log('═══════════════════════════════════════')
  console.log('✅ Test agents created successfully!')
  console.log('═══════════════════════════════════════')
  console.log(`Total agents: 4`)
  console.log(`Seller: ${admin.email}`)
  console.log(`With assisted setup: 3`)
  console.log(`Without assisted setup: 1`)
  console.log('═══════════════════════════════════════\n')
  console.log('You can now:')
  console.log('1. View agents at http://localhost:3000/agents')
  console.log('2. Configure assisted setup as admin')
  console.log('3. Test purchase flow as a buyer')
  console.log('4. Manage setup requests at /admin/setup-requests\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error creating test agents:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
