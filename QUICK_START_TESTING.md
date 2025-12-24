# Quick Start: Testing Reviews in 5 Minutes

## 🚀 Fastest Way to Test Reviews

Follow these steps to test the complete review flow:

---

## Step 1: Start Dev Server (30 seconds)

```bash
npm run dev
```

Wait for: `✓ Ready in XXXXms`

---

## Step 2: Make a Purchase Eligible (30 seconds)

```bash
npx tsx scripts/make-purchase-eligible.ts
```

This will output:
```
✅ Purchase date updated to 15 days ago!

TESTING INSTRUCTIONS
============================================================
1. Log in as: zuvystudent01@gmail.com
2. Navigate to: http://localhost:3000/agents/sample-ai-agent
3. Scroll to the Reviews section
4. You should now see the review form!
```

**Copy the email and agent URL from the output.**

---

## Step 3: Log In (1 minute)

1. Go to http://localhost:3000/login
2. Email: `zuvystudent01@gmail.com` (from script output)
3. Password: `/nS5iW3kixgUUX/O4JKykQ==Aa1!` (temp password from migration)

---

## Step 4: Test Review Form (2 minutes)

1. **Navigate to the agent page** (URL from script output)
2. **Scroll down** to the "Reviews" section
3. **You should see:** "Leave a Review" form with stars

### Submit Your First Review:

1. **Click on 5 stars** (watch them turn yellow)
2. **Type a comment:**
   ```
   This agent saved us 10+ hours per week on lead generation.
   ROI was positive in the first month. Highly recommend!
   ```
3. **Click "Submit Review"**

### What Should Happen:

- ✅ Button changes to "Submitting..."
- ✅ Form disappears
- ✅ Green banner appears: "Review Submitted"
- ✅ Your review appears in the list below
- ✅ Shows "Verified Buyer" badge
- ✅ Average rating shows 5.0 ⭐

---

## Step 5: Test Duplicate Prevention (30 seconds)

1. **Refresh the page**
2. **Scroll to Reviews section**
3. **You should see:** Green banner "You have already reviewed this version"
4. **Form is gone** - cannot submit another review

---

## Step 6: Check Seller Dashboard (1 minute)

1. **Log out**
2. **Log in as a seller:**
   - Email: `schauhan@rainesdev.ai`
   - Password: `/nS5iW3kixgUUX/O4JKykQ==Aa1!`
3. **Go to:** http://localhost:3000/dashboard
4. **Scroll to bottom:** "Reviews" section

### You Should See:

- Overall stats card with average rating
- Your agents listed with review counts
- Click to expand and see the review you just submitted

---

## Done! ✨

You've now tested:
- ✅ Review eligibility (14-day period)
- ✅ Review form submission
- ✅ Duplicate prevention
- ✅ Review display on agent page
- ✅ Seller dashboard reviews

---

## What's Next?

### Test Other Scenarios:

**1. Non-Buyer Viewing Reviews:**
- Log out
- Visit any agent page
- Reviews are visible, but no form

**2. Too Soon State:**
- Create a NEW purchase (as buyer)
- Visit that agent's page
- Should see: "Reviews unlock in 14 days"

**3. No Purchase State:**
- Log in as buyer
- Visit agent you haven't purchased
- Should see: "Purchase required" banner

---

## Troubleshooting

### "Script says no purchases found"

**Solution:** Create a test purchase first:
1. Log in as buyer
2. Go to any agent page
3. Click "Purchase Agent"
4. Use test mode payment
5. Run the script again

### "Can't log in with temp password"

**Solution:** Reset password via Supabase:
1. Go to Mumbai Supabase dashboard
2. Authentication → Users
3. Find the user
4. Click "Send Password Recovery"

### "Review form not showing"

**Debug:**
```bash
# Check eligibility
curl 'http://localhost:3000/api/reviews/eligibility?userId=USER_ID&agentId=AGENT_ID'
```

Should return:
```json
{
  "eligible": true,
  "message": "You can now leave a review"
}
```

---

## Full Testing Guide

For comprehensive testing of all scenarios, see:
- **[TESTING_REVIEWS.md](TESTING_REVIEWS.md)** - Complete test scenarios
- **[REVIEWS_IMPLEMENTATION.md](REVIEWS_IMPLEMENTATION.md)** - Technical documentation

---

**Ready to test? Start with Step 1! 🚀**
