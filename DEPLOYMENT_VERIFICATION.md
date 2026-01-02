# Deployment Verification Checklist

## After Pushing to GitHub & Netlify Auto-Deploy

### 1. Verify Netlify Build Logs
1. Go to Netlify Dashboard → Deploys
2. Click on the latest deploy
3. Check the build log for:
   - ✅ `npx prisma generate` succeeded
   - ✅ `npm run build` completed without errors
   - ✅ No TypeScript errors
   - ✅ Build time < 5 minutes

### 2. Verify Netlify Functions Created
1. Go to Netlify Dashboard → Functions tab
2. Check if these functions exist:
   - `api-agents`
   - `api-categories`
   - `api-user-role`
   - `api-reviews`
   - `api-reviews-eligibility`
   - `api-seller-reviews`

If NO functions are listed, the Next.js plugin is not working correctly.

### 3. Test API Endpoints

After deployment completes, test each endpoint:

```bash
# 1. Test agents API
curl https://hireyourai.netlify.app/api/agents?limit=1

# Expected: JSON with agents array
# Wrong: HTML with "Page not found"

# 2. Test categories API
curl https://hireyourai.netlify.app/api/categories

# Expected: JSON with categories array

# 3. Test user role API (use a real user ID from your database)
curl 'https://hireyourai.netlify.app/api/user/role?userId=YOUR_USER_ID'

# Expected: {"role":"BUYER"} or {"role":"SELLER"}

# 4. Test reviews eligibility
curl 'https://hireyourai.netlify.app/api/reviews/eligibility?userId=USER_ID&agentId=AGENT_ID'

# Expected: JSON with eligibility status
```

### 4. Test Production Site

Visit these pages:

- ✅ **Homepage** (https://hireyourai.netlify.app)
  - Should show agent counts
  - Should display agents in "Popular Services" section

- ✅ **Agents Page** (https://hireyourai.netlify.app/agents)
  - Should list all approved agents
  - Should have category filter working

- ✅ **Agent Detail Page** (https://hireyourai.netlify.app/agents/[slug])
  - Should show agent details
  - Should show reviews section

- ✅ **Login & Profile**
  - Login as buyer: `buyer@test.com` / `Test1234!`
  - Click profile dropdown
  - Should show role badge ("Buyer" or "Seller")
  - Should show "My Library" link

- ✅ **Seller Dashboard** (login as seller)
  - Login as seller: `seller@test.com` / `Test1234!`
  - Click profile dropdown
  - Should show "Seller Dashboard" link
  - Dashboard should show seller's agents
  - Should show "Reviews" section at bottom

### 5. Environment Variables to Verify

Make sure these are set in Netlify (Site Configuration → Environment Variables):

```bash
DATABASE_URL=postgresql://postgres.vuzmyajbuwuwqkvjejlv:ehx5IjDxXJteSUGo@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres:ehx5IjDxXJteSUGo@db.vuzmyajbuwuwqkvjejlv.supabase.co:5432/postgres

NEXT_PUBLIC_SUPABASE_URL=https://vuzmyajbuwuwqkvjejlv.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MjAzNDgsImV4cCI6MjA4MTk5NjM0OH0.rV-y5oPfKx41PpW9UZU3L-mfMGuDErgSGgZE8mI69ao

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQyMDM0OCwiZXhwIjoyMDgxOTk2MzQ4fQ.tr1k2ZJqbHloWyvm8OQth2VmSd--ncVKL77KbT7gWCk
```

All should contain: `vuzmyajbuwuwqkvjejlv` (Mumbai database ID)

### 6. Common Issues

**Issue: API routes return 404**
- Check if `@netlify/plugin-nextjs` is installed
- Check netlify.toml has correct redirects
- Try "Clear cache and deploy site"

**Issue: Agents not showing**
- Check database connection (verify DATABASE_URL)
- Check build logs for Prisma errors
- Test API endpoint directly with curl

**Issue: User role not showing**
- Check `/api/user/role` endpoint works
- Check browser console for errors
- Verify user exists in database

**Issue: Build fails**
- Check for TypeScript errors
- Check for missing dependencies
- Verify Node version (should be 18.x or higher)

### 7. If Everything Still Fails

Try these steps in order:

1. **Clear Netlify cache**
   - Deploys → Trigger deploy → Clear cache and deploy site

2. **Verify Next.js version**
   - Check package.json has `"next": "^14.2.35"`
   - Check if `@netlify/plugin-nextjs` is compatible

3. **Check Netlify plugin installation**
   - Add to package.json if missing:
     ```json
     "devDependencies": {
       "@netlify/plugin-nextjs": "^5.0.0"
     }
     ```

4. **Test build locally**
   ```bash
   npm run build
   npm start
   # Then visit http://localhost:3000
   ```

5. **Check Netlify function logs**
   - Netlify Dashboard → Functions → Click on function
   - Check execution logs for errors

---

## Quick Test Commands

After deployment, run these to verify:

```bash
# Test all critical endpoints
curl https://hireyourai.netlify.app/api/agents?limit=1 | jq
curl https://hireyourai.netlify.app/api/categories | jq
curl https://hireyourai.netlify.app/api/user/role?userId=a703b811-6fa2-447a-b605-467aafefe160 | jq

# All should return JSON, not HTML
```

---

## Success Criteria

✅ Build completes without errors
✅ Netlify functions are created
✅ All API endpoints return JSON (not HTML)
✅ Agents appear on homepage and /agents page
✅ User role shows in profile dropdown
✅ Seller Dashboard link appears for sellers
✅ Reviews section works on agent pages
✅ Seller can view their reviews in dashboard

If all checkboxes are ✅, deployment is successful!
