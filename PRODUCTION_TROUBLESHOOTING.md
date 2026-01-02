# Production Issue: Agents Not Showing

## 🔍 Issue
Production site shows "Loading..." on agents page and no agents appear.

## ✅ Confirmed Working
- ✅ Local database has 7 approved agents
- ✅ Database schema is in sync
- ✅ Code is pushed to GitHub

## 🚨 Root Cause
**Netlify environment variables are likely pointing to the OLD Australia database**, not the new Mumbai database.

## 🔧 Solution

### Step 1: Verify Netlify Environment Variables

1. Go to **Netlify Dashboard** → Your Site → **Site Configuration** → **Environment Variables**

2. Check if these variables exist and have the **Mumbai** values:

**Current (Mumbai) Values:**
```
DATABASE_URL=postgresql://postgres.vuzmyajbuwuwqkvjejlv:ehx5IjDxXJteSUGo@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres:ehx5IjDxXJteSUGo@db.vuzmyajbuwuwqkvjejlv.supabase.co:5432/postgres

NEXT_PUBLIC_SUPABASE_URL=https://vuzmyajbuwuwqkvjejlv.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MjAzNDgsImV4cCI6MjA4MTk5NjM0OH0.rV-y5oPfKx41PpW9UZU3L-mfMGuDErgSGgZE8mI69ao

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQyMDM0OCwiZXhwIjoyMDgxOTk2MzQ4fQ.tr1k2ZJqbHloWyvm8OQth2VmSd--ncVKL77KbT7gWCk
```

**Old (Australia) Values - DO NOT USE:**
```
DATABASE_URL=postgresql://postgres.mlwvzapijdtcbvtlqkhq:...@aws-1-ap-southeast-2...
NEXT_PUBLIC_SUPABASE_URL=https://mlwvzapijdtcbvtlqkhq.supabase.co
```

### Step 2: Update Environment Variables

If they're pointing to Australia (`mlwvzapijdtcbvtlqkhq`):

1. **Click on each variable** in Netlify
2. **Click "Edit"**
3. **Replace with Mumbai value** (see above)
4. **Click "Save"**

**Critical variables to update:**
- `DATABASE_URL` - Must have `vuzmyajbuwuwqkvjejlv` and `ap-south-1`
- `DIRECT_URL` - Must have `vuzmyajbuwuwqkvjejlv`
- `NEXT_PUBLIC_SUPABASE_URL` - Must have `vuzmyajbuwuwqkvjejlv`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Must start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2...`
- `SUPABASE_SERVICE_ROLE_KEY` - Must have `vuzmyajbuwuwqkvjejlv` in the token

### Step 3: Trigger New Deployment

After updating environment variables:

1. Go to **Deploys** tab
2. Click **Trigger Deploy** → **Clear cache and deploy site**
3. Wait 2-3 minutes for build to complete

### Step 4: Verify Production

Once deployed:

```bash
# Test homepage
curl https://hireyourai.netlify.app/

# Test agents API (should return agents, not error)
curl https://hireyourai.netlify.app/api/agents

# Test categories API
curl https://hireyourai.netlify.app/api/categories
```

Visit the site:
- Homepage should show agent counts
- /agents page should list all agents
- Agent detail pages should work

---

## 🔍 How to Check Which Database You're Using

Look at the environment variable values:

**Mumbai (Correct):**
- Contains: `vuzmyajbuwuwqkvjejlv`
- Contains: `ap-south-1` (in DATABASE_URL)
- URL: `https://vuzmyajbuwuwqkvjejlv.supabase.co`

**Australia (Wrong):**
- Contains: `mlwvzapijdtcbvtlqkhq`
- Contains: `ap-southeast-2` (in DATABASE_URL)
- URL: `https://mlwvzapijdtcbvtlqkhq.supabase.co`

---

## 📊 Expected Behavior After Fix

**Before (Current):**
- ❌ Agents page shows "Loading..." forever
- ❌ Homepage shows 0 agents
- ❌ API endpoints return errors or no data

**After (Fixed):**
- ✅ Agents page loads with 7 agents
- ✅ Homepage shows correct agent counts per category
- ✅ API endpoints return data quickly (<1s)
- ✅ Reviews feature works

---

## 🆘 If Still Not Working

### Check Netlify Deploy Logs

1. Go to **Deploys** tab
2. Click on latest deploy
3. Look for errors in build log
4. Check if Prisma generation succeeded

### Check Function Logs

1. Go to **Functions** tab in Netlify
2. Check recent function executions
3. Look for error messages

### Verify Database Connection

Test the connection directly:

```bash
# Use psql or any PostgreSQL client
psql "postgresql://postgres:ehx5IjDxXJteSUGo@db.vuzmyajbuwuwqkvjejlv.supabase.co:5432/postgres"

# Then run:
SELECT COUNT(*) FROM agents WHERE status = 'APPROVED';
```

Should return: `7`

---

## 📝 Quick Checklist

- [ ] Netlify environment variables updated to Mumbai
- [ ] All 5 key variables updated (DATABASE_URL, DIRECT_URL, etc.)
- [ ] New deployment triggered
- [ ] Build completed successfully
- [ ] Site loads without "Loading..." stuck
- [ ] Agents appear on /agents page
- [ ] Homepage shows agent counts

---

## 💡 Prevention

To avoid this in future:

1. **Always update Netlify env vars** when changing databases
2. **Test locally first** before deploying
3. **Keep .env.example updated** with current structure
4. **Document which database is production**

---

**Most Likely Fix:** Update the 5 environment variables in Netlify to use Mumbai database, then redeploy.
