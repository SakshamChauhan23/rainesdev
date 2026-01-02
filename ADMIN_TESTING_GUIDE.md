# Complete Admin Testing Guide - End-to-End Platform Testing

This guide provides step-by-step instructions for testing the entire platform from all three user perspectives: **Buyer**, **Seller**, and **Admin**.

## 🔑 Test Accounts

Use these accounts for testing:

**Admin Account:**
- Email: `sal@rainesdev.ai`
- Password: `salleone`
- Role: ADMIN (has access to everything)

**Seller Account:**
- Same account go to profile (right top corner 'S')
- Under dropdown go to: SELLER DASHBOARD (can sell + buy)

**Buyer Account:**
- Go-to Categories

**Create New Test Accounts:**
If needed, sign up at https://hireyourai.netlify.app/signup with any email.

---

## 📋 Testing Checklist Overview

- [ ] **Buyer Flow** (10 tests)
- [ ] **Seller Flow** (12 tests)
- [ ] **Admin Flow** (8 tests)
- [ ] **Reviews & Ratings** (6 tests)
- [ ] **Cross-Role Features** (4 tests)

**Total:** 40 test scenarios

---

# 🛒 PART 1: BUYER TESTING (10 Tests)

## Test 1.1: Sign Up as Buyer

**Steps:**
1. Go to https://hireyourai.netlify.app
2. Click **"Sign Up"** in header
3. Fill in:
   - Name: `Test Buyer`
   - Email: `testbuyer@example.com`
   - Password: `Test1234!`
   - Confirm Password: `Test1234!`
4. Click **"Create Account"**

**Expected:**
- ✅ Redirected to homepage
- ✅ See "Test Buyer" in header profile dropdown
- ✅ Role badge shows "Buyer"
- ✅ See "My Library" link in dropdown
- ✅ NO "Seller Dashboard" link (buyers can't sell)
- ✅ NO "Admin Panel" link

---

## Test 1.2: Browse Agents

**Steps:**
1. Visit https://hireyourai.netlify.app
2. Scroll to **"Popular Services"** section
3. Click **"View All Agents"** button

**Expected:**
- ✅ See list of all approved agents
- ✅ Each agent shows:
  - Title
  - Short description
  - Price
  - Category badge
  - Star rating (if reviews exist)
  - "View Details" button

---

## Test 1.3: Filter Agents by Category

**Steps:**
1. On `/agents` page
2. Click **"All Categories"** dropdown
3. Select **"Marketing & Sales"** (or any category)

**Expected:**
- ✅ Page filters to show only agents in that category
- ✅ URL updates to include `?categorySlug=marketing-sales`
- ✅ Agent count updates
- ✅ Can switch between categories

---

## Test 1.4: Search for Agents

**Steps:**
1. On `/agents` page
2. Type in search box: `AI`
3. Press Enter

**Expected:**
- ✅ Results filter to show agents matching "AI" in title/description
- ✅ Search term persists in input
- ✅ Can clear search to see all agents

---

## Test 1.5: View Agent Detail Page

**Steps:**
1. Click on any agent card
2. Review all sections on agent detail page

**Expected:**
- ✅ See agent title, description, category
- ✅ See pricing information
- ✅ See "Features" list
- ✅ See "Use Cases" section
- ✅ See seller information
- ✅ See **"Get This Agent"** button (if not purchased)
- ✅ See **Reviews & Ratings** section at bottom
- ✅ NOT able to leave a review yet (need to purchase first)

---

## Test 1.6: Purchase an Agent (Checkout Flow)

**Steps:**
1. On agent detail page, click **"Get This Agent"**
2. You'll be redirected to checkout page
3. Review checkout details:
   - Agent name
   - Price
   - Total
4. Fill in payment details (use Stripe test card):
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)
5. Click **"Complete Purchase"**

**Expected:**
- ✅ Payment processes successfully
- ✅ Redirected to success page or agent detail
- ✅ See confirmation message
- ✅ **"Get This Agent"** button changes to **"Access Agent"** or similar
- ✅ Agent now appears in "My Library"

**Note:** This is a TEST environment. No real charges occur.

---

## Test 1.7: Access Library

**Steps:**
1. Click profile dropdown in header
2. Click **"My Library"**
3. View your purchased agents

**Expected:**
- ✅ See all agents you've purchased
- ✅ Each shows:
  - Agent title
  - Purchase date
  - "View Agent" button
- ✅ If no purchases: see empty state message

---

## Test 1.8: Review Eligibility (Too Soon)

**Steps:**
1. Immediately after purchase, go to agent detail page
2. Scroll to **Reviews & Ratings** section

**Expected:**
- ✅ See message: **"Reviews unlock after you've had time to use this agent (X days remaining)"**
- ✅ Review form is NOT visible
- ✅ Can still see other users' reviews

---

## Test 1.9: Leave a Review (After Eligibility)

**Prerequisites:** Wait 14 days OR use helper script to make purchase eligible:

```bash
npx tsx scripts/make-purchase-eligible.ts YOUR_USER_ID AGENT_ID
```

**Steps:**
1. Go to agent detail page
2. Scroll to **Reviews & Ratings** section
3. Click star rating (1-5 stars)
4. Enter review comment (optional): `Great AI agent! Very helpful for my workflow.`
5. Click **"Submit Review"**

**Expected:**
- ✅ Review submits successfully
- ✅ See success message
- ✅ Your review appears in reviews list with:
  - Your name
  - Star rating
  - Comment
  - **"Verified Purchase"** badge
  - Date posted
- ✅ Review form disappears (can't review same version twice)

---

## Test 1.10: Logout

**Steps:**
1. Click profile dropdown
2. Click **"Logout"**

**Expected:**
- ✅ Logged out successfully
- ✅ Redirected to homepage
- ✅ Header shows "Login" and "Sign Up" buttons
- ✅ Profile dropdown not visible

---

# 🏪 PART 2: SELLER TESTING (12 Tests)

## Test 2.1: Login as Seller

**Steps:**
1. Go to https://hireyourai.netlify.app/login
2. Enter:
   - Email: `seller@test.com`
   - Password: `Test1234!`
3. Click **"Sign In"**

**Expected:**
- ✅ Logged in successfully
- ✅ See profile dropdown with role badge "Seller"
- ✅ See both **"My Library"** AND **"Seller Dashboard"** links
- ✅ NO "Admin Panel" link (sellers aren't admins)

---

## Test 2.2: Access Seller Dashboard

**Steps:**
1. Click profile dropdown
2. Click **"Seller Dashboard"**
3. Review dashboard layout

**Expected:**
- ✅ See **"My Agents"** section at top
- ✅ See **"Submit New Agent"** button
- ✅ See list of your agents (if any)
- ✅ See **"Reviews"** section at bottom
- ✅ Each agent shows:
  - Title
  - Status (PENDING / APPROVED / REJECTED)
  - Actions (Edit / View)

---

## Test 2.3: Submit New Agent

**Steps:**
1. On dashboard, click **"Submit New Agent"**
2. Fill in the form:
   - **Title:** `AI Content Writer Pro`
   - **Short Description:** `Advanced AI for creating blog posts, articles, and marketing copy`
   - **Category:** Select `Content Creation & Writing`
   - **Price:** `29.99`
   - **Features:** Add 3-5 features:
     - `Generates SEO-optimized content`
     - `Supports 10+ content types`
     - `Built-in plagiarism checker`
     - `Multi-language support`
   - **Use Cases:** Add 2-3 use cases:
     - `Blog writing`
     - `Social media posts`
     - `Product descriptions`
   - **Full Description:**
     ```
     AI Content Writer Pro is a powerful tool that helps you create high-quality content in minutes.

     Whether you're writing blog posts, social media content, or marketing copy, our AI understands your needs and delivers professional results.

     Perfect for marketers, bloggers, and content creators who want to save time without sacrificing quality.
     ```
   - **Demo URL:** `https://example.com/demo` (optional)
   - **Documentation URL:** `https://example.com/docs` (optional)
3. Click **"Submit for Review"**

**Expected:**
- ✅ Agent submits successfully
- ✅ See success message
- ✅ Redirected to dashboard
- ✅ New agent appears with status **"PENDING"**
- ✅ Cannot edit while pending
- ✅ Agent NOT visible on public agents page yet

---

## Test 2.4: View Pending Agent

**Steps:**
1. On dashboard, find your pending agent
2. Click **"View"** button

**Expected:**
- ✅ See agent detail page
- ✅ See yellow **"Pending Approval"** badge
- ✅ See all submitted information
- ✅ NO purchase button (can't buy your own agent)
- ✅ Message: "This agent is awaiting admin approval"

---

## Test 2.5: Edit Draft Agent

**Prerequisites:** Agent must be in DRAFT status or REJECTED status

**Steps:**
1. On dashboard, find draft/rejected agent
2. Click **"Edit"** button
3. Update any fields
4. Click **"Save Draft"** or **"Submit for Review"**

**Expected:**
- ✅ Changes save successfully
- ✅ If saved as draft: status remains DRAFT
- ✅ If submitted: status changes to PENDING
- ✅ Updated information visible on detail page

---

## Test 2.6: Cannot Edit Approved Agent Directly

**Prerequisites:** Agent must be APPROVED

**Steps:**
1. On dashboard, find approved agent
2. Try to click "Edit"

**Expected:**
- ✅ **"Edit"** button not visible for approved agents
- ✅ Only **"View"** button available
- ✅ To update: must submit new version (pending update system)

---

## Test 2.7: View Your Agent's Reviews

**Prerequisites:** Your agent has received reviews from buyers

**Steps:**
1. On dashboard, scroll to **"Reviews"** section
2. Review the reviews display

**Expected:**
- ✅ See all reviews for ALL your agents
- ✅ Each review shows:
  - Agent name
  - Reviewer name
  - Star rating
  - Comment
  - Date
  - "Verified Purchase" badge
- ✅ Reviews grouped by agent (optional)
- ✅ Shows average rating per agent

---

## Test 2.8: Seller Can Also Buy

**Steps:**
1. As seller, browse agents page
2. Find an agent you DON'T sell
3. Click **"Get This Agent"**
4. Complete purchase

**Expected:**
- ✅ Seller can purchase other sellers' agents
- ✅ Checkout works normally
- ✅ Agent appears in "My Library"
- ✅ Can leave reviews after 14 days
- ✅ Cannot purchase own agents

---

## Test 2.9: Cannot Purchase Own Agent

**Steps:**
1. As seller, go to your own agent's detail page
2. Look for purchase button

**Expected:**
- ✅ NO **"Get This Agent"** button
- ✅ See message: "This is your agent" or similar
- ✅ Cannot add own agent to library

---

## Test 2.10: View Sales Analytics (Future Feature)

**Current Status:** Not implemented yet

**Expected Future Behavior:**
- View total sales
- View revenue
- View sales trends
- Download sales reports

---

## Test 2.11: Manage Multiple Agents

**Steps:**
1. Submit 2-3 different agents
2. View dashboard

**Expected:**
- ✅ All agents listed
- ✅ Each shows correct status
- ✅ Can manage each independently
- ✅ Reviews section shows reviews from all agents

---

## Test 2.12: Receive Notification of New Review (Future)

**Current Status:** Not implemented

**Expected Future Behavior:**
- Email notification when buyer leaves review
- In-app notification
- Review summary in dashboard

---

# 👑 PART 3: ADMIN TESTING (8 Tests)

## Test 3.1: Login as Admin

**Steps:**
1. Go to https://hireyourai.netlify.app/login
2. Enter:
   - Email: `sal@rainesdev.ai`
   - Password: `Test1234!`
3. Click **"Sign In"**

**Expected:**
- ✅ Logged in successfully
- ✅ Profile dropdown shows role badge "Admin"
- ✅ See **all three links**:
  - My Library (can buy)
  - Seller Dashboard (can sell)
  - **Admin Panel** (admin only)

---

## Test 3.2: Access Admin Panel

**Steps:**
1. Click profile dropdown
2. Click **"Admin Panel"**
3. Review admin panel layout

**Expected:**
- ✅ See **"Agent Review Queue"** section
- ✅ See list of pending agents
- ✅ Each pending agent shows:
  - Title
  - Seller name
  - Category
  - Submission date
  - **"Review"** button
- ✅ See stats: Total pending, approved, rejected (optional)

---

## Test 3.3: Review Pending Agent - Approve

**Steps:**
1. In admin panel, find a pending agent
2. Click **"Review"** button
3. Review all agent details:
   - Title, description, features
   - Category, pricing
   - Seller information
4. Scroll to bottom
5. Add admin notes (optional): `Looks good! Approving.`
6. Click **"Approve Agent"**

**Expected:**
- ✅ Agent status changes to **APPROVED**
- ✅ Success message appears
- ✅ Agent removed from pending queue
- ✅ Agent now visible on public `/agents` page
- ✅ Seller can see status changed to "APPROVED" on dashboard
- ✅ Buyers can now purchase the agent

---

## Test 3.4: Review Pending Agent - Reject

**Steps:**
1. Find another pending agent
2. Click **"Review"**
3. Add rejection reason: `Title needs to be more descriptive. Please resubmit.`
4. Click **"Reject Agent"**

**Expected:**
- ✅ Agent status changes to **REJECTED**
- ✅ Success message appears
- ✅ Agent removed from pending queue
- ✅ Agent NOT visible on public page
- ✅ Seller sees status "REJECTED" with reason
- ✅ Seller can edit and resubmit

---

## Test 3.5: View All Agents (Admin View)

**Steps:**
1. In admin panel, click **"View All Agents"** (if available)
2. Or manually go to `/admin/agents`

**Expected:**
- ✅ See ALL agents regardless of status
- ✅ See status badges (PENDING, APPROVED, REJECTED, DRAFT)
- ✅ Filter by status
- ✅ Search functionality
- ✅ Quick actions (Approve, Reject, Delete)

---

## Test 3.6: Admin Can Override Agent Status

**Steps:**
1. Find an approved agent
2. Change status back to PENDING or REJECTED
3. Save changes

**Expected:**
- ✅ Status updates
- ✅ Agent visibility changes accordingly
- ✅ Seller sees updated status

---

## Test 3.7: View Platform Statistics

**Current Status:** Partially implemented (manual queries needed)

**Expected Behavior:**
- Total users (buyers, sellers, admins)
- Total agents (by status)
- Total purchases
- Total revenue
- Reviews submitted
- Popular categories

**Manual Check:**
```sql
-- Run in Supabase SQL Editor
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE role = 'BUYER') as buyers,
  (SELECT COUNT(*) FROM users WHERE role = 'SELLER') as sellers,
  (SELECT COUNT(*) FROM users WHERE role = 'ADMIN') as admins,
  (SELECT COUNT(*) FROM agents WHERE status = 'APPROVED') as approved_agents,
  (SELECT COUNT(*) FROM agents WHERE status = 'PENDING') as pending_agents,
  (SELECT COUNT(*) FROM purchases WHERE status = 'COMPLETED') as total_purchases,
  (SELECT COUNT(*) FROM reviews) as total_reviews;
```

---

## Test 3.8: Manage Users (Grant/Revoke Roles)

**Steps:**
1. Use the grant-admin script to change user roles:

```bash
# Make someone a seller
npx tsx scripts/grant-admin-sql.ts user@example.com

# Or use Supabase SQL:
UPDATE users SET role = 'SELLER' WHERE email = 'user@example.com';
```

**Expected:**
- ✅ User role updates
- ✅ User sees new role in profile dropdown
- ✅ User gets access to new features (e.g., Seller Dashboard)

---

# ⭐ PART 4: REVIEWS & RATINGS TESTING (6 Tests)

## Test 4.1: Review Eligibility - No Purchase

**Steps:**
1. Login as buyer who has NOT purchased an agent
2. Go to any agent detail page
3. Scroll to Reviews section

**Expected:**
- ✅ See message: **"You need to purchase this agent before leaving a review."**
- ✅ Review form NOT visible
- ✅ Can still read other reviews

---

## Test 4.2: Review Eligibility - Too Soon (14-day waiting)

**Steps:**
1. Purchase an agent
2. Immediately go to agent detail page
3. Check Reviews section

**Expected:**
- ✅ See message: **"Reviews unlock after you've had time to use this agent (X days remaining)"**
- ✅ Shows days remaining counter
- ✅ Review form NOT visible

---

## Test 4.3: Make Purchase Eligible (Helper Script)

**Steps:**
1. Find your purchase details:
   ```bash
   # In Supabase SQL Editor:
   SELECT * FROM purchases WHERE buyer_id = 'YOUR_USER_ID' ORDER BY purchased_at DESC;
   ```
2. Run helper script:
   ```bash
   npx tsx scripts/make-purchase-eligible.ts YOUR_USER_ID AGENT_ID
   ```

**Expected:**
- ✅ Script updates purchase date to 15 days ago
- ✅ Check eligibility again - should now be eligible
- ✅ Review form appears

---

## Test 4.4: Submit Review - All Fields

**Prerequisites:** Eligible to review

**Steps:**
1. On agent detail page, Reviews section
2. Click 5 stars
3. Enter comment: `Excellent agent! Exceeded my expectations. The AI is very accurate and saves me hours of work every week.`
4. Click **"Submit Review"**

**Expected:**
- ✅ Review submits successfully
- ✅ Success message appears
- ✅ Review appears in list immediately
- ✅ Shows:
  - 5-star rating
  - Your comment
  - Your name
  - "Verified Purchase" badge
  - Current date
- ✅ Review form disappears
- ✅ Cannot submit second review for same version

---

## Test 4.5: Submit Review - Rating Only (No Comment)

**Steps:**
1. Eligible buyer on agent detail page
2. Click 4 stars
3. Leave comment empty
4. Click **"Submit Review"**

**Expected:**
- ✅ Review submits successfully
- ✅ Shows 4-star rating
- ✅ No comment displayed
- ✅ Still shows "Verified Purchase" badge

---

## Test 4.6: Review Validation

**Test 4.6a: No Rating**
1. Leave rating at 0 stars
2. Add comment
3. Try to submit

**Expected:**
- ✅ Error: "Please select a rating"
- ✅ Form does not submit

**Test 4.6b: Comment Too Long**
1. Select rating
2. Paste 1500 characters in comment (limit is 1000)
3. Try to submit

**Expected:**
- ✅ Character counter shows "1500/1000"
- ✅ Error: "Comment must be 1000 characters or less"
- ✅ OR textarea limits input to 1000 chars

**Test 4.6c: Already Reviewed**
1. Try to submit second review for same agent version
2. API should reject

**Expected:**
- ✅ Error: "You have already reviewed this version"
- ✅ Form not visible (client-side check)

---

## Test 4.7: View Reviews on Agent Page

**Steps:**
1. Go to any agent with reviews
2. Scroll to Reviews section

**Expected:**
- ✅ See **average rating** at top (e.g., 4.5 ⭐)
- ✅ See **total review count** (e.g., "Based on 12 reviews")
- ✅ Reviews listed newest first
- ✅ Each review shows:
  - Reviewer name
  - Star rating (visual stars)
  - Comment (if provided)
  - "Verified Purchase" badge
  - Relative date (e.g., "2 days ago")
- ✅ Pagination if more than 10 reviews (future)

---

## Test 4.8: Seller Views Reviews in Dashboard

**Steps:**
1. Login as seller
2. Go to Seller Dashboard
3. Scroll to **"Reviews"** section

**Expected:**
- ✅ See all reviews for all your agents
- ✅ Each review shows which agent it's for
- ✅ Shows buyer name, rating, comment
- ✅ Shows date received
- ✅ Can filter by agent (future)
- ✅ Can see average rating per agent

---

# 🔄 PART 5: CROSS-ROLE FEATURES (4 Tests)

## Test 5.1: Role Visibility in Header

**Steps:**
1. Login as each role (Buyer, Seller, Admin)
2. Check profile dropdown

**Expected:**

**Buyer:**
- ✅ Role badge: "Buyer"
- ✅ Links: My Library
- ✅ No Seller Dashboard
- ✅ No Admin Panel

**Seller:**
- ✅ Role badge: "Seller"
- ✅ Links: My Library, Seller Dashboard
- ✅ No Admin Panel

**Admin:**
- ✅ Role badge: "Admin"
- ✅ Links: My Library, Seller Dashboard, Admin Panel
- ✅ All features accessible

---

## Test 5.2: Navigation and Permissions

**Test Access Control:**

| Page | Buyer | Seller | Admin |
|------|-------|--------|-------|
| `/` (Homepage) | ✅ | ✅ | ✅ |
| `/agents` | ✅ | ✅ | ✅ |
| `/agents/[slug]` | ✅ | ✅ | ✅ |
| `/library` | ✅ (own) | ✅ (own) | ✅ (own) |
| `/dashboard` (Seller) | ❌ 403 | ✅ | ✅ |
| `/submit-agent` | ❌ 403 | ✅ | ✅ |
| `/admin` | ❌ 403 | ❌ 403 | ✅ |
| `/admin/review-queue` | ❌ 403 | ❌ 403 | ✅ |

**Steps:**
1. Login as buyer
2. Try to access `/dashboard` directly
3. Should see 403 Forbidden or redirect

**Expected:**
- ✅ Buyers blocked from seller/admin pages
- ✅ Sellers blocked from admin pages
- ✅ Admins can access everything

---

## Test 5.3: User Can Switch Roles (Upgrade)

**Steps:**
1. Login as buyer
2. Admin runs:
   ```sql
   UPDATE users SET role = 'SELLER' WHERE email = 'buyer@test.com';
   ```
3. Buyer refreshes page or logs out/in

**Expected:**
- ✅ Role badge updates to "Seller"
- ✅ "Seller Dashboard" link appears
- ✅ Can now submit agents
- ✅ Still retains buyer features (library)

---

## Test 5.4: Search and Category Filters

**Steps:**
1. Login as any role
2. Go to `/agents`
3. Test filters:
   - Select category
   - Enter search term
   - Combine both

**Expected:**
- ✅ Category filter works
- ✅ Search filter works
- ✅ Both filters can combine
- ✅ Results update without page reload
- ✅ URL updates with query params
- ✅ Can share filtered URL

---

# 🛠️ PART 6: ADDITIONAL TESTING (Helper Scripts & Tools)

## Helper Scripts Location

All scripts are in `/scripts/` directory:

### 1. Grant Admin Access
```bash
npx tsx scripts/grant-admin-sql.ts user@example.com
```

### 2. Make Purchase Eligible for Review
```bash
npx tsx scripts/make-purchase-eligible.ts USER_ID AGENT_ID
```

### 3. Create Test Review
```bash
npx tsx scripts/create-test-review.ts
```

### 4. Manage Agent Status
```bash
npx tsx scripts/manage-agent-status.ts AGENT_ID approve
npx tsx scripts/manage-agent-status.ts AGENT_ID reject
```

---

## Database Queries for Testing

### Check User Roles
```sql
SELECT id, email, name, role FROM users ORDER BY created_at DESC;
```

### Check All Agents
```sql
SELECT id, title, seller_id, status, created_at
FROM agents
ORDER BY created_at DESC;
```

### Check Purchases
```sql
SELECT
  p.id,
  p.purchased_at,
  p.status,
  u.email as buyer_email,
  a.title as agent_title
FROM purchases p
JOIN users u ON p.buyer_id = u.id
JOIN agents a ON p.agent_id = a.id
ORDER BY p.purchased_at DESC;
```

### Check Reviews
```sql
SELECT
  r.id,
  r.rating,
  r.comment,
  u.email as reviewer_email,
  a.title as agent_title,
  r.verified_purchase,
  r.created_at
FROM reviews r
JOIN users u ON r.buyer_id = u.id
JOIN agents a ON r.agent_id = a.id
ORDER BY r.created_at DESC;
```

### Platform Statistics
```sql
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE role = 'BUYER') as buyers,
  (SELECT COUNT(*) FROM users WHERE role = 'SELLER') as sellers,
  (SELECT COUNT(*) FROM users WHERE role = 'ADMIN') as admins,
  (SELECT COUNT(*) FROM agents WHERE status = 'APPROVED') as approved_agents,
  (SELECT COUNT(*) FROM agents WHERE status = 'PENDING') as pending_agents,
  (SELECT COUNT(*) FROM agents WHERE status = 'REJECTED') as rejected_agents,
  (SELECT COUNT(*) FROM purchases WHERE status = 'COMPLETED') as completed_purchases,
  (SELECT COUNT(*) FROM reviews) as total_reviews,
  (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews) as avg_rating;
```

---

# 📊 TESTING SUMMARY CHECKLIST

## Buyer Flow ✅
- [ ] Sign up / Login
- [ ] Browse agents
- [ ] Filter by category
- [ ] Search agents
- [ ] View agent details
- [ ] Purchase agent
- [ ] Access library
- [ ] Check review eligibility
- [ ] Leave review (after 14 days)
- [ ] Logout

## Seller Flow ✅
- [ ] Login as seller
- [ ] Access dashboard
- [ ] Submit new agent
- [ ] View pending agent
- [ ] Edit draft agent
- [ ] Cannot edit approved agent
- [ ] View agent reviews
- [ ] Seller can also buy
- [ ] Cannot buy own agent
- [ ] Manage multiple agents

## Admin Flow ✅
- [ ] Login as admin
- [ ] Access admin panel
- [ ] Approve pending agent
- [ ] Reject pending agent
- [ ] View all agents
- [ ] Override agent status
- [ ] View platform stats
- [ ] Manage user roles

## Reviews & Ratings ✅
- [ ] No purchase = no review
- [ ] Too soon = blocked (14 days)
- [ ] Make eligible (helper script)
- [ ] Submit review with comment
- [ ] Submit review without comment
- [ ] Review validation tests
- [ ] View reviews on agent page
- [ ] Seller views reviews in dashboard

## Cross-Role Features ✅
- [ ] Role badges in header
- [ ] Navigation permissions
- [ ] Role upgrade/downgrade
- [ ] Search and filters

---

# 🚨 Known Issues & Limitations

1. **Payment:** Currently using Stripe test mode. Real payments not enabled.
2. **Email Notifications:** Not implemented yet. No emails sent on review/purchase.
3. **Agent Versioning:** Update system in progress. Approved agents can't be directly edited.
4. **File Uploads:** Agent images use placeholders. Image upload not implemented.
5. **Analytics Dashboard:** Seller/Admin analytics coming soon.
6. **Review Replies:** Sellers can't reply to reviews yet.
7. **Review Moderation:** Admins can't moderate/delete reviews yet.

---

# ✅ Success Criteria

**Buyer Experience:**
- Can browse, search, filter agents ✅
- Can purchase agents ✅
- Can access library ✅
- Can leave reviews after 14 days ✅

**Seller Experience:**
- Can submit agents for review ✅
- Can view agent status ✅
- Can see reviews on dashboard ✅
- Can also purchase other agents ✅

**Admin Experience:**
- Can approve/reject agents ✅
- Can access all features ✅
- Can manage user roles ✅
- Can view platform stats ✅

**Reviews System:**
- Purchase-based eligibility ✅
- 14-day waiting period ✅
- Verified purchase badges ✅
- Star ratings + optional comments ✅
- Seller visibility into reviews ✅

---

# 📞 Support

If you encounter any issues during testing:

1. Check browser console for errors (F12 → Console)
2. Check Netlify function logs for API errors
3. Check Supabase logs for database errors
4. Review [PRODUCTION_TROUBLESHOOTING.md](PRODUCTION_TROUBLESHOOTING.md)

**Platform:** https://hireyourai.netlify.app
**Supabase Dashboard:** https://supabase.com/dashboard/project/vuzmyajbuwuwqkvjejlv
**Netlify Dashboard:** https://app.netlify.com

---

**Document Version:** 1.0
**Last Updated:** 2024-12-24
**Testing Status:** Ready for comprehensive end-to-end testing
