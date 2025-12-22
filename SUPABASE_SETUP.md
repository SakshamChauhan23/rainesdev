# Supabase Setup Guide

This guide will help you set up Supabase as your database for the AI Agent Marketplace.

---

## Why Supabase?

- ✅ Managed PostgreSQL database
- ✅ Free tier with generous limits (500MB database, unlimited API requests)
- ✅ Built-in connection pooling
- ✅ Automatic backups
- ✅ Dashboard for database management
- ✅ Fast setup (< 5 minutes)

---

## Step 1: Create a Supabase Project

### 1.1 Sign Up
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email

### 1.2 Create New Project
1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `ai-agent-marketplace` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., US East, EU West)
   - **Pricing Plan**: Free (upgrade later if needed)
4. Click "Create new project"
5. Wait ~2 minutes for provisioning

---

## Step 2: Get Database Connection Strings

### 2.1 Navigate to Database Settings
1. In your Supabase project dashboard
2. Click ⚙️ **Settings** (bottom left)
3. Click **Database**

### 2.2 Copy Connection Strings

You'll need TWO connection strings:

#### Connection String (Transaction Mode) - for DATABASE_URL
1. Scroll to **Connection string** section
2. Select **URI** tab
3. Copy the connection string
4. It looks like:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
5. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password

#### Connection String (Session Mode) - for DIRECT_URL
1. Stay in the **Connection string** section
2. Click on **Session** tab (or Direct Connection)
3. Copy this connection string
4. It looks like:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password

---

## Step 3: Configure Environment Variables

### 3.1 Create .env File
```bash
cp .env.example .env
```

### 3.2 Edit .env File
Open `.env` and update these lines:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"  # Generate below

# Stripe (get from stripe.com dashboard)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# File Storage (optional for MVP - can use Supabase Storage)
# AWS_ACCESS_KEY_ID="your-access-key"
# AWS_SECRET_ACCESS_KEY="your-secret-key"
# AWS_REGION="us-east-1"
# AWS_BUCKET_NAME="ai-agent-marketplace"

# Email (Resend - get from resend.com)
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@yourdomain.com"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="AI Agent Marketplace"

# Admin Email (for initial admin setup)
ADMIN_EMAIL="admin@yourdomain.com"
```

### 3.3 Generate NextAuth Secret
Run this command in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET`

---

## Step 4: Install Dependencies

```bash
npm install
```

---

## Step 5: Set Up Database Schema

### 5.1 Generate Prisma Client
```bash
npm run db:generate
```

This creates the Prisma client based on your schema.

### 5.2 Push Schema to Supabase
```bash
npm run db:push
```

This command:
- Creates all tables in your Supabase database
- Sets up all enums
- Creates indexes
- Establishes foreign key relationships

**Expected Output:**
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema.
```

### 5.3 Verify in Supabase Dashboard
1. Go to your Supabase project
2. Click **Table Editor** (left sidebar)
3. You should see these tables:
   - users
   - seller_profiles
   - categories
   - agents
   - purchases
   - support_requests
   - reviews
   - admin_logs

---

## Step 6: Seed Initial Data

### 6.1 Run Seed Script
```bash
npm run db:seed
```

This creates:
- ✅ Admin user: `admin@aimarketplace.com` / `admin123`
- ✅ Seller user: `seller@example.com` / `seller123`
- ✅ Buyer user: `buyer@example.com` / `buyer123`
- ✅ 6 categories (Customer Support, Sales & Marketing, etc.)

**Expected Output:**
```
Starting database seed...
Admin user created: admin@aimarketplace.com
Seller user created: seller@example.com
Buyer user created: buyer@example.com
Categories created
Database seeded successfully!
```

---

## Step 7: Test the Connection

### 7.1 Start Development Server
```bash
npm run dev
```

### 7.2 Test API Endpoints
Open your browser and visit:

1. **Categories API**:
   ```
   http://localhost:3000/api/categories
   ```
   Should return JSON with 6 categories

2. **Agents API**:
   ```
   http://localhost:3000/api/agents
   ```
   Should return empty array (no agents yet)

3. **Landing Page**:
   ```
   http://localhost:3000
   ```
   Should load the full landing page

---

## Step 8: Verify in Supabase Dashboard

### 8.1 Check Seeded Data
1. Go to Supabase Dashboard → **Table Editor**
2. Click **users** table
   - Should see 3 users (admin, seller, buyer)
3. Click **categories** table
   - Should see 6 categories

### 8.2 Run SQL Queries (Optional)
1. Go to **SQL Editor** (left sidebar)
2. Run a query:
   ```sql
   SELECT * FROM users;
   ```
3. Should see your seeded users

---

## Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
1. Check your DATABASE_URL is correct
2. Verify password doesn't have special characters (URL encode if needed)
3. Ensure Supabase project is running (not paused)
4. Check if your IP is allowed (Supabase allows all by default)

### Issue: "relation does not exist"

**Solution:**
```bash
# Reset and push schema again
npm run db:push
```

### Issue: "Environment variable not found: DIRECT_URL"

**Solution:**
- DIRECT_URL is optional for development
- You can comment it out in `schema.prisma`:
  ```prisma
  datasource db {
    provider     = "postgresql"
    url          = env("DATABASE_URL")
    # directUrl  = env("DIRECT_URL")  # Optional
  }
  ```

### Issue: Seed script fails

**Solution:**
```bash
# Check database connection first
npx prisma db pull

# Then try seeding again
npm run db:seed
```

### Issue: "Password authentication failed"

**Solution:**
1. Double-check your password in .env
2. Make sure you replaced `[YOUR-PASSWORD]` with actual password
3. If password has special characters, URL encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - etc.

---

## Database Management Commands

### View Database in GUI
```bash
npm run db:studio
```
Opens Prisma Studio at `http://localhost:5555`

### Create a Migration (when you change schema)
```bash
npm run db:migrate
```

### Reset Database (delete all data)
```bash
npx prisma db push --force-reset
npm run db:seed  # Re-seed after reset
```

### Pull Schema from Database
```bash
npx prisma db pull
```

---

## Supabase Dashboard Features

### 1. Table Editor
- Visual interface to view/edit data
- Add rows manually
- Export as CSV

### 2. SQL Editor
- Write custom SQL queries
- Save queries for reuse
- View query results

### 3. Database Settings
- Connection strings
- Connection pooling config
- Database size and usage

### 4. Logs
- Real-time database logs
- Query performance
- Error tracking

### 5. Backups (Paid plans)
- Automatic daily backups
- Point-in-time recovery
- Download backups

---

## Production Deployment

### Update Environment Variables
When deploying to production (Vercel, Railway, etc.):

1. Use the same Supabase project OR create a new production project
2. Add all environment variables to your hosting platform
3. Update `NEXTAUTH_URL` to your production domain:
   ```
   NEXTAUTH_URL="https://yourdomain.com"
   ```

### Run Migrations in Production
```bash
# On your deployment platform
npx prisma migrate deploy
```

---

## Free Tier Limits

Supabase Free Tier includes:
- ✅ 500 MB database space
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ✅ Social OAuth providers
- ✅ 7 days of log retention

**Upgrade to Pro ($25/mo) when you need:**
- More storage
- Daily backups
- No project pausing
- Email support

---

## Connection Pooling (Important!)

Supabase uses **PgBouncer** for connection pooling:

- **Transaction Mode** (port 5432): Use for Prisma migrations and general queries
- **Session Mode** (port 6543): Use for transactions and migrations

Your setup uses:
- `DATABASE_URL` → Transaction mode (default)
- `DIRECT_URL` → Session mode (for migrations)

This is optimal for serverless environments (Vercel, Netlify).

---

## Security Best Practices

### 1. Row Level Security (RLS)
Supabase has RLS disabled by default for direct database connections. Since you're using Prisma with Next.js API routes, you're handling security at the application level. This is fine for your use case.

### 2. Environment Variables
- ✅ Never commit `.env` to git (already in .gitignore)
- ✅ Use separate databases for dev/staging/prod
- ✅ Rotate database passwords periodically

### 3. API Keys
- Keep Supabase API keys secure
- Don't expose database URL in client-side code
- Use API routes for all database operations

---

## Alternative: Supabase Storage for Files

Instead of AWS S3, you can use Supabase Storage:

### Setup Supabase Storage
1. Go to **Storage** in Supabase dashboard
2. Create a bucket: `agent-assets`
3. Set to Public or Private (your choice)
4. Get storage URL from Settings

### Update Upload Code
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Upload file
const { data, error } = await supabase.storage
  .from('agent-assets')
  .upload(`thumbnails/${filename}`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('agent-assets')
  .getPublicUrl(`thumbnails/${filename}`)
```

Add to `.env`:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_KEY="your-service-role-key"
```

---

## Next Steps

Once your database is set up:

1. ✅ Test the landing page: `http://localhost:3000`
2. ✅ Test the browse page: `http://localhost:3000/agents`
3. ✅ Create your first agent manually in Supabase Table Editor
4. ✅ Continue with Week 2: Agent Detail Page

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Discord**: https://discord.supabase.com
- **Project Issues**: [GitHub Issues](https://github.com/yourusername/ai-agent-marketplace/issues)

---

**Last Updated**: 2025-12-19
**Status**: Ready for Development ✅
