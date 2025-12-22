# Stakeholder Testing Guide - Neura AI Agent Marketplace

**Platform**: Neura - AI Agent Marketplace powered by RainesDev
**Version**: 1.0
**Environment**: Production (Netlify/Vercel)

This guide helps stakeholders test and evaluate the Neura platform systematically.

---

## Quick Access

**Live Platform**: `https://your-deployed-site.netlify.app` (or Vercel URL)
**GitHub Repository**: https://github.com/SakshamChauhan23/rainesdev
**Test Accounts**: See Section 1 below

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [User Journey Testing](#2-user-journey-testing)
3. [Feature Checklist](#3-feature-checklist)
4. [Visual Design Review](#4-visual-design-review)
5. [Mobile Testing](#5-mobile-testing)
6. [Performance Check](#6-performance-check)
7. [Known Issues](#7-known-issues)
8. [Feedback Template](#8-feedback-template)

---

## 1. Getting Started

### Test Accounts

You'll need three types of accounts to test all features:

| Role | Email | Purpose |
|------|-------|---------|
| **Buyer** | Create your own | Test purchasing agents |
| **Seller** | Create your own | Test submitting agents |
| **Admin** | Will be provided | Test approval workflow |

**How to Create Test Accounts**:
1. Visit the platform URL
2. Click "Get Started" or "Sign Up"
3. Use a real email (you'll receive verification)
4. Complete signup process

---

## 2. User Journey Testing

### Journey 1: New Buyer (First-time User)

**Objective**: Experience the platform as someone looking to buy an AI agent

1. **Homepage Experience** (5 mins)
   - [ ] Visit homepage
   - [ ] Read "Why This Marketplace Exists" section
   - [ ] Scroll through all sections
   - [ ] Click "Browse AI Agents" button
   - ✅ **Expected**: Smooth navigation, clear value proposition

2. **Browse Agents** (5 mins)
   - [ ] View all agents on `/agents` page
   - [ ] Notice agent count per category (e.g., "5 agents")
   - [ ] Click different categories to filter
   - [ ] Use search bar to find specific agents
   - [ ] Click on an agent card to view details
   - ✅ **Expected**: Agent counts match reality, smooth filtering

3. **View Agent Details** (5 mins)
   - [ ] Read agent description
   - [ ] Watch demo video (if available)
   - [ ] Check pricing
   - [ ] View seller information
   - [ ] Notice "Unlock Setup Guide" button
   - ✅ **Expected**: All information displays correctly

4. **Sign Up** (3 mins)
   - [ ] Click "Get Started" or "Sign Up"
   - [ ] Enter email and password
   - [ ] Verify email (check inbox)
   - [ ] Complete registration
   - ✅ **Expected**: Email received, signup successful

5. **Purchase Agent** (5 mins)
   - [ ] Log in to your buyer account
   - [ ] Find an agent to purchase
   - [ ] Click "Unlock Setup Guide"
   - [ ] Complete Stripe checkout (use test card: `4242 4242 4242 4242`)
   - [ ] Verify purchase confirmation
   - ✅ **Expected**: Payment processed, setup guide unlocked

6. **Access Purchased Content** (3 mins)
   - [ ] Go to "Your Purchases" or "Library"
   - [ ] See purchased agent
   - [ ] View unlocked setup guide
   - [ ] Download resources (if available)
   - ✅ **Expected**: Full access to purchased content

---

### Journey 2: Seller (Agent Creator)

**Objective**: Test the seller experience

1. **Sign Up as Seller** (3 mins)
   - [ ] Create new account
   - [ ] Select "Seller" role during signup
   - ✅ **Expected**: Seller account created

2. **Submit New Agent** (10 mins)
   - [ ] Go to "Submit Agent" page
   - [ ] Fill out agent information:
     - Title: "Test AI Assistant"
     - Category: Any
     - Short description
     - Full description
     - Price: $49
     - Upload thumbnail image
     - Add demo video URL (YouTube/Vimeo)
     - Setup guide content
   - [ ] Submit form
   - ✅ **Expected**: Agent submitted for review

3. **View Dashboard** (3 mins)
   - [ ] Go to "Seller Dashboard"
   - [ ] See submitted agent with "Pending" status
   - [ ] Check agent analytics (views, purchases)
   - ✅ **Expected**: Dashboard displays correctly

4. **Edit Agent** (5 mins)
   - [ ] Click "Edit" on your agent
   - [ ] Update description
   - [ ] Save changes
   - ✅ **Expected**: Changes saved, pending re-approval

---

### Journey 3: Admin (Platform Manager)

**Objective**: Test approval and moderation workflow

1. **Access Admin Panel** (2 mins)
   - [ ] Log in with admin account
   - [ ] Go to `/admin` or "Admin Dashboard"
   - ✅ **Expected**: Access granted (non-admins blocked)

2. **Review Queue** (5 mins)
   - [ ] View pending agents in review queue
   - [ ] Click on agent to review details
   - [ ] Check all submitted information
   - ✅ **Expected**: All submitted agents visible

3. **Approve/Reject Agents** (3 mins)
   - [ ] Approve a well-formed agent
   - [ ] Reject a test agent with reason
   - [ ] Verify status updates
   - ✅ **Expected**: Status changes reflected immediately

4. **Admin Logs** (2 mins)
   - [ ] View admin activity logs
   - [ ] See history of approvals/rejections
   - ✅ **Expected**: Complete audit trail

---

## 3. Feature Checklist

### Core Features

- [ ] **User Authentication**
  - Sign up with email/password
  - Email verification
  - Login/logout
  - Password reset (if implemented)
  - Role-based access (Buyer, Seller, Admin)

- [ ] **Agent Marketplace**
  - Browse all agents
  - Filter by category (6 categories)
  - Search functionality
  - Dynamic agent counts per category
  - Agent detail pages
  - Pagination (if > 12 agents)

- [ ] **Agent Details**
  - Title and description
  - Pricing display
  - Seller information
  - Category badge
  - Demo video player
  - View count
  - Purchase count

- [ ] **Purchase Flow**
  - Stripe checkout integration
  - Test card: 4242 4242 4242 4242
  - Purchase confirmation
  - Setup guide unlocked after purchase
  - Email confirmation (if configured)

- [ ] **Seller Features**
  - Submit new agent form
  - Edit existing agents
  - Dashboard with analytics
  - View submission status
  - Request updates to live agents

- [ ] **Admin Features**
  - Admin dashboard access
  - Review queue
  - Approve/reject agents
  - Admin activity logs
  - Seller management

### Design & UX

- [ ] **Green Theme** (#8DEC42)
  - Primary color is bright green
  - Hover states use darker green (#7ACC3B)
  - Consistent throughout site

- [ ] **Typography**
  - Headlines use font-light (300 weight)
  - Body text uses font-normal (400 weight)
  - No font-bold anywhere

- [ ] **Animations**
  - Smooth transitions on hover
  - Fade-in animations on homepage
  - Card lift effects on hover
  - Button scale on hover
  - Horizontal scrolling in "How It Works"

- [ ] **Responsive Design**
  - Works on desktop (1920px, 1440px, 1024px)
  - Works on tablet (768px)
  - Works on mobile (375px, 414px)
  - Header collapses to mobile menu
  - All content readable on small screens

---

## 4. Visual Design Review

### Homepage Sections (in order)

1. **Hero Section**
   - [ ] Dark grey background (#404145)
   - [ ] Green accent headline ("in minutes")
   - [ ] Green CTA button
   - [ ] Workflow visualization on right (desktop only)
   - [ ] Trust icons (Gmail, Shopify, Webflow, CRMs)

2. **Why This Marketplace Exists**
   - [ ] Problem/solution layout
   - [ ] 2-column grid on desktop
   - [ ] Alert circles for problems
   - [ ] Check circles for solutions

3. **How This Helps Businesses**
   - [ ] 4 value propositions
   - [ ] Left-border list design (not cards!)
   - [ ] Icons scale on hover
   - [ ] Border turns green on hover

4. **Popular Services** (Category Grid)
   - [ ] 6 categories listed
   - [ ] Dynamic agent counts (e.g., "3 agents")
   - [ ] Horizontal list design (not cards!)
   - [ ] Icons and borders respond to hover

5. **How It Works** (Horizontal Scroll)
   - [ ] Auto-scrolling feature list
   - [ ] No visible scrollbar
   - [ ] Smooth, continuous animation

6. **Who This Platform Is For** (Personas)
   - [ ] 3 persona cards
   - [ ] Business Teams, Indie Developers, Agencies
   - [ ] Call-to-action buttons

7. **What Makes This Different**
   - [ ] 6 differentiators
   - [ ] Simple 2-column grid
   - [ ] Green checkmarks

8. **Built by RainesDev**
   - [ ] Dark background (#404145)
   - [ ] Hyperlinks to www.rainesdev.ai
   - [ ] Orange/green accent on links

9. **Marketplace Principles**
   - [ ] 3 principles with numbered badges
   - [ ] Green gradient on icons
   - [ ] Dark badge backgrounds

### Color Verification

- [ ] Primary green: #8DEC42 (bright, vibrant)
- [ ] Hover green: #7ACC3B (slightly darker)
- [ ] Dark grey: #404145 (hero, RainesDev section)
- [ ] Black: Used for headings
- [ ] Grey: Used for body text (not too many shades)
- [ ] White backgrounds (no off-white)

---

## 5. Mobile Testing

Test on actual devices or use browser DevTools:

### Devices to Test

1. **iPhone (375px width)**
   - [ ] Safari browser
   - [ ] Chrome browser

2. **iPad (768px width)**
   - [ ] Safari browser
   - [ ] Landscape and portrait

3. **Android Phone (360-414px width)**
   - [ ] Chrome browser

### Mobile-Specific Checks

- [ ] Header hamburger menu works
- [ ] All homepage sections stack vertically
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable (not too small)
- [ ] Forms are usable
- [ ] No horizontal scrolling (except "How It Works")
- [ ] Images scale appropriately

---

## 6. Performance Check

### Page Load Speed

- [ ] Homepage loads in < 3 seconds
- [ ] Agents page loads in < 3 seconds
- [ ] Agent detail page loads in < 2 seconds
- [ ] No significant lag when navigating

### Browser Console

- [ ] Open browser DevTools (F12)
- [ ] Check Console tab for errors
- [ ] ✅ Expected: No red errors (warnings ok)

### Database Connection

- [ ] Agent counts load dynamically (not hardcoded)
- [ ] Changes in database reflect on site after refresh
- [ ] No "Error fetching" messages

---

## 7. Known Issues

### Current Limitations

1. **Stripe Test Mode**
   - Only test cards work (4242...)
   - No real money transactions in test mode

2. **Email Delivery**
   - May go to spam folder
   - Check spam if verification email doesn't arrive

3. **Image Upload**
   - Image uploads may require specific formats
   - Max file size limits apply

### Intentional Design Choices

1. **No migrations folder**
   - Using Prisma `db push` instead of migrations
   - This is intentional and works fine

2. **Agent counts load on client**
   - May show "0 agents" briefly while loading
   - This is expected behavior

---

## 8. Feedback Template

Please provide feedback using this structure:

### General Impression

- **Overall experience** (1-10): ___
- **Visual design** (1-10): ___
- **Ease of use** (1-10): ___

### What Works Well

1. _______________________________________
2. _______________________________________
3. _______________________________________

### Issues Found

| Page/Feature | Issue Description | Severity (Low/Medium/High) |
|--------------|-------------------|----------------------------|
| Example: Homepage | Green color too bright | Low |
| | | |
| | | |

### Suggestions

1. _______________________________________
2. _______________________________________
3. _______________________________________

### Questions

1. _______________________________________
2. _______________________________________

---

## Testing Completion

Once you've completed testing:

- [ ] All user journeys tested
- [ ] Feature checklist completed
- [ ] Mobile testing done
- [ ] Feedback template filled out
- [ ] Screenshots taken (if issues found)

**Send feedback to**: [Your email or feedback form]

---

## Quick Test Script (15 Minutes)

If time is limited, follow this quick test:

1. **Visit homepage** → Scroll through all sections (3 min)
2. **Sign up** → Create buyer account (2 min)
3. **Browse agents** → Click category, view agent (3 min)
4. **Purchase agent** → Use test card 4242... (4 min)
5. **Check library** → Verify unlocked content (2 min)
6. **Mobile check** → Open on phone (1 min)

---

## Support

- **Technical Issues**: Check [DEPLOYMENT.md](DEPLOYMENT.md)
- **GitHub**: https://github.com/SakshamChauhan23/rainesdev
- **Questions**: Contact the development team

---

**Happy Testing!** 🚀

Your feedback will help make Neura the best AI agent marketplace.
