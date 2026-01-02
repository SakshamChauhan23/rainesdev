# Production Deployment Issue - Agents Missing

## 🚨 Issue
Agents are not showing on production site after Reviews feature deployment.

## 🔍 Root Cause
The production database needs the schema migration for the Reviews feature. The Prisma schema was updated with a new `agentVersionId` field in the Review model, but this hasn't been pushed to production database yet.

## ✅ Solution

### Step 1: Update Production Database Schema

You need to run the Prisma migration on the **production (Mumbai) database**.

**Option A: Via Netlify Build (Recommended)**

The `netlify.toml` is configured to run `npx prisma generate` during build, but we also need `prisma db push`.

Update the build command in Netlify:

1. Go to Netlify Dashboard → Your Site → Site Configuration → Build & Deploy
2. Update Build Command to:
   ```bash
   npx prisma db push --accept-data-loss && npx prisma generate && npm run build
   ```

**Option B: Manual Migration (Quick Fix)**

Run the migration directly from your local machine:

```bash
# Make sure .env has production DATABASE_URL
# The Mumbai connection string should already be there

npx prisma db push
```

This will push the Review schema changes to production.

---

### Step 2: Trigger Netlify Redeploy

After updating the database schema:

1. Go to Netlify Dashboard → Deploys
2. Click "Trigger Deploy" → "Deploy site"
3. Wait for build to complete (~2-3 minutes)

---

### Step 3: Verify Production

Once deployed, test:

```bash
# Check agents API
curl https://hireyourai.netlify.app/api/agents?limit=1

# Check reviews API
curl https://hireyourai.netlify.app/api/reviews?agentId=AGENT_ID

# Visit homepage
# Should show agents in "Popular Services" section
```

---

## 🛡️ Prevention

To avoid this in future deployments:

1. **Always run migrations before deploying:**
   ```bash
   npx prisma db push
   git push
   ```

2. **Update netlify.toml build command** to include migrations:
   ```toml
   [build]
     command = "npx prisma db push --accept-data-loss && npx prisma generate && npm run build"
   ```

3. **Test locally first:**
   ```bash
   npm run build
   npm start
   ```

---

## 📋 Deployment Checklist

Before every production deployment:

- [ ] Run `npx prisma db push` locally (tests schema)
- [ ] Test locally: `npm run dev`
- [ ] Check all API endpoints work
- [ ] Commit and push to GitHub
- [ ] Wait for Netlify auto-deploy
- [ ] Verify production site
- [ ] Test critical user flows

---

## 🔧 Current Status

**Local Database:** ✅ Up to date with Reviews schema
**Production Database:** ❌ Needs migration
**Netlify Build:** ⏳ May need rebuild after schema update

---

## Next Steps

1. **Run the migration now:**
   ```bash
   npx prisma db push
   ```

2. **Trigger Netlify redeploy**

3. **Verify agents appear on production**

Let me know if you need help with any of these steps!
