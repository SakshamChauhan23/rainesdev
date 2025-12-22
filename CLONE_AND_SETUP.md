# Clone & Setup Guide - Neura AI Agent Marketplace

This guide explains how to clone the Neura platform from GitHub and set it up on a new machine.

**Repository**: https://github.com/SakshamChauhan23/rainesdev

---

## Prerequisites

Before cloning, ensure you have:

- [ ] **Git** installed ([Download](https://git-scm.com/downloads))
- [ ] **Node.js 20+** installed ([Download](https://nodejs.org/))
- [ ] **npm** (comes with Node.js)
- [ ] **Code editor** (VS Code recommended)
- [ ] **Supabase account** with existing project
- [ ] **Stripe account** (for payments)

---

## Step 1: Clone the Repository

### 1.1 Clone via HTTPS

```bash
# Navigate to where you want the project
cd ~/Desktop  # or any directory

# Clone the repository
git clone https://github.com/SakshamChauhan23/rainesdev.git

# Navigate into the project
cd rainesdev
```

### 1.2 Clone via SSH (Alternative)

If you have SSH keys set up:

```bash
git clone git@github.com:SakshamChauhan23/rainesdev.git
cd rainesdev
```

### 1.3 Verify Clone

```bash
# Check repository status
git status

# View all files
ls -la

# Check current branch
git branch

# You should see:
# * main
```

---

## Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This will:
# - Download all dependencies from package.json
# - Create node_modules/ folder
# - Generate package-lock.json
# - Take 2-3 minutes
```

**Expected output**:
```
added 450+ packages in 2m
```

---

## Step 3: Set Up Environment Variables

### 3.1 Copy Environment Template

```bash
# Copy .env.example to .env
cp .env.example .env
```

### 3.2 Fill in Your Values

Open `.env` in your code editor and fill in these values:

```env
# Database (from your Supabase project)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Supabase Auth (from Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (from Stripe dashboard)
STRIPE_SECRET_KEY=sk_test_... # or sk_live_ for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.3 Where to Find These Values

**Supabase Values**:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Database**
   - Copy `DATABASE_URL` (Connection pooling)
   - Copy `DIRECT_URL` (Direct connection)
4. Go to **Settings** → **API**
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

**Stripe Values**:
1. Go to https://dashboard.stripe.com
2. Use **Test mode** for development
3. Go to **Developers** → **API keys**
   - Copy `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy `Secret key` → `STRIPE_SECRET_KEY`
4. Go to **Developers** → **Webhooks**
   - Add endpoint: `http://localhost:3000/api/webhooks/stripe`
   - Copy `Signing secret` → `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Set Up Database

### 4.1 Generate Prisma Client

```bash
# Generate Prisma client based on schema
npx prisma generate
```

**Expected output**:
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

### 4.2 Sync Database Schema

```bash
# Push Prisma schema to your Supabase database
npx prisma db push
```

**Expected output**:
```
Your database is now in sync with your Prisma schema. Done in 2.5s
```

### 4.3 (Optional) Seed Database

If you want test data:

```bash
# Run seed script
npx tsx prisma/seed.ts
```

---

## Step 5: Run Development Server

```bash
# Start the Next.js development server
npm run dev
```

**Expected output**:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### 5.1 Open in Browser

Visit: http://localhost:3000

You should see:
- ✅ Neura homepage with green theme
- ✅ "Automate your business in minutes" headline
- ✅ All 9 homepage sections
- ✅ No console errors

---

## Step 6: Verify Setup

### 6.1 Check Database Connection

```bash
# Open Prisma Studio to view database
npx prisma studio
```

This opens: http://localhost:5555

- [ ] Can view all tables (User, Agent, Category, Purchase, etc.)
- [ ] Data loads correctly

### 6.2 Test Authentication

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create test account
4. Check Supabase dashboard → Authentication → Users
5. You should see your new user

### 6.3 Check Environment Variables

```bash
# Verify all required vars are set
grep -E "^[A-Z]" .env | wc -l

# Should return 10 (or number of required vars)
```

---

## Step 7: Build for Production (Optional)

### 7.1 Test Production Build

```bash
# Create production build
npm run build
```

**Expected output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB          120 kB
├ ○ /agents                              2.1 kB          102 kB
└ ○ /agents/[slug]                       1.8 kB           98 kB
...
✓ Compiled successfully
```

### 7.2 Start Production Server

```bash
# Start production server
npm run start
```

Visit: http://localhost:3000 (production build)

---

## Common Issues & Solutions

### Issue: `npm install` fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Cannot find module '@prisma/client'"

**Solution**:
```bash
# Regenerate Prisma client
npx prisma generate
```

### Issue: "Database connection failed"

**Solution**:
1. Check `DATABASE_URL` in `.env` is correct
2. Verify Supabase project is running
3. Check network connection
4. Try direct URL instead of pooling URL

### Issue: "Environment variables not loaded"

**Solution**:
1. Ensure `.env` file exists in project root
2. Restart development server: `npm run dev`
3. Check for typos in variable names

### Issue: "Build fails with TypeScript errors"

**Solution**:
```bash
# Check for TypeScript errors
npx tsc --noEmit

# If errors found, fix them in the code
# Then rebuild
npm run build
```

---

## Project Structure

```
rainesdev/
├── .env                    # Your environment variables (NOT in Git)
├── .env.example            # Template for environment variables
├── .gitignore              # Files to ignore in Git
├── package.json            # Dependencies and scripts
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS config (green theme)
├── tsconfig.json           # TypeScript configuration
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js 14 App Router
│   │   ├── page.tsx        # Homepage
│   │   ├── agents/         # Agents pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── dashboard/      # Seller dashboard
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── landing/        # Homepage sections
│   │   ├── agent/          # Agent-related components
│   │   ├── layout/         # Header, Footer, etc.
│   │   └── ui/             # UI components (buttons, cards, etc.)
│   └── lib/                # Utility functions
│       ├── prisma.ts       # Prisma client
│       ├── supabase.ts     # Supabase client
│       └── utils.ts        # Helper functions
└── public/                 # Static assets
```

---

## Git Workflow

### Keep Your Clone Updated

```bash
# Check current status
git status

# Pull latest changes from GitHub
git pull origin main

# If you made local changes, stash them first
git stash
git pull origin main
git stash pop
```

### Make Changes

```bash
# Create a new branch for your changes
git checkout -b feature/your-feature-name

# Make your changes to files
# ...

# Stage changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run TypeScript type checking
npm run lint

# Generate Prisma client
npx prisma generate

# Sync database schema
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Run database migrations (if using migrations)
npx prisma migrate dev

# Seed database with test data
npx tsx prisma/seed.ts
```

---

## Multiple Machine Setup

### On Machine A (Original)

```bash
# Make changes
git add .
git commit -m "Update features"
git push origin main
```

### On Machine B (New Clone)

```bash
# Clone repository
git clone https://github.com/SakshamChauhan23/rainesdev.git
cd rainesdev

# Install dependencies
npm install

# Copy .env from Machine A or recreate it
cp .env.example .env
# Fill in environment variables

# Set up database
npx prisma generate
npx prisma db push

# Start development
npm run dev
```

---

## Deployment from Clone

Once cloned and tested locally, deploy to:

- **Vercel**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Netlify**: See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)

---

## Security Reminders

- ⚠️ **NEVER commit `.env` file** to Git
- ⚠️ **NEVER share your `SUPABASE_SERVICE_ROLE_KEY`**
- ⚠️ **NEVER share your `STRIPE_SECRET_KEY`**
- ✅ Use `.env.example` as a template for others
- ✅ Keep production and development keys separate
- ✅ Use Stripe test mode for development

---

## Help & Resources

- **GitHub Repository**: https://github.com/SakshamChauhan23/rainesdev
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Netlify Guide**: [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)
- **Testing Guide**: [STAKEHOLDER_TESTING_GUIDE.md](STAKEHOLDER_TESTING_GUIDE.md)
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs

---

## Quick Reference

```bash
# Clone → Install → Setup → Run
git clone https://github.com/SakshamChauhan23/rainesdev.git
cd rainesdev
npm install
cp .env.example .env
# (Fill in .env values)
npx prisma generate
npx prisma db push
npm run dev
```

**Done!** Visit http://localhost:3000 🚀

---

**Next Steps**:
1. Clone the repository
2. Set up environment variables
3. Run development server
4. Start building!
