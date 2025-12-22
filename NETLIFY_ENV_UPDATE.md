# Netlify Environment Variables Update Guide

## Quick Steps

1. **Go to Netlify Dashboard**
   - Log in to https://app.netlify.com
   - Select your site

2. **Navigate to Environment Variables**
   - Click **Site Configuration** (left sidebar)
   - Click **Environment Variables**

3. **Update These 5 Variables**

   Click on each variable name and update its value:

   ### DATABASE_URL
   ```
   postgresql://postgres.vuzmyajbuwuwqkvjejlv:ehx5IjDxXJteSUGo@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true
   ```

   ### DIRECT_URL
   ```
   postgresql://postgres:ehx5IjDxXJteSUGo@db.vuzmyajbuwuwqkvjejlv.supabase.co:5432/postgres
   ```

   ### NEXT_PUBLIC_SUPABASE_URL
   ```
   https://vuzmyajbuwuwqkvjejlv.supabase.co
   ```

   ### NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MjAzNDgsImV4cCI6MjA4MTk5NjM0OH0.rV-y5oPfKx41PpW9UZU3L-mfMGuDErgSGgZE8mI69ao
   ```

   ### SUPABASE_SERVICE_ROLE_KEY
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1em15YWpidXd1d3Frdmplamx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQyMDM0OCwiZXhwIjoyMDgxOTk2MzQ4fQ.tr1k2ZJqbHloWyvm8OQth2VmSd--ncVKL77KbT7gWCk
   ```

4. **Trigger New Deployment**
   - Go to **Deploys** tab
   - Click **Trigger Deploy** dropdown
   - Select **Clear cache and deploy site**
   - Wait for deployment to complete (~2-3 minutes)

5. **Verify Deployment**
   - Once deployed, visit your site
   - Check that pages load quickly
   - Try logging in with temporary password

---

## Important Notes

⚠️ **After updating env variables, you MUST trigger a new deployment for changes to take effect!**

✅ **Expected Result:** Pages should load 5-10x faster than before

🔐 **User Login:** All users need to use temporary password (see MIGRATION_SUMMARY.md) or reset password

---

## If Something Goes Wrong

### Rollback Option
If you need to rollback to Australia database:

1. Change environment variables back to Australia values:
   - `DATABASE_URL`: `postgresql://postgres.mlwvzapijdtcbvtlqkhq:7BJfhUvAeeSjrkKZ@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true`
   - `DIRECT_URL`: `postgresql://postgres.mlwvzapijdtcbvtlqkhq:7BJfhUvAeeSjrkKZ@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://mlwvzapijdtcbvtlqkhq.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (old key)
   - `SUPABASE_SERVICE_ROLE_KEY`: (old key)

2. Trigger new deployment

---

**Ready to deploy! The migration is complete and verified.** 🚀
