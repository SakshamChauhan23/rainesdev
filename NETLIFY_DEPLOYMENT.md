# Netlify Deployment Guide - Neura AI Agent Marketplace

This guide will help you deploy Neura to Netlify.

## Prerequisites

- GitHub repository: https://github.com/SakshamChauhan23/rainesdev
- Netlify account (free tier works fine)
- Supabase project (already configured)
- Environment variables from your `.env` file

---

## Step 1: Prepare Your Project for Netlify

### 1.1 Install Netlify CLI (Optional)

```bash
npm install -g netlify-cli
```

### 1.2 Add Netlify Configuration

Create a `netlify.toml` file in your project root:

```bash
cd /Users/apple/Desktop/RainesDev\(AI-Agent\)
```

Then create the file with this content:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Step 2: Deploy to Netlify

### Method 1: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify**
   - Visit https://app.netlify.com
   - Sign up or log in

2. **Import Your GitHub Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" as your Git provider
   - Authorize Netlify to access your GitHub account
   - Select repository: `SakshamChauhan23/rainesdev`

3. **Configure Build Settings**
   - **Base directory**: Leave empty (or use `.`)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 20.x (set in Environment Variables)

4. **Add Environment Variables**
   Click "Show advanced" → "New variable" and add ALL these:

   ```
   DATABASE_URL=your_supabase_database_url
   DIRECT_URL=your_supabase_direct_url
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
   NODE_VERSION=20
   ```

   **IMPORTANT**: Get these values from your local `.env` file!

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - First deployment takes 3-5 minutes

---

### Method 2: Deploy via Netlify CLI

```bash
# Login to Netlify
netlify login

# Initialize Netlify in your project
cd /Users/apple/Desktop/RainesDev\(AI-Agent\)
netlify init

# Follow prompts:
# - Create & configure a new site
# - Choose team
# - Site name: rainesdev (or your choice)
# - Build command: npm run build
# - Publish directory: .next

# Set environment variables
netlify env:set DATABASE_URL "your_value"
netlify env:set DIRECT_URL "your_value"
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_value"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_value"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your_value"
netlify env:set STRIPE_SECRET_KEY "your_value"
netlify env:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "your_value"
netlify env:set STRIPE_WEBHOOK_SECRET "your_value"
netlify env:set NEXT_PUBLIC_APP_URL "https://your-site.netlify.app"
netlify env:set NODE_VERSION "20"

# Deploy
netlify deploy --prod
```

---

## Step 3: Post-Deployment Configuration

### 3.1 Update Supabase Redirect URLs

1. Go to your Supabase project dashboard
2. Navigate to: Authentication → URL Configuration
3. Add your Netlify URL to **Site URL** and **Redirect URLs**:
   ```
   https://your-site-name.netlify.app
   https://your-site-name.netlify.app/**
   ```

### 3.2 Update Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-site-name.netlify.app/api/webhooks/stripe`
3. Copy the webhook secret
4. Update `STRIPE_WEBHOOK_SECRET` in Netlify environment variables

### 3.3 Update Environment Variable

In Netlify:
1. Go to Site settings → Environment variables
2. Update `NEXT_PUBLIC_APP_URL` to your actual Netlify URL

---

## Step 4: Verify Deployment

### Checklist

- [ ] Site loads at your Netlify URL
- [ ] Homepage displays correctly with green theme
- [ ] Navigation works (header, footer links)
- [ ] "Browse Agents" page loads
- [ ] Authentication works (signup/login)
- [ ] Database connection works (agents load from Supabase)
- [ ] Dynamic agent counts display correctly
- [ ] No console errors in browser

---

## Common Issues & Solutions

### Issue: Build fails with "Module not found"

**Solution**:
```bash
# Make sure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: "Environment variables not defined"

**Solution**: Double-check all environment variables are set in Netlify dashboard under Site settings → Environment variables.

### Issue: Database connection fails

**Solution**:
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check Supabase connection pooler is enabled
- Ensure Supabase IP restrictions allow Netlify

### Issue: Authentication redirects fail

**Solution**:
- Update Supabase redirect URLs to include your Netlify URL
- Set `NEXT_PUBLIC_APP_URL` to your Netlify URL

### Issue: "Internal Server Error" on API routes

**Solution**:
- Check Netlify function logs: Site → Functions → View logs
- Verify all environment variables are set correctly
- Check Prisma client is generated (should happen automatically)

---

## Netlify vs Vercel

| Feature | Netlify | Vercel (Recommended) |
|---------|---------|---------------------|
| Next.js Support | Good (needs plugin) | Excellent (native) |
| Build Speed | Medium | Fast |
| Serverless Functions | 125k/month (free) | Unlimited (free) |
| Edge Functions | Yes | Yes |
| Free Tier | Generous | Very Generous |
| Best For | Static sites | Next.js apps |

**Recommendation**: For Next.js apps like Neura, **Vercel is better optimized**. However, Netlify works perfectly fine!

---

## Continuous Deployment

Once set up, Netlify automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Netlify automatically:
# 1. Detects push
# 2. Builds your site
# 3. Deploys to production
# 4. Updates your live site
```

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `neura.example.com`)
4. Follow DNS configuration instructions
5. Netlify provides free SSL certificate automatically

---

## Monitoring

### Netlify Analytics (Optional - Paid)

- Real-time visitor analytics
- Page view tracking
- Performance metrics

### Free Monitoring Options

- **Vercel Analytics**: Free alternative
- **Google Analytics**: Add to your site
- **Supabase Dashboard**: Monitor database queries
- **Stripe Dashboard**: Monitor payments

---

## Rollback Deployment

If something goes wrong:

1. Go to Deploys in Netlify dashboard
2. Find a previous successful deploy
3. Click "..." → "Publish deploy"
4. Site rolls back instantly

---

## Production Checklist

Before sharing with stakeholders:

- [ ] All environment variables set correctly
- [ ] Supabase authentication configured
- [ ] Stripe webhooks configured
- [ ] Custom domain configured (if applicable)
- [ ] Test all critical user flows
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate is active
- [ ] Set up error monitoring (Sentry, etc.)

---

## Next Steps

1. **Deploy to Netlify** using instructions above
2. **Test thoroughly** using the [STAKEHOLDER_TESTING_GUIDE.md](STAKEHOLDER_TESTING_GUIDE.md)
3. **Share with stakeholders** once verified

---

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/frameworks/next-js/
- **Your Project**: https://github.com/SakshamChauhan23/rainesdev

---

**Your Netlify site will be live at**: `https://your-site-name.netlify.app`

Ready to deploy! 🚀
