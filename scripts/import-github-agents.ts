/**
 * Import AI Agents from CSV with GitHub URLs
 *
 * This script reads a CSV file with agent information including GitHub URLs,
 * fetches the README from each repository, and creates agents in the database.
 *
 * Usage:
 *   npx tsx scripts/import-github-agents.ts
 *
 * Options:
 *   --dry-run    Preview without making changes
 *   --limit=N    Only process first N agents
 */

import { PrismaClient, AgentStatus } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Map CSV categories to URL slugs
const CATEGORY_MAP: Record<string, { name: string; slug: string; description: string }> = {
  'Customer Support': {
    name: 'Customer Support',
    slug: 'customer-support',
    description: 'AI agents that automate customer service and support workflows',
  },
  'Appointment Booking': {
    name: 'Appointment Booking',
    slug: 'appointment-booking',
    description: 'AI agents for scheduling, calendar management, and booking automation',
  },
  'Sales & SDR': {
    name: 'Sales & SDR',
    slug: 'sales-sdr',
    description: 'AI sales development representatives and lead generation agents',
  },
  'Invoice Processing': {
    name: 'Invoice Processing',
    slug: 'invoice-processing',
    description: 'AI agents for invoice extraction, OCR, and financial document processing',
  },
  Healthcare: {
    name: 'Healthcare',
    slug: 'healthcare',
    description: 'AI agents for healthcare scheduling, patient management, and medical workflows',
  },
  'Email Automation': {
    name: 'Email Automation',
    slug: 'email-automation',
    description: 'AI agents for email management, auto-responses, and inbox organization',
  },
  'Social Media': {
    name: 'Social Media',
    slug: 'social-media',
    description: 'AI agents for social media management, content scheduling, and engagement',
  },
  'Web Scraping': {
    name: 'Web Scraping',
    slug: 'web-scraping',
    description: 'AI-powered web scrapers and data extraction agents',
  },
  'Meeting Notes': {
    name: 'Meeting Notes',
    slug: 'meeting-notes',
    description: 'AI agents for meeting transcription, summarization, and action items',
  },
  'Knowledge Base': {
    name: 'Knowledge Base',
    slug: 'knowledge-base',
    description: 'AI-powered knowledge management and Q&A systems',
  },
  'HR & Recruiting': {
    name: 'HR & Recruiting',
    slug: 'hr-recruiting',
    description: 'AI agents for recruitment, job applications, and HR automation',
  },
  'Personal Assistant': {
    name: 'Personal Assistant',
    slug: 'personal-assistant',
    description: 'AI personal assistants for task management and daily workflows',
  },
  Finance: {
    name: 'Finance',
    slug: 'finance',
    description: 'AI agents for financial analysis, accounting, and expense tracking',
  },
  'Voice Agent': {
    name: 'Voice Agent',
    slug: 'voice-agent',
    description: 'Conversational voice AI agents for phone calls and voice interactions',
  },
  'E-commerce': {
    name: 'E-commerce',
    slug: 'e-commerce',
    description: 'AI agents for online stores, product recommendations, and shopping assistance',
  },
  'Real Estate': {
    name: 'Real Estate',
    slug: 'real-estate',
    description: 'AI agents for property search, real estate listings, and tenant management',
  },
  Travel: {
    name: 'Travel',
    slug: 'travel',
    description: 'AI agents for trip planning, itinerary generation, and travel booking',
  },
}

interface CSVAgent {
  category: string
  name: string
  githubUrl: string
  stars: string
  license: string
  useCase: string
  integrationEffort: string
  price: string
  priority: string
}

interface GitHubReadme {
  content: string
  description: string
}

function parseCSV(content: string): CSVAgent[] {
  const lines = content.split('\n')
  const agents: CSVAgent[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    if (values.length < 9) continue

    // Skip entries with "Search GitHub" or invalid URLs
    if (values[2].includes('Search GitHub') || !values[2].startsWith('https://github.com/')) {
      console.log(`  ⏭️  Skipping "${values[1]}" - invalid GitHub URL`)
      continue
    }

    agents.push({
      category: values[0],
      name: values[1],
      githubUrl: values[2],
      stars: values[3],
      license: values[4],
      useCase: values[5],
      integrationEffort: values[6],
      price: values[7],
      priority: values[8],
    })
  }

  return agents
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  values.push(current.trim())
  return values
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function parsePrice(priceStr: string): number {
  // Extract first number from price string like "$99-299/mo" -> 99
  const match = priceStr.match(/\$(\d+)/)
  return match ? parseInt(match[1]) : 99
}

async function fetchGitHubReadme(githubUrl: string): Promise<GitHubReadme | null> {
  try {
    // Extract owner/repo from URL
    const urlParts = githubUrl.replace('https://github.com/', '').split('/')
    if (urlParts.length < 2) return null

    const owner = urlParts[0]
    const repo = urlParts[1]

    // Fetch repo info for description
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Rouze-AI-Agent-Importer',
      },
    })

    let description = ''
    if (repoResponse.ok) {
      const repoData = await repoResponse.json()
      description = repoData.description || ''
    }

    // Fetch README
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Rouze-AI-Agent-Importer',
        },
      }
    )

    if (!readmeResponse.ok) {
      console.log(`    ⚠️  Could not fetch README for ${owner}/${repo}`)
      return { content: '', description }
    }

    const readmeData = await readmeResponse.json()
    const content = Buffer.from(readmeData.content, 'base64').toString('utf-8')

    return { content, description }
  } catch (error) {
    console.log(`    ⚠️  Error fetching README: ${error}`)
    return null
  }
}

function extractSetupGuide(readme: string, agentName: string): string {
  // Look for installation/setup sections
  const sections = [
    /#{1,3}\s*(?:Installation|Setup|Getting Started|Quick Start|How to (?:Install|Use|Run))[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|\n---|\n\*\*\*|$)/i,
    /#{1,3}\s*(?:Prerequisites|Requirements)[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|\n---|\n\*\*\*|$)/i,
  ]

  let setupContent = ''

  for (const regex of sections) {
    const match = readme.match(regex)
    if (match && match[1]) {
      setupContent += match[1].trim() + '\n\n'
    }
  }

  if (!setupContent) {
    // Generate a basic setup guide
    setupContent = `## Setup Guide for ${agentName}

### Prerequisites
- Node.js 18+ or Python 3.9+ (depending on the project)
- API keys for required services
- Docker (optional, for containerized deployment)

### Installation Steps
1. Clone the repository from GitHub
2. Install dependencies using npm/pip
3. Configure environment variables
4. Run the application

### Configuration
Please refer to the GitHub repository for detailed configuration options and environment variables.`
  }

  return setupContent.substring(0, 5000) // Limit length
}

function extractWorkflowOverview(readme: string, useCase: string, agentName: string): string {
  // Look for features/workflow sections
  const sections = [
    /#{1,3}\s*(?:Features|How it Works|Workflow|Architecture|Overview)[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|\n---|\n\*\*\*|$)/i,
  ]

  let workflowContent = ''

  for (const regex of sections) {
    const match = readme.match(regex)
    if (match && match[1]) {
      workflowContent = match[1].trim()
      break
    }
  }

  if (!workflowContent) {
    workflowContent = `${agentName} provides ${useCase}. This AI agent automates workflows and integrates with your existing tools to improve efficiency and productivity.`
  }

  return workflowContent.substring(0, 3000) // Limit length
}

function generateThumbnailUrl(category: string): string {
  // Generate Unsplash thumbnail based on category
  const categoryImages: Record<string, string> = {
    'Customer Support': 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&h=600&fit=crop',
    'Appointment Booking': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop',
    'Sales & SDR': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'Invoice Processing': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    Healthcare: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    'Email Automation': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop',
    'Social Media': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
    'Web Scraping': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    'Meeting Notes': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
    'Knowledge Base': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop',
    'HR & Recruiting': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
    'Personal Assistant': 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    Finance: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
    'Voice Agent': 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=600&fit=crop',
    'E-commerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    'Real Estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    Travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
  }

  return categoryImages[category] || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop'
}

async function ensureCategories(): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>()

  for (const [csvName, categoryData] of Object.entries(CATEGORY_MAP)) {
    const existing = await prisma.category.findUnique({
      where: { slug: categoryData.slug },
    })

    if (existing) {
      categoryMap.set(csvName, existing.id)
    } else {
      const created = await prisma.category.create({
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          displayOrder: Object.keys(CATEGORY_MAP).indexOf(csvName) + 10,
        },
      })
      categoryMap.set(csvName, created.id)
      console.log(`  ✅ Created category: ${categoryData.name}`)
    }
  }

  return categoryMap
}

async function findAdminSeller(): Promise<string | null> {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true },
  })
  return admin?.id || null
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const limitMatch = args.find(a => a.startsWith('--limit='))
  const limit = limitMatch ? parseInt(limitMatch.split('=')[1]) : undefined

  console.log('\n🚀 Starting GitHub Agent Import...\n')

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n')
  }

  // Read CSV file
  const csvPath = path.join(process.cwd(), 'All-Agents-List.csv')
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found: All-Agents-List.csv')
    process.exit(1)
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  let agents = parseCSV(csvContent)

  console.log(`📄 Found ${agents.length} valid agents to import\n`)

  if (limit) {
    agents = agents.slice(0, limit)
    console.log(`📊 Limited to first ${limit} agents\n`)
  }

  // Find admin user to be the seller
  const sellerId = await findAdminSeller()
  if (!sellerId) {
    console.error('❌ No admin user found. Please create an admin user first.')
    process.exit(1)
  }
  console.log(`👤 Using admin as seller\n`)

  // Ensure all categories exist
  console.log('📁 Ensuring categories exist...')
  const categoryMap = await ensureCategories()
  console.log(`  ✅ ${categoryMap.size} categories ready\n`)

  // Process each agent
  let success = 0
  let failed = 0
  let skipped = 0

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i]
    console.log(`\n[${i + 1}/${agents.length}] Processing: ${agent.name}`)

    // Check if agent already exists
    const existingSlug = slugify(agent.name)
    const existing = await prisma.agent.findFirst({
      where: {
        OR: [{ slug: existingSlug }, { title: agent.name }],
      },
    })

    if (existing) {
      console.log(`  ⏭️  Skipping - agent already exists`)
      skipped++
      continue
    }

    // Get category ID
    const categoryId = categoryMap.get(agent.category)
    if (!categoryId) {
      console.log(`  ❌ Category not found: ${agent.category}`)
      failed++
      continue
    }

    // Fetch GitHub README
    console.log(`  📥 Fetching README from GitHub...`)
    const readme = await fetchGitHubReadme(agent.githubUrl)

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))

    const readmeContent = readme?.content || ''
    const repoDescription = readme?.description || agent.useCase

    // Prepare agent data
    const agentData = {
      sellerId,
      categoryId,
      title: agent.name,
      slug: existingSlug,
      shortDescription: repoDescription.substring(0, 500) || agent.useCase.substring(0, 500),
      workflowOverview: extractWorkflowOverview(readmeContent, agent.useCase, agent.name),
      useCase: agent.useCase,
      setupGuide: extractSetupGuide(readmeContent, agent.name),
      price: parsePrice(agent.price),
      thumbnailUrl: generateThumbnailUrl(agent.category),
      status: 'APPROVED' as AgentStatus,
      approvedAt: new Date(),
      assistedSetupEnabled: true,
      assistedSetupPrice: 49,
      bookCallEnabled: true,
    }

    if (dryRun) {
      console.log(`  ✓ Would create: "${agent.name}" (${agent.category})`)
      console.log(`    Price: $${agentData.price}, Category: ${agent.category}`)
      success++
    } else {
      try {
        const created = await prisma.agent.create({ data: agentData })
        console.log(`  ✅ Created: "${created.title}" (ID: ${created.id})`)
        success++
      } catch (error) {
        console.log(`  ❌ Failed: ${error}`)
        failed++
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Import Summary')
  console.log('='.repeat(50))
  console.log(`✅ Successful: ${success}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⏭️  Skipped: ${skipped}`)

  if (dryRun) {
    console.log('\n💡 This was a dry run. Remove --dry-run to actually import.')
  }

  await prisma.$disconnect()
}

main().catch(console.error)
