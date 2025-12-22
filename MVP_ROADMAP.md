# MVP Roadmap - Ship This Now

## Core Philosophy
**Focus**: Ship the 6 MUST-HAVE features. Everything else waits until PMF.

---

## MUST HAVE - Implementation Priority

### 1. Landing + Categories + Agent Page ⭐ CRITICAL PATH
**Goal**: Buyers can browse and discover agents

#### Components Needed:
```
✅ Landing Page (/)
  - Hero section with value prop
  - Featured categories grid
  - CTA to browse agents

✅ Categories Page (/agents)
  - Category filter sidebar
  - Agent cards grid
  - Search bar
  - Simple pagination

✅ Agent Detail Page (/agents/[slug])
  - Hero with title, price, demo video
  - Workflow overview (visible to all)
  - Use case description
  - Seller info (name, avatar)
  - "Setup Guide" section with 🔒 LOCKED overlay
  - Purchase CTA button
  - NO reviews/ratings yet (Nice to Have)
```

#### Pages to Build:
- `src/app/page.tsx` - Landing
- `src/app/agents/page.tsx` - Browse/Categories
- `src/app/agents/[slug]/page.tsx` - Agent detail
- `src/app/agents/category/[slug]/page.tsx` - Category filter view

#### API Routes:
- `GET /api/agents` - List agents (with filters)
- `GET /api/agents/[id]` - Single agent
- `GET /api/categories` - List categories

---

### 2. Locked Setup Content Post-Purchase ⭐ CRITICAL PATH
**Goal**: Content unlock on successful payment

#### Implementation:
```typescript
// Agent Detail Page Logic
const hasPurchased = await checkUserPurchase(agentId, userId)

if (hasPurchased) {
  // Show full setup guide
  <SetupGuideDisplay content={agent.setupGuide} />
} else {
  // Show locked state
  <LockedContent>
    <LockIcon />
    <p>Purchase this agent to unlock the complete setup guide</p>
  </LockedContent>
}
```

#### Edge Case Handling:
1. Payment succeeds but unlock fails → Retry webhook + manual admin override button
2. Multiple purchases of same agent → Check for existing purchase first
3. Agent deleted after purchase → Content remains accessible to buyers

#### Components:
- `SetupGuideDisplay.tsx` - Markdown renderer with copy buttons
- `LockedContentOverlay.tsx` - Visual lock state
- `UnlockButton.tsx` - Trigger for purchase flow

---

### 3. Checkout + Support Add-on ⭐ CRITICAL PATH
**Goal**: Simple, fast checkout with optional support

#### Checkout Flow:
```
Agent Page → Click "Purchase" → Checkout Modal/Page
→ Show: Agent title, base price, support add-on toggle
→ Stripe Checkout Session
→ Success → Redirect to agent page (now unlocked)
```

#### Must Include:
- Support add-on as checkbox with price
- Total calculation
- Stripe embedded checkout (NOT custom form for MVP)
- Success page with "View Setup Guide" CTA

#### Stripe Integration:
```typescript
// Create checkout session with line items
const session = await stripe.checkout.sessions.create({
  line_items: [
    { price: agentPriceId, quantity: 1 },
    ...(supportAddon ? [{ price: supportPriceId, quantity: 1 }] : []),
  ],
  mode: 'payment',
  success_url: `${baseUrl}/agents/${slug}?purchased=true`,
  cancel_url: `${baseUrl}/agents/${slug}`,
  metadata: {
    agentId,
    buyerId,
    supportAddon: supportAddon.toString(),
  },
})
```

#### Pages:
- `src/app/checkout/[agentId]/page.tsx`
- `src/app/checkout/success/page.tsx`

#### API Routes:
- `POST /api/stripe/checkout` - Create session
- `POST /api/stripe/webhook` - Handle payment confirmation

---

### 4. Seller Submission + Admin Approval ⭐ CRITICAL PATH
**Goal**: Quality-controlled agent submissions

#### Seller Submission Form:
```
Required Fields (ALL mandatory):
✅ Title (clear, specific)
✅ Category
✅ Short description (1-2 sentences, for cards)
✅ Workflow overview (public, sell the value)
✅ Use case (who is this for? what problem solved?)
✅ Demo video URL (YouTube/Loom - REQUIRED)
✅ Thumbnail image
✅ Base price
✅ Support add-on price
✅ Setup guide (Markdown, step-by-step)

Validation Rules:
- Demo video must be valid URL
- Setup guide minimum 200 words
- Workflow overview minimum 100 words
- Price between $19-$999
```

#### Submission Checklist (Shown to Seller):
```markdown
Before you submit, ensure:
☐ Demo video shows the agent in action (not just slides)
☐ Setup guide has clear step-by-step instructions
☐ Workflow overview explains the value, not just features
☐ Use case is specific (e.g., "for SaaS founders" not "for everyone")
☐ Pricing reflects actual value delivered
```

#### Admin Review Interface:
```
Admin sees:
- Agent preview (exactly as buyers will see it)
- Demo video embedded
- Full setup guide visible
- Approve button (green)
- Reject button (red) → Opens modal for rejection reason

On Approve:
  - Status → APPROVED
  - Agent goes live immediately
  - Email sent to seller

On Reject:
  - Status → REJECTED
  - Rejection reason stored
  - Email sent to seller with feedback
  - Seller can edit and resubmit
```

#### Pages:
- `src/app/seller/agents/new/page.tsx` - Submission form
- `src/app/seller/agents/[id]/edit/page.tsx` - Edit form
- `src/app/admin/agents/page.tsx` - Review queue
- `src/app/admin/agents/[id]/page.tsx` - Review detail

#### API Routes:
- `POST /api/agents` - Create submission
- `PATCH /api/agents/[id]` - Update submission
- `POST /api/admin/agents/[id]/approve` - Approve agent
- `POST /api/admin/agents/[id]/reject` - Reject with reason

---

### 5. Public Seller Portfolio Page ⭐ CRITICAL PATH
**Goal**: Sellers get shareable portfolio URL

#### Features:
```
URL: /seller/[slug]
Example: /seller/john-ai-engineer

Shows:
- Seller name + avatar
- Bio (short)
- Social links (Twitter, GitHub, LinkedIn)
- Grid of approved agents
- "Contact for custom work" (if enabled)

NO complex analytics visible here
NO messaging (Out of Scope)
```

#### Implementation:
- Auto-generate slug from seller name on signup
- Ensure slug is unique
- Allow slug editing (one-time or with cooldown)
- Add og:image for social sharing

#### Pages:
- `src/app/seller/[slug]/page.tsx` - Public portfolio

#### API Routes:
- `GET /api/sellers/[slug]` - Get seller profile + agents

---

### 6. Admin Approve/Reject Flow ⭐ CRITICAL PATH
**Goal**: Quality control before agents go live

#### Admin Dashboard:
```
/admin
- Pending agents count (big number)
- Recent submissions list
- Quick approve/reject actions

/admin/agents
- Queue view (status filter: pending, approved, rejected)
- Sortable by submission date
- Click to review

/admin/agents/[id]
- Full preview
- Approve/Reject buttons
- View seller profile
- See submission history
```

#### Rejection Flow:
```
Click "Reject" → Modal opens

Rejection Reason (required):
☐ Demo video missing or low quality
☐ Setup guide incomplete
☐ Workflow not clearly explained
☐ Use case too vague
☐ Pricing unrealistic
☐ Other: [text field]

Submit → Email sent to seller with specific feedback
```

#### Email Templates:
```
Subject: Your agent "[Title]" has been approved! 🎉

Your agent is now live on the marketplace.
View it here: [link]
Share your portfolio: [portfolio link]

---

Subject: Your agent "[Title]" needs revisions

Your submission was reviewed but needs some updates:

Reason: [rejection reason]

What to do next:
1. Go to your dashboard
2. Edit the agent
3. Resubmit for review

We're here to help you succeed!
```

#### Pages:
- `src/app/admin/page.tsx` - Dashboard
- `src/app/admin/agents/page.tsx` - Queue
- `src/app/admin/agents/[id]/page.tsx` - Review detail

---

## Implementation Order (Week-by-Week)

### Week 1-2: Browse & Discovery
- [ ] Landing page with hero + categories
- [ ] Category pages
- [ ] Agent detail page (with locked content)
- [ ] Basic layout (header, footer)
- [ ] API routes for agents and categories

### Week 3: Checkout Flow
- [ ] Stripe integration
- [ ] Checkout page
- [ ] Success page
- [ ] Webhook handler
- [ ] Content unlock logic
- [ ] Edge case handling

### Week 4: Seller Submission
- [ ] Seller onboarding (create profile)
- [ ] Agent submission form with validation
- [ ] Submission checklist UI
- [ ] Draft saving
- [ ] Image/video upload

### Week 5: Admin Panel
- [ ] Admin dashboard
- [ ] Review queue
- [ ] Approve/reject flow
- [ ] Email notifications
- [ ] Admin logs

### Week 6: Seller Portfolio
- [ ] Public portfolio page
- [ ] Slug generation/editing
- [ ] Social sharing meta tags
- [ ] Seller settings page

### Week 7: Polish & Testing
- [ ] Error handling
- [ ] Loading states
- [ ] Mobile responsive
- [ ] Cross-browser testing
- [ ] Security audit

### Week 8: Launch Prep
- [ ] Production deployment
- [ ] Monitor logs
- [ ] Create first 5-10 agents manually
- [ ] Onboard 2-3 beta sellers
- [ ] Launch 🚀

---

## Nice to Have (POST-MVP)

Only build these AFTER the 6 MUST-HAVEs are live and working:

1. **Seller Analytics**
   - Views, conversion rate, revenue
   - Time-series charts
   - Downloadable reports

2. **Featured Agents**
   - Admin can feature agents
   - Show on homepage
   - Featured badge

3. **Advanced Support**
   - Support ticket system
   - Status tracking
   - Internal notes

4. **SEO Automation**
   - Auto-generate meta descriptions
   - Sitemap
   - Structured data

5. **Refund Tooling**
   - Admin refund button
   - Partial refunds
   - Refund reason tracking

6. **Versioning**
   - Agent version history
   - Update notifications
   - Changelog

---

## Out of Scope (Until PMF)

DO NOT BUILD until you have product-market fit:

1. ❌ Messaging between buyer and seller
2. ❌ Subscription-based agents
3. ❌ Agent updates/versioning (beyond Nice to Have)
4. ❌ White-label solutions
5. ❌ Community features (forums, comments)
6. ❌ Affiliate program
7. ❌ API access
8. ❌ Mobile apps
9. ❌ Multi-language support
10. ❌ Advanced search (basic is fine)

---

## Risk Mitigation (Product, Not Tech)

### Risk 1: Low-Quality Workflows
**Mitigation:**
- ✅ Strict submission checklist (non-negotiable)
- ✅ Admin can reject with detailed feedback
- ✅ Demo video is REQUIRED (not optional)
- ✅ Setup guide minimum word count
- ✅ Example submissions shown to sellers

**Metrics to Track:**
- Rejection rate by reason
- Time to approval
- Buyer complaints about quality

---

### Risk 2: Buyers Not Understanding Setup
**Mitigation:**
- ✅ Support add-on positioned as safety net
- ✅ Setup guides must be step-by-step (format enforced)
- ✅ Code blocks with copy buttons
- ✅ Screenshots encouraged in setup guide
- ✅ "Difficulty level" badge (Easy/Medium/Advanced)

**Metrics to Track:**
- Support add-on attach rate
- Support request volume
- Refund requests due to complexity

**Future Enhancement (Post-MVP):**
- Video setup guides (supplementary to written)
- Interactive setup wizard

---

### Risk 3: Sellers Overestimating Agent Value
**Mitigation:**
- ✅ Show pricing examples during submission
- ✅ Pricing guidance: "$29-49 for simple workflows, $99-199 for complex"
- ✅ Admin can flag "overpriced" in rejection
- ✅ No pricing is too low (market will decide)

**Pricing Psychology:**
```
Guide sellers to think:
- How much time does this save?
- What would a freelancer charge for this?
- How much value does it create?

Example:
"If this agent saves 5 hours/week and your buyer's time is worth $50/hr,
that's $250/week in value. Pricing at $99 is reasonable."
```

**Metrics to Track:**
- Conversion rate by price tier
- Views-to-purchase ratio
- Buyer feedback on value

---

### Risk 4: "This Feels Like a Doc Marketplace"
**Mitigation:**
- ✅ Demo video REQUIRED (must show agent in action)
- ✅ Call them "AI Agent Workflows" not "documents"
- ✅ Workflow overview must explain the agent's behavior
- ✅ Use tangible language: "automate", "agent", "workflow"
- ✅ Visual design emphasizes "product" not "docs"

**Copy Guidelines:**
```
❌ Avoid:
- "Download the guide"
- "Read the documentation"
- "Instructions included"

✅ Use instead:
- "Get the agent workflow"
- "Unlock the setup"
- "Deploy your agent"
- "Activate this automation"
```

**Visual Guidelines:**
- Agent cards look like products (not files)
- Demo videos prominently featured
- Setup guide UI feels like an app (not a PDF)
- Use agent icons/illustrations

**Metrics to Track:**
- Video play rate on agent pages
- Time spent on setup guide pages
- Repeat purchase rate (validation of quality)

---

## Success Metrics (MVP)

Track these to know if MVP is working:

### Primary Metrics:
1. **Agent Purchases** (goal: 10 in first month)
2. **Seller Signups** (goal: 5 sellers onboarded)
3. **Agent Submissions** (goal: 15 submitted, 10 approved)
4. **Support Add-on Attach Rate** (target: 20-30%)

### Secondary Metrics:
5. **Time to Agent Approval** (target: < 48 hours)
6. **Rejection Rate** (expect: 30-40% in early days)
7. **Setup Guide Completion Rate** (proxy: time on page)
8. **Repeat Purchases** (same buyer, different agent)

### Warning Signs:
- 🚨 High refund rate (>10%)
- 🚨 Low conversion on agent pages (<1%)
- 🚨 Sellers not resubmitting after rejection
- 🚨 Support requests overwhelming capacity

---

## Technical Decisions for Speed

### Use Stripe Checkout (not custom forms)
- ✅ Faster to implement
- ✅ PCI compliance handled
- ✅ Mobile-optimized
- ✅ Multiple payment methods

### Use Markdown for Setup Guides (not WYSIWYG)
- ✅ Easier to store
- ✅ Faster rendering
- ✅ Code blocks built-in
- ✅ Sellers likely already know Markdown

### Use Next.js Server Actions (not separate API)
- ✅ Less boilerplate
- ✅ Type-safe
- ✅ Faster development

### Use Embedded Videos (YouTube/Loom) (not uploads)
- ✅ No storage costs
- ✅ No video processing
- ✅ Better player UX
- ✅ Faster MVP

---

## Launch Checklist

Before going live:

### Product Ready:
- [ ] All 6 MUST-HAVEs functional
- [ ] At least 5 agents live on marketplace
- [ ] Admin can approve/reject smoothly
- [ ] Payments work end-to-end
- [ ] Content unlocks reliably

### Polish:
- [ ] Mobile responsive
- [ ] Loading states on all actions
- [ ] Error messages user-friendly
- [ ] Email notifications working

### Legal/Business:
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Refund policy clear
- [ ] Stripe account verified

### Monitoring:
- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel/Plausible)
- [ ] Uptime monitoring
- [ ] Stripe webhook logs

### Marketing:
- [ ] Landing page copy finalized
- [ ] Social media accounts
- [ ] Launch announcement draft
- [ ] 2-3 beta testers lined up

---

## Post-Launch: First 30 Days

### Week 1-2: Watch & Fix
- Monitor error logs daily
- Fix critical bugs immediately
- Talk to first 5 buyers (qualitative feedback)
- Adjust copy based on confusion points

### Week 3-4: Optimize
- A/B test landing page headline
- Improve agent detail page conversion
- Add missing error handling
- Polish rough edges

### Month 2+: Decide on Nice-to-Haves
Based on data:
- Do buyers need seller analytics? (check requests)
- Are featured agents necessary? (check discovery issues)
- Is support workflow breaking? (check ticket volume)

**Only then** build Nice-to-Haves.

---

## Key Principle: Ruthless Prioritization

When in doubt, ask:
1. **Does this help buyers find and purchase agents?** ✅ Build it
2. **Does this help sellers submit quality agents?** ✅ Build it
3. **Does this help admin maintain quality?** ✅ Build it
4. **Is this a "nice to have" feature?** ❌ Defer it
5. **Is this a "wouldn't it be cool if"?** ❌ Cut it

---

**Ship fast. Learn fast. Iterate based on real usage.**

---

**Document Version**: 1.0
**Last Updated**: 2025-12-19
**Status**: MVP Roadmap
