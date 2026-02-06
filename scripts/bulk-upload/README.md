# Bulk Agent Upload

Upload multiple AI agents at once using a CSV file.

## Quick Start

1. **Copy the template:**

   ```bash
   cp scripts/bulk-upload/agents-template.csv scripts/bulk-upload/my-agents.csv
   ```

2. **Edit your CSV file** with your agents data

3. **Preview the import (dry run):**

   ```bash
   npm run import-agents scripts/bulk-upload/my-agents.csv -- --dry-run
   ```

4. **Run the actual import:**
   ```bash
   npm run import-agents scripts/bulk-upload/my-agents.csv
   ```

## CSV Format

| Column              | Required | Description                                        | Example                       |
| ------------------- | -------- | -------------------------------------------------- | ----------------------------- |
| `title`             | Yes      | Agent name (min 3 chars)                           | "Customer Support Bot"        |
| `category_slug`     | Yes      | Category identifier                                | "customer-support"            |
| `price`             | Yes      | Price in USD                                       | 49.99                         |
| `short_description` | Yes      | Brief summary                                      | "Automate tier-1 support"     |
| `workflow_overview` | Yes      | Full description (Markdown)                        | "# How It Works..."           |
| `use_case`          | Yes      | Target audience                                    | "Best for SaaS companies"     |
| `setup_guide`       | Yes      | Installation instructions (Markdown, min 10 chars) | "# Setup Guide..."            |
| `demo_video_url`    | No       | YouTube/Loom URL                                   | "https://youtube.com/..."     |
| `thumbnail_url`     | No       | Image URL                                          | "https://example.com/img.jpg" |
| `status`            | No       | Agent status (default: DRAFT)                      | "APPROVED"                    |
| `seller_email`      | Yes      | Email of the seller account                        | "seller@example.com"          |

## Available Categories

Check your database for available category slugs, common ones include:

- `customer-support`
- `sales-marketing`
- `data-analysis`
- `content-creation`
- `productivity`
- `hr-recruiting`

## Status Values

| Status         | Description                |
| -------------- | -------------------------- |
| `DRAFT`        | Not visible, needs editing |
| `UNDER_REVIEW` | Submitted for admin review |
| `APPROVED`     | Live on marketplace        |
| `REJECTED`     | Rejected by admin          |

## Command Options

```bash
npm run import-agents <csv-file> [options]
```

| Option          | Description                               |
| --------------- | ----------------------------------------- |
| `--dry-run`     | Preview import without making changes     |
| `--skip-errors` | Continue importing even if some rows fail |
| `--help`        | Show help message                         |

## Tips for Large Imports

### 1. Always do a dry run first

```bash
npm run import-agents my-agents.csv -- --dry-run
```

### 2. Validate your CSV

- Ensure all required fields are filled
- Check that seller emails exist and have SELLER role
- Verify category slugs match your database

### 3. Use proper CSV formatting

- Wrap multi-line content in double quotes
- Escape internal quotes by doubling them (`""`)
- Use UTF-8 encoding

### 4. For 500+ agents

Consider splitting into multiple files (100-200 agents each) to:

- Easier error tracking
- Avoid timeout issues
- Better progress monitoring

## Example CSV Content

```csv
title,category_slug,price,short_description,workflow_overview,use_case,setup_guide,demo_video_url,thumbnail_url,status,seller_email
"My AI Agent","customer-support",49.99,"Short description here","# Overview

Detailed markdown content...","Use case description","# Setup

1. Step one
2. Step two","https://youtube.com/watch?v=xxx","https://example.com/thumb.jpg","APPROVED","seller@example.com"
```

## Troubleshooting

### "Category not found"

Run this to see available categories:

```bash
npx prisma studio
```

Then check the `categories` table.

### "Seller not found"

The seller email must:

1. Exist as a user in the database
2. Have role `SELLER` or `ADMIN`

### "Duplicate slug"

The script automatically appends numbers to create unique slugs if needed.

## Creating Sellers First

If you need to create seller accounts before importing:

1. Have users sign up and apply via `/become-seller`
2. Approve them in admin panel at `/admin/seller-applications`
3. Or update user roles directly in the database
