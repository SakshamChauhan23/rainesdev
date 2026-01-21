/**
 * Bulk Agent Import Script
 *
 * Usage:
 *   npx tsx scripts/bulk-upload/import-agents.ts <csv-file-path>
 *
 * Example:
 *   npx tsx scripts/bulk-upload/import-agents.ts scripts/bulk-upload/agents-template.csv
 *
 * Options:
 *   --dry-run    Preview what would be imported without making changes
 *   --skip-errors Continue importing even if some rows fail
 */

import { PrismaClient, AgentStatus } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface AgentRow {
  title: string
  category_slug: string
  price: string
  short_description: string
  workflow_overview: string
  use_case: string
  setup_guide: string
  demo_video_url?: string
  thumbnail_url?: string
  status?: string
  seller_email: string
  assisted_setup_enabled?: string
  assisted_setup_price?: string
  book_call_enabled?: string
}

interface ImportResult {
  success: number
  failed: number
  skipped: number
  errors: { row: number; error: string }[]
}

function parseCSV(content: string): AgentRow[] {
  const lines = content.split('\n')
  const headers = parseCSVLine(lines[0])

  const rows: AgentRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      row[header.trim()] = values[index] || ''
    })

    rows.push(row as unknown as AgentRow)
  }

  return rows
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

function validateRow(row: AgentRow, rowNumber: number): string[] {
  const errors: string[] = []

  if (!row.title || row.title.length < 3) {
    errors.push(`Row ${rowNumber}: Title must be at least 3 characters`)
  }

  if (!row.category_slug) {
    errors.push(`Row ${rowNumber}: Category slug is required`)
  }

  const price = parseFloat(row.price)
  if (isNaN(price) || price < 0) {
    errors.push(`Row ${rowNumber}: Invalid price "${row.price}"`)
  }

  if (!row.short_description) {
    errors.push(`Row ${rowNumber}: Short description is required`)
  }

  if (!row.workflow_overview) {
    errors.push(`Row ${rowNumber}: Workflow overview is required`)
  }

  if (!row.use_case) {
    errors.push(`Row ${rowNumber}: Use case is required`)
  }

  if (!row.setup_guide || row.setup_guide.length < 10) {
    errors.push(`Row ${rowNumber}: Setup guide must be at least 10 characters`)
  }

  if (!row.seller_email) {
    errors.push(`Row ${rowNumber}: Seller email is required`)
  }

  return errors
}

function parseStatus(status?: string): AgentStatus {
  if (!status) return 'DRAFT'

  const normalized = status.toUpperCase().trim()
  const validStatuses: AgentStatus[] = ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']

  if (validStatuses.includes(normalized as AgentStatus)) {
    return normalized as AgentStatus
  }

  return 'DRAFT'
}

async function importAgents(
  filePath: string,
  options: { dryRun: boolean; skipErrors: boolean }
): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  }

  // Read and parse CSV
  const absolutePath = path.resolve(filePath)
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(absolutePath, 'utf-8')
  const rows = parseCSV(content)

  console.log(`\n📄 Found ${rows.length} agents to import\n`)

  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n')
  }

  // Cache for lookups
  const categoryCache: Map<string, string> = new Map()
  const sellerCache: Map<string, string> = new Map()

  // Fetch all categories
  const categories = await prisma.category.findMany()
  categories.forEach(cat => categoryCache.set(cat.slug, cat.id))

  console.log(`📁 Available categories: ${categories.map(c => c.slug).join(', ')}\n`)

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNumber = i + 2 // +2 because of header and 0-index

    console.log(`Processing row ${rowNumber}: "${row.title}"`)

    // Validate row
    const validationErrors = validateRow(row, rowNumber)
    if (validationErrors.length > 0) {
      validationErrors.forEach(err => {
        console.error(`  ❌ ${err}`)
        result.errors.push({ row: rowNumber, error: err })
      })
      result.failed++
      if (!options.skipErrors) {
        console.error('\n⚠️  Stopping due to validation error. Use --skip-errors to continue.\n')
        break
      }
      continue
    }

    // Check category exists
    const categoryId = categoryCache.get(row.category_slug)
    if (!categoryId) {
      const error = `Category "${row.category_slug}" not found`
      console.error(`  ❌ ${error}`)
      result.errors.push({ row: rowNumber, error })
      result.failed++
      if (!options.skipErrors) break
      continue
    }

    // Find or validate seller
    let sellerId = sellerCache.get(row.seller_email)
    if (!sellerId) {
      const seller = await prisma.user.findUnique({
        where: { email: row.seller_email },
        select: { id: true, role: true },
      })

      if (!seller) {
        const error = `Seller with email "${row.seller_email}" not found`
        console.error(`  ❌ ${error}`)
        result.errors.push({ row: rowNumber, error })
        result.failed++
        if (!options.skipErrors) break
        continue
      }

      if (seller.role !== 'SELLER' && seller.role !== 'ADMIN') {
        const error = `User "${row.seller_email}" is not a seller (role: ${seller.role})`
        console.error(`  ❌ ${error}`)
        result.errors.push({ row: rowNumber, error })
        result.failed++
        if (!options.skipErrors) break
        continue
      }

      sellerId = seller.id
      sellerCache.set(row.seller_email, sellerId)
    }

    // Generate unique slug
    const baseSlug = slugify(row.title)
    let slug = baseSlug
    let slugCounter = 1

    while (true) {
      const existing = await prisma.agent.findUnique({ where: { slug } })
      if (!existing) break
      slug = `${baseSlug}-${slugCounter++}`
    }

    // Prepare agent data
    const agentData = {
      sellerId,
      categoryId,
      title: row.title,
      slug,
      shortDescription: row.short_description,
      workflowOverview: row.workflow_overview,
      useCase: row.use_case,
      setupGuide: row.setup_guide,
      price: parseFloat(row.price),
      demoVideoUrl: row.demo_video_url || null,
      thumbnailUrl: row.thumbnail_url || null,
      status: parseStatus(row.status),
      assistedSetupEnabled: row.assisted_setup_enabled?.toLowerCase() === 'true',
      assistedSetupPrice: parseFloat(row.assisted_setup_price || '0') || 0,
      bookCallEnabled: row.book_call_enabled?.toLowerCase() === 'true',
      approvedAt: parseStatus(row.status) === 'APPROVED' ? new Date() : null,
    }

    if (options.dryRun) {
      console.log(`  ✓ Would create: "${row.title}" (slug: ${slug})`)
      result.success++
    } else {
      try {
        const agent = await prisma.agent.create({ data: agentData })
        console.log(`  ✅ Created: "${agent.title}" (ID: ${agent.id})`)
        result.success++
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`  ❌ Failed to create: ${errorMessage}`)
        result.errors.push({ row: rowNumber, error: errorMessage })
        result.failed++
        if (!options.skipErrors) break
      }
    }
  }

  return result
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
📦 Bulk Agent Import Script

Usage:
  npx tsx scripts/bulk-upload/import-agents.ts <csv-file-path> [options]

Options:
  --dry-run      Preview what would be imported without making changes
  --skip-errors  Continue importing even if some rows fail
  --help         Show this help message

Example:
  npx tsx scripts/bulk-upload/import-agents.ts scripts/bulk-upload/my-agents.csv --dry-run
    `)
    process.exit(0)
  }

  const filePath = args.find(arg => !arg.startsWith('--'))
  if (!filePath) {
    console.error('❌ Please provide a CSV file path')
    process.exit(1)
  }

  const options = {
    dryRun: args.includes('--dry-run'),
    skipErrors: args.includes('--skip-errors'),
  }

  console.log('\n🚀 Starting bulk agent import...')

  try {
    const result = await importAgents(filePath, options)

    console.log('\n' + '='.repeat(50))
    console.log('📊 Import Summary')
    console.log('='.repeat(50))
    console.log(`✅ Successful: ${result.success}`)
    console.log(`❌ Failed: ${result.failed}`)
    console.log(`⏭️  Skipped: ${result.skipped}`)

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:')
      result.errors.forEach(err => {
        console.log(`  Row ${err.row}: ${err.error}`)
      })
    }

    if (options.dryRun) {
      console.log('\n💡 This was a dry run. No changes were made.')
      console.log('   Remove --dry-run to actually import the agents.')
    }
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
