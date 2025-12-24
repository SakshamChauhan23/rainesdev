# Testing the Reviews System

## 🧪 Complete Testing Guide

This guide will walk you through testing all aspects of the Ratings & Reviews system.

---

## Prerequisites

1. **Database is running** (Mumbai Supabase)
2. **Development server is running**: `npm run dev`
3. **You have test accounts**:
   - A buyer account
   - A seller account
   - An admin account (optional)

---

## Test Scenario 1: User Without Purchase (NO_PURCHASE)

### Steps:

1. **Create or log in as a buyer** who hasn't purchased any agents
2. **Navigate to any agent detail page**
3. **Scroll to the Reviews section**

### Expected Result:

You should see a **blue information banner**:
```
Purchase Required
You need to purchase this agent before leaving a review.
```

- ✅ No review form visible
- ✅ Reviews list still visible (showing existing reviews if any)
- ✅ Banner has info icon

---

## Test Scenario 2: Recent Purchase (TOO_SOON)

This is the **most common state** for new purchases. We need to test the 14-day waiting period.

### Option A: Create a New Test Purchase

1. **Log in as a buyer**
2. **Purchase an agent** (using test mode)
3. **Return to the agent detail page**
4. **Scroll to Reviews section**

### Expected Result:

You should see a **yellow warning banner**:
```
Review Coming Soon
Reviews unlock after you've had time to use this agent (14 days remaining).
This ensures reviews are based on real usage and outcomes.
```

- ✅ No review form visible
- ✅ Shows exact days remaining (14 days for new purchase)
- ✅ Banner has clock icon

### Option B: Use Existing Purchase (Quick Test)

Since we have existing purchases in the database, let's use one:

```bash
# Find an existing purchase
npx tsx scripts/test-review-eligibility.ts
```

This will output something like:
```
Found purchase:
  Buyer: zuvystudent01@gmail.com (1a62f468-5aa7-48f6-b40e-b672c760ac77)
  Agent: Sample AI Agent (cmjerxu2z0001k3p346ruvw75)
  Purchased: Sun Dec 21 2025 23:19:03 GMT+0530
  Days until eligible: 12
```

Now:
1. **Log in with that buyer account** (zuvystudent01@gmail.com)
2. **Navigate to that agent's page**
3. **Check the reviews section**

You should see "12 days remaining" message.

---

## Test Scenario 3: Eligible to Review (14+ Days)

To test this, we need to **simulate a 14+ day old purchase**. Here's how:

### Method 1: Modify Purchase Date (Recommended for Testing)

```bash
# Create a script to make a purchase eligible
npx tsx scripts/make-purchase-eligible.ts
```

Create this script:

```typescript
// scripts/make-purchase-eligible.ts
import { prisma } from '../src/lib/prisma'

async function makePurchaseEligible() {
  // Find first completed purchase
  const purchase = await prisma.purchase.findFirst({
    where: { status: 'COMPLETED' },
    include: { buyer: true, agent: true }
  })

  if (!purchase) {
    console.log('No purchases found')
    return
  }

  // Set purchased date to 15 days ago
  const fifteenDaysAgo = new Date()
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { purchasedAt: fifteenDaysAgo }
  })

  console.log('✅ Purchase made eligible!')
  console.log(`Buyer: ${purchase.buyer.email}`)
  console.log(`Agent: ${purchase.agent.title}`)
  console.log(`Agent Slug: ${purchase.agent.slug}`)
  console.log(`\nTest URL: http://localhost:3000/agents/${purchase.agent.slug}`)
  console.log(`Login as: ${purchase.buyer.email}`)

  await prisma.$disconnect()
}

makePurchaseEligible()
```

Then run:
```bash
npx tsx scripts/make-purchase-eligible.ts
```

### Test Steps:

1. **Log in as the buyer** shown in the script output
2. **Navigate to the agent page** (URL provided in output)
3. **Scroll to Reviews section**

### Expected Result:

You should see the **Review Form**:
- ✅ "Leave a Review" heading
- ✅ 5 clickable stars (with hover effects)
- ✅ Comment textarea (optional)
- ✅ Character counter (0/1000)
- ✅ "Submit Review" button

---

## Test Scenario 4: Submit a Review

### Steps:

1. **Ensure you're eligible** (from Test Scenario 3)
2. **Click on stars** to select rating (try hovering first to see hover effect)
3. **Type a comment** (optional):
   ```
   "This agent automated 80% of our lead generation process.
   ROI was positive within the first month. Highly recommend
   for B2B companies looking to scale outreach."
   ```
4. **Click "Submit Review"**

### Expected Result:

- ✅ Button shows "Submitting..." while processing
- ✅ Form disappears after submission
- ✅ Success banner appears: "Review Submitted" (green)
- ✅ Your review appears in the reviews list below
- ✅ Review shows "Verified Buyer" badge
- ✅ Star rating displays correctly
- ✅ Average rating updates in the summary box

---

## Test Scenario 5: Attempt Duplicate Review (ALREADY_REVIEWED)

### Steps:

1. **Same user who just submitted a review**
2. **Refresh the page**
3. **Scroll to Reviews section**

### Expected Result:

You should see a **green confirmation banner**:
```
Review Submitted
You have already reviewed this version of the agent.
```

- ✅ No review form visible
- ✅ Your existing review is still displayed below
- ✅ Cannot submit another review

---

## Test Scenario 6: Seller Cannot Review Own Agent

### Steps:

1. **Log in as a seller**
2. **Navigate to YOUR OWN agent's page**
3. **Scroll to Reviews section**

### Expected Result:

- ✅ No review form or eligibility banners shown
- ✅ Only reviews list is visible
- ✅ Reviews from buyers are displayed

**Note:** The review section component checks `userRole === 'BUYER'` before showing any eligibility UI.

---

## Test Scenario 7: Submit Review Before 14 Days (API Test)

This tests the **server-side enforcement** to ensure buyers can't bypass the UI restrictions.

### Steps:

```bash
# Run the test script
npx tsx scripts/test-review-submission.ts
```

### Expected Result:

```json
Response status: 403
Response: {
  "success": false,
  "error": "You can review this agent in 12 days",
  "eligibilityDate": "2026-01-04T17:49:03.638Z"
}
```

- ✅ Server rejects the request
- ✅ Returns proper error message
- ✅ Shows eligibility date

---

## Test Scenario 8: Invalid Review Submission (Validation)

Test the validation rules by submitting invalid data via API:

### Test 8a: Missing Rating

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "USER_ID",
    "agentId": "AGENT_ID",
    "comment": "Great agent!"
  }'
```

**Expected:** 400 error - "Missing required fields"

### Test 8b: Invalid Rating (0)

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "USER_ID",
    "agentId": "AGENT_ID",
    "rating": 0,
    "comment": "Test"
  }'
```

**Expected:** 400 error - "Rating must be between 1 and 5"

### Test 8c: Comment Too Long

```bash
# Create a comment > 1000 characters
curl -X POST http://localhost:3000/api/reviews \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "USER_ID",
    "agentId": "AGENT_ID",
    "rating": 5,
    "comment": "A very long comment...[1001 characters]"
  }'
```

**Expected:** 400 error - "Comment must be 1000 characters or less"

---

## Test Scenario 9: Reviews Display to Non-Buyers

### Steps:

1. **Log out** (or use incognito window)
2. **Navigate to an agent with reviews**
3. **Scroll to Reviews section**

### Expected Result:

- ✅ Reviews list is visible
- ✅ Average rating and count displayed
- ✅ Individual reviews show correctly
- ✅ "Verified Buyer" badges visible
- ✅ NO review form or eligibility banners (not logged in)

---

## Test Scenario 10: Seller Dashboard Reviews

### Steps:

1. **Log in as a seller** who has agents with reviews
2. **Navigate to `/dashboard`**
3. **Scroll to "Reviews" section** at the bottom

### Expected Result:

If you have reviews:
- ✅ "Overall Review Stats" card shows:
  - Average rating (e.g., 4.5)
  - Total reviews count
  - Number of agents reviewed
- ✅ "Reviews by Agent" section shows:
  - Each agent with its average rating
  - Review count per agent
  - Click to expand/collapse reviews
- ✅ Individual reviews show:
  - Star rating
  - Buyer name
  - Comment (if provided)
  - Timestamp ("3 days ago")

If no reviews yet:
- ✅ Shows "No reviews yet" message
- ✅ Helpful text: "Reviews will appear here after buyers use your agents"

---

## Test Scenario 11: Average Rating Calculation

### Steps:

1. **Submit multiple reviews** with different ratings:
   - Review 1: 5 stars
   - Review 2: 4 stars
   - Review 3: 5 stars
2. **Check agent page reviews section**

### Expected Result:

- ✅ Average rating: 4.7 (14/3 = 4.666... rounded to 1 decimal)
- ✅ Total reviews: 3
- ✅ All three reviews displayed below

---

## Quick Testing Checklist

Use this checklist to verify all features:

### Eligibility States
- [ ] NO_PURCHASE - Blue banner shown
- [ ] TOO_SOON - Yellow banner with days remaining
- [ ] ALREADY_REVIEWED - Green banner shown
- [ ] ELIGIBLE - Review form appears

### Review Submission
- [ ] Star rating works (hover + click)
- [ ] Character counter updates
- [ ] Can submit with rating only
- [ ] Can submit with rating + comment
- [ ] Shows "Submitting..." state
- [ ] Success confirmation appears

### Review Display
- [ ] Reviews show on agent page
- [ ] Average rating calculates correctly
- [ ] "Verified Buyer" badge appears
- [ ] Timestamps show ("3 days ago")
- [ ] Empty state shows when no reviews

### Seller Dashboard
- [ ] Overall stats display
- [ ] Reviews grouped by agent
- [ ] Can expand/collapse agent sections
- [ ] All reviews visible

### Security/Validation
- [ ] Cannot review before 14 days
- [ ] Cannot submit duplicate review
- [ ] Cannot review own agent
- [ ] Rating must be 1-5
- [ ] Comment max 1000 characters

---

## Common Issues & Fixes

### Issue: "No review form appears even after 14 days"

**Debug Steps:**
```bash
# Check eligibility
curl 'http://localhost:3000/api/reviews/eligibility?userId=USER_ID&agentId=AGENT_ID'

# Check purchase date
npx prisma studio
# Navigate to Purchase table
# Find the purchase and check purchasedAt date
```

### Issue: "Reviews not showing on agent page"

**Check:**
1. Agent status is APPROVED (only show reviews for approved agents)
2. Reviews exist in database:
```bash
npx prisma studio
# Check Review table
```

### Issue: "Average rating not updating"

**Solution:**
- Refresh the page
- Check if caching is interfering (clear browser cache)
- Verify stats calculation in API response:
```bash
curl 'http://localhost:3000/api/reviews?agentId=AGENT_ID' | jq '.stats'
```

---

## Database Inspection

To manually check reviews in the database:

```bash
# Open Prisma Studio
npx prisma studio

# Then navigate to:
# 1. "Review" table - see all reviews
# 2. "Purchase" table - check purchasedAt dates
# 3. "User" table - verify user roles
```

Or use SQL:

```sql
-- All reviews with buyer info
SELECT
  r.id,
  r.rating,
  r.comment,
  r.created_at,
  u.email as buyer_email,
  a.title as agent_title,
  r.verified_purchase
FROM reviews r
JOIN users u ON r.buyer_id = u.id
JOIN agents a ON r.agent_id = a.id
ORDER BY r.created_at DESC;

-- Reviews per agent
SELECT
  a.title,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.rating)::numeric, 1) as avg_rating
FROM agents a
LEFT JOIN reviews r ON a.id = r.agent_id
GROUP BY a.id, a.title
ORDER BY review_count DESC;
```

---

## Production Testing

After deploying to Netlify:

1. **Test all scenarios above on production URL**
2. **Check that database connection works**
3. **Verify API endpoints respond correctly**:
   ```bash
   curl 'https://hireyourai.netlify.app/api/reviews?agentId=AGENT_ID'
   ```
4. **Test with real Supabase auth** (not test accounts)

---

## Need Help?

If tests fail:
1. Check server logs: Look for console.log output
2. Check browser console: Look for client-side errors
3. Verify database schema: `npx prisma db pull`
4. Check API responses: Use browser DevTools Network tab

---

**Happy Testing! 🧪**
