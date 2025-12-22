# Deployment Guide - Neura AI Agent Marketplace

This guide will help you deploy the Neura platform to GitHub and set up the production environment.

## Prerequisites

- GitHub account
- Supabase account (already configured)
- Vercel account (recommended for deployment)

## Step 1: Prepare Your Repository

### 1.1 Check Git Status

```bash
cd /Users/apple/Desktop/RainesDev\(AI-Agent\)
git status
```

### 1.2 Initialize Git (if not already initialized)

```bash
git init
```

### 1.3 Review .gitignore

The project already has a `.gitignore` file that excludes:
- `node_modules/`
- `.env` and `.env*.local` (sensitive environment variables)
- `.next/` (build artifacts)
- `prisma/migrations` (database migrations - you may want to include these)

**IMPORTANT**: Decide if you want to include Prisma migrations in your repository. If yes, remove the line `prisma/migrations` from [.gitignore](.gitignore:37).

## Step 2: Set Up Environment Variables

### 2.1 Create .env.example

A `.env.example` file has been created with placeholder values. This file should be committed to GitHub to help others set up their environment.

### 2.2 Document Required Environment Variables

Make sure your `.env` file contains:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_url

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe (if using for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**NEVER** commit your actual `.env` file to GitHub!

## Step 3: Connect to GitHub

### 3.1 Add Remote Repository

If you've already created a GitHub repository, add it as a remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 3.2 Stage All Files

```bash
git add .
```

### 3.3 Create Initial Commit

```bash
git commit -m "Initial commit: Neura AI Agent Marketplace

- Rebranded to Neura powered by RainesDev
- Updated color scheme to green (#8DEC42)
- Added dynamic agent counts per category
- Implemented smooth animations and transitions
- Integrated Supabase auth and database
- Set up Prisma ORM
- Added Stripe payment integration"
```

### 3.4 Push to GitHub

For the first push:

```bash
git branch -M main
git push -u origin main
```

For subsequent pushes:

```bash
git push
```

## Step 4: Prisma and Database Migrations

### 4.1 Understanding Migrations

Your Prisma migrations track database schema changes. You have two options:

**Option A: Include migrations in repository** (Recommended)
1. Remove `prisma/migrations` from `.gitignore`
2. Commit your migrations: `git add prisma/migrations && git commit -m "Add database migrations"`
3. Team members can run `npx prisma migrate deploy` to apply migrations

**Option B: Exclude migrations, use schema only**
1. Keep `prisma/migrations` in `.gitignore`
2. Team members will need to run `npx prisma db push` to sync schema

### 4.2 Production Database Setup

For production, you'll need to:

1. Run migrations on your production database:
```bash
DATABASE_URL="your_production_database_url" npx prisma migrate deploy
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

## Step 5: Deploy to Vercel (Recommended)

### 5.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 5.2 Connect GitHub Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build` or `next build`
   - Output Directory: `.next`

### 5.3 Set Environment Variables in Vercel

Add all environment variables from your `.env` file:

1. Go to Project Settings → Environment Variables
2. Add each variable from your `.env` file
3. Set variables for **Production**, **Preview**, and **Development** environments

**IMPORTANT**: Update `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL

### 5.4 Deploy

Vercel will automatically deploy your main branch. Every push to `main` triggers a new deployment.

## Step 6: Set Up Supabase for Production

### 6.1 Update Supabase Configuration

1. Go to your Supabase project dashboard
2. Update allowed redirect URLs:
   - Add your Vercel production URL
   - Add your Vercel preview URLs pattern: `https://*.vercel.app`

3. Configure OAuth providers (if using):
   - Update redirect URLs for Google, GitHub, etc.

### 6.2 Database Connection

Ensure your production `DATABASE_URL` and `DIRECT_URL` are correctly set in Vercel environment variables.

## Step 7: Stripe Configuration (If Using Payments)

### 7.1 Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events to listen for
4. Copy webhook secret to Vercel environment variables

### 7.2 Test Payments

Use Stripe test mode keys for development and live mode keys for production.

## Step 8: Post-Deployment Checklist

- [ ] Verify all environment variables are set in Vercel
- [ ] Test authentication (signup, login, logout)
- [ ] Test database operations (create, read, update, delete agents)
- [ ] Test Stripe payments (if applicable)
- [ ] Check all pages load correctly
- [ ] Test responsive design on mobile devices
- [ ] Monitor Vercel logs for errors
- [ ] Set up custom domain (optional)

## Common Issues

### Issue: Database connection failed

**Solution**: Verify `DATABASE_URL` is correctly set in Vercel. Check Supabase connection pooler settings.

### Issue: Prisma Client not generated

**Solution**: Ensure `postinstall` script in `package.json` includes `prisma generate`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Issue: Environment variables not loading

**Solution**: Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser. Server-side variables are only available in API routes and server components.

### Issue: Build fails on Vercel

**Solution**: Check build logs. Common causes:
- Missing environment variables
- TypeScript errors
- Dependency issues

## Continuous Deployment

Once set up, your deployment workflow will be:

1. Make changes locally
2. Commit: `git add . && git commit -m "Description of changes"`
3. Push: `git push`
4. Vercel automatically builds and deploys

## Rollback

If a deployment fails:

1. Go to Vercel Dashboard → Deployments
2. Find a previous successful deployment
3. Click "..." → "Promote to Production"

## Monitoring

- **Vercel Analytics**: Monitor performance and usage
- **Supabase Dashboard**: Monitor database queries and authentication
- **Stripe Dashboard**: Monitor payments and webhooks

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Supabase Documentation](https://supabase.com/docs)

---

**Need Help?** Check the project README or open an issue on GitHub.
