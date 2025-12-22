# Manual Test Cases - AI Agent Marketplace

## Prerequisites
1. Dev server running: `npm run dev`
2. Three test accounts:
   - **Buyer Account**: Regular user (role: BUYER)
   - **Seller Account**: User with SELLER role
   - **Admin Account**: User with ADMIN role (saksham@socialripple.ai)

## Quick Setup Commands
```bash
# Set user roles (run these in terminal)
npx tsx scripts/set-user-role.ts buyer@example.com BUYER
npx tsx scripts/set-user-role.ts seller@example.com SELLER
npx tsx scripts/set-user-role.ts saksham@socialripple.ai ADMIN

# Sync existing Supabase users to Prisma
npx tsx scripts/sync-users.ts
```

---

## Test Suite 0: Authentication & Role-Based Routing ✨ NEW

### TC-0.1: User Signup
**Steps:**
1. Navigate to `/signup`
2. Enter email, password, and name
3. Submit form

**Expected:**
- ✅ User created in Supabase Auth
- ✅ User synced to Prisma database with BUYER role
- ✅ Redirect to `/agents` marketplace
- ✅ Success message shown

### TC-0.2: Login as Buyer
**Steps:**
1. Navigate to `/login`
2. Login with buyer credentials

**Expected:**
- ✅ Redirect to `/agents` (marketplace)
- ✅ Header shows "My Library" in user menu
- ✅ Role shows as "buyer" in dropdown

### TC-0.3: Login as Seller
**Steps:**
1. Navigate to `/login`
2. Login with seller credentials

**Expected:**
- ✅ Redirect to `/dashboard` (seller dashboard)
- ✅ Header shows "My Library" + "Seller Dashboard" in user menu
- ✅ Role shows as "seller" in dropdown

### TC-0.4: Login as Admin
**Steps:**
1. Navigate to `/login`
2. Login with admin credentials (saksham@socialripple.ai)

**Expected:**
- ✅ Redirect to `/admin` (admin panel)
- ✅ Header shows "My Library" + "Seller Dashboard" + "Admin Panel"
- ✅ Role shows as "admin" in dropdown

### TC-0.5: Login with ?next Parameter
**Steps:**
1. Logout
2. Try to access `/checkout/some-agent-id`
3. Login when redirected

**Expected:**
- ✅ Redirect to `/login?next=/checkout/some-agent-id`
- ✅ After login, return to `/checkout/some-agent-id`

---

## Test Suite 1: Seller - Agent Creation ✨ UPDATED

### TC-1.1: Create New Agent with All Fields
**Steps:**
1. Login as **Seller**
2. Navigate to `/submit-agent` or click "Create New Agent"
3. Fill all fields:
   - Title: "Test AI Agent"
   - Category: Select any
   - Price: 49.99
   - Short Description: "Test description"
   - Workflow Overview: "# How it works\nStep 1..."
   - Use Case: "Best for testing"
   - Demo Video URL: "https://youtube.com/watch?v=test"
   - **Thumbnail URL**: "https://picsum.photos/1200/630" ✨ NEW
   - **Setup Guide**: "# Installation\n\n```bash\nnpm install test\n```" ✨ NEW
4. Click "Submit Agent for Review"

**Expected:**
- ✅ Agent created successfully
- ✅ Redirect to `/dashboard?success=created`
- ✅ **Green success banner** shown: "Agent created successfully!" ✨ NEW
- ✅ Agent appears in dashboard with DRAFT status
- ✅ Setup guide is saved (not placeholder)
- ✅ Thumbnail URL is saved

### TC-1.2: Validation - Missing Setup Guide
**Steps:**
1. Login as **Seller**
2. Try to create agent WITHOUT filling setup guide
3. Submit form

**Expected:**
- ✅ Error message: "Setup guide is required and must be at least 10 characters"
- ✅ Form not submitted

### TC-1.3: Submit Agent for Review
**Steps:**
1. Login as **Seller**
2. Go to `/dashboard`
3. Find DRAFT agent
4. Click "Submit for Review"

**Expected:**
- ✅ Agent status changes to UNDER_REVIEW
- ✅ Agent appears in Admin Panel pending list

---

## Test Suite 2: Admin - Agent Approval ✨ NEW

### TC-2.1: View Admin Dashboard
**Steps:**
1. Login as **Admin** (saksham@socialripple.ai)
2. Navigate to `/admin`

**Expected:**
- ✅ Admin dashboard loads
- ✅ Stats cards show:
  - Pending Review count
  - Approved Agents count
  - Total Purchases count
- ✅ Pending agents list shows all UNDER_REVIEW agents
- ✅ Each agent shows: title, category, version, price, seller name, submit date

### TC-2.2: Approve Agent
**Steps:**
1. Login as **Admin**
2. Go to `/admin`
3. Find pending agent
4. Click green checkmark (approve button)

**Expected:**
- ✅ Agent status changes to APPROVED
- ✅ `approvedAt` timestamp set
- ✅ Agent appears on marketplace (`/agents`)
- ✅ Admin log created in database
- ✅ Dashboard refreshes, agent moves to "Recent Actions"

### TC-2.3: Reject Agent with Reason
**Steps:**
1. Login as **Admin**
2. Go to `/admin`
3. Find pending agent
4. Click red X (reject button)
5. Enter rejection reason: "Missing detailed workflow steps"
6. Click "Reject Agent"

**Expected:**
- ✅ Rejection dialog appears
- ✅ Cannot submit without reason
- ✅ Agent status changes to REJECTED
- ✅ Rejection reason saved to database
- ✅ Admin log created
- ✅ Agent appears in "Recent Actions" with red badge

### TC-2.4: Preview Agent from Admin Panel
**Steps:**
1. Login as **Admin**
2. Go to `/admin`
3. Click "Preview" button on any pending agent

**Expected:**
- ✅ Navigate to agent detail page
- ✅ Can view all content (even if not approved)
- ✅ CTA button shows "Not Available" (since not approved yet)

---

## Test Suite 3: Browse & Discovery

### TC-3.1: View Approved Agents on Marketplace
**Steps:**
1. Navigate to `/agents`
2. Verify agents are displayed

**Expected:**
- ✅ Only APPROVED agents with `hasActiveUpdate: false` are shown
- ✅ Each agent shows: title, price, category
- ✅ **Thumbnail images displayed** if available ✨ FIXED

### TC-3.2: Share Button Functionality ✨ NEW
**Steps:**
1. Navigate to any agent page
2. Click share button (top right)

**Expected (Mobile):**
- ✅ Native share sheet opens
- ✅ Can share to apps (WhatsApp, Telegram, etc.)

**Expected (Desktop):**
- ✅ URL copied to clipboard
- ✅ Button shows checkmark for 2 seconds
- ✅ Can paste URL in browser

---

## Test Suite 4: Agent Detail Page (Not Purchased)

### TC-4.1: View Agent Detail Page (Not Logged In)
**Steps:**
1. Log out (if logged in)
2. Navigate to any approved agent page (e.g., `/agents/agent-slug`)

**Expected:**
- ✅ Demo video and workflow overview visible
- ✅ Setup guide section shows **locked state** with lock icon
- ✅ CTA button shows: **"Unlock Setup Guide"**
- ✅ Price displayed in hero section
- ✅ Share button functional ✨ FIXED

### TC-4.2: View Agent Detail Page (Logged In, Not Purchased)
**Steps:**
1. Login as **Buyer**
2. Navigate to approved agent page

**Expected:**
- ✅ Same as TC-4.1
- ✅ CTA button is clickable and links to `/checkout/{agentId}`

### TC-4.3: Unapproved Agent - CTA Disabled
**Steps:**
1. Ask seller to create agent in DRAFT or UNDER_REVIEW status
2. Login as **Buyer**
3. Try to access agent page directly (get slug from database)

**Expected:**
- ✅ CTA button shows: **"Not Available"**
- ✅ Button is **disabled**
- ✅ Setup guide section shows: "Not Available for Purchase"

---

## Test Suite 5: Checkout Flow (Test Mode)

### TC-5.1: Access Checkout Page (Valid Agent)
**Steps:**
1. Login as **Buyer**
2. Click "Unlock Setup Guide" on approved agent
3. Verify redirect to `/checkout/{agentId}`

**Expected:**
- ✅ Page displays agent details:
  - Agent title
  - Agent version badge (e.g., "v1")
  - Category badge
  - Seller name
  - Price
  - **Thumbnail image** (if available) ✨ UPDATED
- ✅ "What's Included" section shows:
  - Complete Setup Guide
  - Workflow Details
  - Lifetime Access
- ✅ Blue info banner: **"Test Mode – No payment required"**
- ✅ Button shows: **"Confirm & Unlock (Test Mode)"**

### TC-5.2: Block Checkout for Unapproved Agent
**Steps:**
1. Login as **Buyer**
2. Navigate directly to `/checkout/{unapproved-agent-id}`

**Expected:**
- ✅ Error card displayed: **"Agent Not Available"**
- ✅ Message: "This agent is not available for purchase"
- ✅ "Browse Agents" button shown

### TC-5.3: Block Checkout When Not Logged In
**Steps:**
1. Log out
2. Navigate to `/checkout/{agent-id}`

**Expected:**
- ✅ Redirect to `/login?next=/checkout/{agent-id}`
- ✅ After login, return to checkout page

---

## Test Suite 6: Purchase Confirmation

### TC-6.1: Successful Test Purchase
**Steps:**
1. Login as **Buyer**
2. Navigate to checkout page for approved agent
3. Click **"Confirm & Unlock (Test Mode)"**

**Expected:**
- ✅ Button shows: **"Processing..."** with spinner
- ✅ Redirect to `/agents/{slug}?unlocked=true`
- ✅ Green success banner appears at top:
  - ✅ Message: "Setup guide unlocked successfully!"
  - ✅ Button: "Go to Setup Guide"
- ✅ Setup guide section now **unlocked** (no lock icon)
- ✅ **Setup guide content visible** with markdown rendering ✨ FIXED
- ✅ Hero CTA button changes to: **"Already Unlocked"** (green, disabled)

### TC-6.2: Click "Go to Setup Guide" Button
**Steps:**
1. After successful purchase, click **"Go to Setup Guide"** in success banner

**Expected:**
- ✅ Page smoothly scrolls to unlocked setup guide section

### TC-6.3: Prevent Duplicate Purchase
**Steps:**
1. After purchasing agent, navigate back to `/checkout/{same-agent-id}`

**Expected:**
- ✅ "Already Unlocked" card displayed
- ✅ Message: "You already own this agent"
- ✅ "View Agent" button shown
- ✅ Cannot purchase again

### TC-6.4: Purchase Count Increment
**Steps:**
1. Note agent's purchase count before purchase
2. Complete test purchase
3. Refresh agent page

**Expected:**
- ✅ Purchase count incremented by 1

---

## Test Suite 7: Access Control & Persistence

### TC-7.1: Setup Guide Persists After Page Refresh
**Steps:**
1. Purchase agent
2. Refresh page (F5)

**Expected:**
- ✅ Setup guide remains **unlocked**
- ✅ Content still visible
- ✅ Success banner **not shown** (only shows with `?unlocked=true`)

### TC-7.2: Setup Guide Persists Across Sessions
**Steps:**
1. Purchase agent
2. Logout
3. Login again as same buyer
4. Navigate to agent page

**Expected:**
- ✅ Setup guide **still unlocked**
- ✅ CTA shows "Already Unlocked"

### TC-7.3: Different User Cannot See Unlocked Content
**Steps:**
1. Login as **Buyer A**, purchase agent
2. Logout
3. Login as **Buyer B** (different account)
4. Navigate to same agent

**Expected:**
- ✅ Setup guide shows **locked** for Buyer B
- ✅ CTA shows "Unlock Setup Guide"

---

## Test Suite 8: Buyer Library

### TC-8.1: View Empty Library
**Steps:**
1. Login as **new Buyer** (no purchases)
2. Navigate to `/library`

**Expected:**
- ✅ Empty state card shown
- ✅ Message: "No agents unlocked yet"
- ✅ "Browse Agents" button visible

### TC-8.2: View Library with Purchases
**Steps:**
1. Purchase 2-3 agents
2. Navigate to `/library`

**Expected:**
- ✅ All purchased agents displayed as cards
- ✅ Each card shows:
  - Agent title
  - Version badge (e.g., "v1")
  - Category name
  - **Thumbnail image** ✨ UPDATED
  - Unlock date (e.g., "Unlocked 2 minutes ago")
  - Amount paid
  - "Test Purchase" badge
- ✅ "View Agent" button on each card
- ✅ Header shows count: "3 agents unlocked"

### TC-8.3: Navigate from Library to Agent
**Steps:**
1. In library, click **"View Agent"** on any purchased agent

**Expected:**
- ✅ Navigate to agent page
- ✅ Setup guide is **unlocked**
- ✅ No success banner (since not from checkout)

---

## Test Suite 9: Database Verification

### TC-9.1: Purchase Record Created Correctly
**Steps:**
1. Complete test purchase
2. Check database: `purchases` table

**Expected:**
```sql
SELECT * FROM purchases WHERE buyer_id = '{buyer-id}' ORDER BY created_at DESC LIMIT 1;
```
- ✅ `buyer_id` matches logged-in user
- ✅ `agent_id` matches purchased agent
- ✅ `agent_version_id` matches agent ID (same for v1)
- ✅ `amount_paid` matches agent price
- ✅ `source` = `'TEST_MODE'`
- ✅ `status` = `'COMPLETED'`
- ✅ `purchased_at` timestamp populated

### TC-9.2: Unique Constraint Enforced
**Steps:**
1. Try to create duplicate purchase manually in database

**Expected:**
```sql
INSERT INTO purchases (buyer_id, agent_id, agent_version_id, amount_paid, source, status)
VALUES ('{buyer-id}', '{agent-id}', '{agent-version-id}', 10.00, 'TEST_MODE', 'COMPLETED');
```
- ✅ Error: **Unique constraint violation on `buyerId_agentVersionId`**

### TC-9.3: User Sync Verification ✨ NEW
**Steps:**
1. Check database users table
2. Check Supabase Auth users

**Expected:**
- ✅ All Supabase Auth users exist in Prisma users table
- ✅ User IDs match between Supabase and Prisma
- ✅ Default role is BUYER for new signups

---

## Test Suite 10: Edge Cases

### TC-10.1: Attempt Checkout Without Authentication
**Steps:**
1. Logout
2. Manually navigate to `/checkout/{agent-id}`

**Expected:**
- ✅ Redirect to `/login?next=/checkout/{agent-id}`

### TC-10.2: View Purchased Agent After Seller Updates It
**Steps:**
1. Buyer purchases agent v1
2. Seller requests update (creates v2 DRAFT)
3. Admin approves v2
4. Buyer views original agent

**Expected:**
- ✅ Buyer still has access to **v1 setup guide** (purchased version)
- ✅ Marketplace now shows **v2** (new version)
- ✅ Buyer can purchase **v2** separately if desired

### TC-10.3: Test Mode Labeling Consistency
**Steps:**
1. Complete entire flow and verify labels

**Expected:**
- ✅ Checkout page shows: "Test Mode – No payment required"
- ✅ Confirm button shows: "Confirm & Unlock (Test Mode)"
- ✅ Library shows: "Test Purchase" badge
- ✅ No Stripe UI elements visible

---

## Test Suite 11: UI/UX Validation

### TC-11.1: Success Banner Visibility
**Steps:**
1. Purchase agent
2. Check URL has `?unlocked=true`

**Expected:**
- ✅ Green banner visible with checkmark icon
- ✅ Banner positioned at top of page
- ✅ "Go to Setup Guide" button functional

### TC-11.2: Unlocked Setup Guide Styling
**Steps:**
1. Purchase agent
2. Scroll to setup guide section

**Expected:**
- ✅ Green border on setup guide card
- ✅ Green checkmark icon next to title
- ✅ Markdown content properly rendered
- ✅ No blur/lock overlay

### TC-11.3: Locked Setup Guide Styling
**Steps:**
1. View unpurchased agent

**Expected:**
- ✅ Lock icon visible
- ✅ Blur gradient at bottom
- ✅ "Unlock Setup Guide" button centered

---

## Quick Smoke Test (10 minutes)

Run this minimal test to verify ALL core functionality:

### Authentication & Roles
1. ✅ Signup → creates BUYER, redirects to `/agents`
2. ✅ Login as BUYER → redirects to `/agents`
3. ✅ Login as SELLER → redirects to `/dashboard`
4. ✅ Login as ADMIN → redirects to `/admin`

### Agent Creation
5. ✅ Create agent with setup guide → success banner shown
6. ✅ Submit for review → appears in admin panel

### Admin Approval
7. ✅ Approve agent → appears on marketplace
8. ✅ Reject agent → shows in recent actions

### Purchase Flow
9. ✅ Browse agents → agents with thumbnails visible
10. ✅ Click agent → detail page loads, share button works
11. ✅ Setup guide **locked** (if not purchased)
12. ✅ Click "Unlock Setup Guide" → checkout page
13. ✅ Click "Confirm & Unlock" → success
14. ✅ Setup guide **unlocked** with actual content
15. ✅ Navigate to `/library` → purchased agent visible
16. ✅ Try to checkout again → "Already Unlocked" message


## Test Data Setup

### Create Test Users
```bash
# Sync existing Supabase users
npx tsx scripts/sync-users.ts

# Set roles
npx tsx scripts/set-user-role.ts buyer@test.com BUYER
npx tsx scripts/set-user-role.ts seller@test.com SELLER
npx tsx scripts/set-user-role.ts saksham@socialripple.ai ADMIN
```

### Create Approved Agent for Testing
```sql
-- Find an agent and approve it
UPDATE agents SET status = 'APPROVED', approved_at = NOW()
WHERE id = '{agent-id}';
```

---

## Success Criteria

✅ **All 11 test suites pass**
✅ **No console errors** during flow
✅ **Prisma queries execute successfully**
✅ **UI matches designs** (locked/unlocked states)
✅ **Access control enforced** server-side
✅ **No duplicate purchases** possible
✅ **Library shows all purchases**
✅ **Role-based routing works**
✅ **Admin can approve/reject agents**
✅ **Setup guide content properly saved**
✅ **Thumbnails display correctly**
✅ **Share button functional**

---

## Next Steps After Testing

Once all tests pass:
1. ✅ Document any bugs found
2. ✅ Verify schema migrations applied
3. ⏳ Test Stripe integration readiness (schema compatible)
4. ⏳ Performance test with 100+ purchases in library
5. ⏳ Add email notifications for approval/rejection
6. ⏳ Add seller earnings dashboard