# Quick Start Guide - Get Running in 10 Minutes

This guide will get you from zero to running app in ~10 minutes.

---

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Git installed (optional)
- [ ] A Supabase account (sign up at [supabase.com](https://supabase.com))

---

## Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to project directory
cd RainesDev\(AI-Agent\)

# Install all dependencies
npm install
```

Wait for installation to complete (~1-2 minutes depending on your internet speed).

---

## Step 2: Set Up Supabase (3 minutes)

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in with GitHub (fastest)
3. Click "New Project"
4. Fill in:
   - Name: `ai-agent-marketplace`
   - Database Password: Generate and **save it** 🔑
   - Region: Choose closest to you
5. Click "Create new project"
6. Wait ~2 minutes for setup

### 2.2 Get Connection String
1. In Supabase dashboard, click ⚙️ **Settings** → **Database**
2. Scroll to **Connection string**
3. Select **URI** tab
4. Copy the connection string
5. **Replace `[YOUR-PASSWORD]`** with your actual password

---

## Step 3: Configure Environment (1 minute)

```bash
# Create .env file from example
cp .env.example .env
```

Open `.env` and update these TWO essential lines:

```bash
# 1. Add your Supabase connection string
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# 2. Generate and add a NextAuth secret
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

### Generate NextAuth Secret:
```bash
openssl rand -base64 32
```
Copy the output and paste it into `.env`

**Note:** Other variables (Stripe, AWS, Resend) are optional for now. You can add them later when needed.

---

## Step 4: Set Up Database (2 minutes)

Run these commands one by one:

```bash
# 1. Generate Prisma client
npm run db:generate

# 2. Push database schema to Supabase
npm run db:push

# 3. Seed initial data (admin, categories, etc.)
npm run db:seed
```

### Expected Output:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema.
Starting database seed...
Admin user created: admin@aimarketplace.com
Categories created
Database seeded successfully!
```

---

## Step 5: Start the App (1 minute)

```bash
npm run dev
```

### Expected Output:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
- Ready in 2.3s
```

---

## Step 6: Test It Works! (1 minute)

Open your browser and visit these URLs:

### ✅ Landing Page
```
http://localhost:3000
```
You should see:
- Hero section with "Deploy Powerful AI Agents"
- 6 category cards
- "How It Works" section

### ✅ Browse Agents Page
```
http://localhost:3000/agents
```
You should see:
- Search bar
- Filter button
- Empty state (no agents created yet)

### ✅ API Test - Categories
```
http://localhost:3000/api/categories
```
You should see JSON with 6 categories:
```json
{
  "success": true,
  "data": [
    { "name": "Customer Support", ... },
    { "name": "Sales & Marketing", ... },
    ...
  ]
}
```

### ✅ API Test - Agents
```
http://localhost:3000/api/agents
```
You should see empty results:
```json
{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "total": 0 }
}
```

---

## 🎉 Success!

If all the above works, congratulations! Your app is running.

### Default Login Credentials (for testing):
- **Admin**: `admin@aimarketplace.com` / `admin123`
- **Seller**: `seller@example.com` / `seller123`
- **Buyer**: `buyer@example.com` / `buyer123`

**⚠️ Change these passwords in production!**

---

## What's Next?

### Option 1: Create Your First Agent Manually
1. Open Supabase Dashboard → Table Editor
2. Find the `agents` table
3. Click "Insert" → "Insert row"
4. Fill in the fields manually (tedious but works)

### Option 2: Continue Building Features
Follow [MVP_CHECKLIST.md](MVP_CHECKLIST.md) to build:
- Week 2: Agent Detail Page
- Week 3: Checkout Flow
- Week 4: Seller Submission
- Week 5: Admin Panel

### Option 3: Explore the Codebase
- [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md) - How components are organized
- [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) - Full roadmap
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Where everything lives

---

## Troubleshooting

### Issue: "Can't reach database server"
**Fix:**
1. Double-check your `DATABASE_URL` in `.env`
2. Make sure you replaced `[YOUR-PASSWORD]` with actual password
3. Verify Supabase project is active (not paused)

### Issue: "Module not found"
**Fix:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use
**Fix:**
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on different port
PORT=3001 npm run dev
```

### Issue: Prisma commands fail
**Fix:**
```bash
# Regenerate Prisma client
npx prisma generate

# Try push again
npm run db:push
```

### Issue: Seed script fails
**Fix:**
```bash
# Check if tables exist first
npx prisma studio  # Opens GUI at localhost:5555

# Reset and reseed
npm run db:push
npm run db:seed
```

---

## Common Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:seed          # Seed initial data
npm run db:studio        # Open Prisma Studio GUI

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript
```

---

## Getting Help

### Documentation
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Detailed Supabase guide
- [README.md](README.md) - Full project documentation
- [MVP_ROADMAP.md](MVP_ROADMAP.md) - Product roadmap

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## Next Steps After Setup

1. ✅ Familiarize yourself with the codebase structure
2. ✅ Read [MVP_ROADMAP.md](MVP_ROADMAP.md) to understand priorities
3. ✅ Check [MVP_CHECKLIST.md](MVP_CHECKLIST.md) for implementation tasks
4. ✅ Review [RISK_MITIGATION.md](RISK_MITIGATION.md) for product decisions
5. ✅ Start building Week 2 features (Agent Detail Page)

---

**Happy Coding! 🚀**

Last Updated: 2025-12-19
