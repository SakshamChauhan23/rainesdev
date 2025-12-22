# MVP Implementation Checklist

Use this checklist to track implementation progress. Check off items as you complete them.

---

## Week 1-2: Browse & Discovery

### Landing Page
- [ ] Hero section with headline and CTA
- [ ] Featured categories grid (6 categories)
- [ ] "How it works" section (3 steps)
- [ ] Social proof placeholder (testimonials later)
- [ ] Footer with links
- [ ] Responsive mobile layout

**Files:**
- `src/app/page.tsx`
- `src/components/landing/hero.tsx`
- `src/components/landing/category-grid.tsx`
- `src/components/landing/how-it-works.tsx`

---

### Layout Components
- [ ] Header with logo and navigation
- [ ] User menu (Login/Register or Profile dropdown)
- [ ] Footer component
- [ ] Container wrapper
- [ ] Mobile hamburger menu

**Files:**
- `src/components/layout/header.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/container.tsx`

---

### Categories Page
- [ ] Category filter sidebar (checkbox list)
- [ ] Agent cards grid (responsive)
- [ ] Search bar with debounced input
- [ ] Pagination component
- [ ] Empty state when no results
- [ ] Loading skeleton states

**Files:**
- `src/app/agents/page.tsx`
- `src/components/agent/agent-card.tsx`
- `src/components/agent/agent-grid.tsx`
- `src/components/shared/search-bar.tsx`
- `src/components/shared/pagination.tsx`

---

### Agent Detail Page
- [ ] Agent hero with title, price, category
- [ ] Seller info section (name, avatar, link to portfolio)
- [ ] Demo video player (YouTube/Loom embed)
- [ ] Workflow overview section (public content)
- [ ] Use case section
- [ ] Locked setup guide section (shows lock icon + CTA)
- [ ] Purchase button (prominent)
- [ ] Unlocked setup guide (if purchased)
- [ ] Breadcrumb navigation

**Files:**
- `src/app/agents/[slug]/page.tsx`
- `src/components/agent/agent-detail-hero.tsx`
- `src/components/agent/setup-guide-display.tsx`
- `src/components/agent/locked-content-overlay.tsx`
- `src/components/shared/video-player.tsx`

---

### API Routes - Agents
- [ ] GET `/api/agents` - List agents with filters
  - Query params: category, search, page, limit
  - Return: paginated agent list
- [ ] GET `/api/agents/[id]` - Single agent by ID/slug
  - Check if user has purchased
  - Return locked/unlocked content accordingly
- [ ] GET `/api/categories` - List all categories
  - Return: all active categories

**Files:**
- `src/app/api/agents/route.ts`
- `src/app/api/agents/[id]/route.ts`
- `src/app/api/categories/route.ts`

---

## Week 3: Checkout Flow

### Stripe Setup
- [ ] Create Stripe account
- [ ] Install Stripe SDK
- [ ] Set up Stripe API keys in `.env`
- [ ] Create webhook endpoint URL
- [ ] Configure webhook in Stripe dashboard

**Files:**
- `src/lib/stripe.ts` - Stripe client initialization

---

### Checkout Page
- [ ] Agent summary card (title, thumbnail, base price)
- [ ] Support add-on toggle with price
- [ ] Total price calculation (reactive)
- [ ] Terms acceptance checkbox
- [ ] "Proceed to Payment" button
- [ ] Stripe Checkout Session creation
- [ ] Redirect to Stripe hosted checkout
- [ ] Cancel flow (return to agent page)

**Files:**
- `src/app/checkout/[agentId]/page.tsx`
- `src/components/purchase/checkout-form.tsx`
- `src/components/purchase/support-addon-toggle.tsx`
- `src/components/purchase/price-breakdown.tsx`

---

### Success Page
- [ ] Purchase confirmation message
- [ ] Order summary (agent name, amount paid)
- [ ] "View Setup Guide" CTA button
- [ ] Link to dashboard/library
- [ ] Email confirmation sent notice

**Files:**
- `src/app/checkout/success/page.tsx`
- `src/components/purchase/purchase-confirmation.tsx`

---

### Webhook Handler
- [ ] Verify Stripe signature
- [ ] Handle `checkout.session.completed` event
- [ ] Create Purchase record in database
- [ ] Create SupportRequest if add-on purchased
- [ ] Update agent purchase count
- [ ] Send confirmation email to buyer
- [ ] Handle webhook retry logic
- [ ] Log all webhook events

**Files:**
- `src/app/api/stripe/webhook/route.ts`

---

### Content Unlock Logic
- [ ] Check purchase status on agent page load
- [ ] Unlock setup guide if purchased
- [ ] Handle unlock failure (retry button)
- [ ] Admin manual unlock endpoint
- [ ] Track unlock timestamp

**Files:**
- `src/lib/purchase-checks.ts`
- `src/app/api/purchases/unlock/route.ts`

---

### Email Service
- [ ] Set up Resend/SendGrid account
- [ ] Create email templates
  - Purchase confirmation
  - Agent approval notification
  - Agent rejection notification
- [ ] Send email utility function
- [ ] Test email delivery

**Files:**
- `src/lib/email.ts`
- `src/lib/email-templates.tsx`

---

## Week 4: Seller Submission

### Seller Onboarding
- [ ] Seller registration flow (role selection)
- [ ] Create seller profile form
  - Bio (textarea)
  - Social links (Twitter, GitHub, LinkedIn)
  - Portfolio slug (auto-generated, editable)
- [ ] Slug uniqueness validation
- [ ] Profile preview
- [ ] Save profile

**Files:**
- `src/app/auth/register/page.tsx`
- `src/app/seller/profile/page.tsx`
- `src/components/seller/profile-form.tsx`

---

### Agent Submission Form
- [ ] Multi-step form or single long form (decide)
- [ ] Title input with character counter
- [ ] Category dropdown
- [ ] Short description textarea (for cards)
- [ ] Workflow overview rich text editor (Markdown)
- [ ] Use case textarea
- [ ] Demo video URL input with preview
- [ ] Thumbnail upload (drag-and-drop)
- [ ] Base price input (number, currency formatted)
- [ ] Support add-on price input
- [ ] Setup guide Markdown editor (with preview)
- [ ] Form validation (client + server)
- [ ] Draft save functionality
- [ ] Submission preview modal
- [ ] Submit button

**Files:**
- `src/app/seller/agents/new/page.tsx`
- `src/components/seller/agent-submission-form.tsx`
- `src/components/forms/markdown-editor.tsx`
- `src/components/forms/image-upload.tsx`
- `src/components/forms/video-url-input.tsx`

---

### Submission Checklist UI
- [ ] Pre-submit checklist modal
- [ ] 5 checklist items (checkboxes)
- [ ] "I confirm all items" checkbox
- [ ] Cannot submit until all checked
- [ ] Educational tooltips for each item

**Files:**
- `src/components/seller/submission-checklist.tsx`

---

### Validation Rules
- [ ] Title: 10-80 characters
- [ ] Short description: 20-150 characters
- [ ] Workflow overview: 100+ words
- [ ] Setup guide: 200+ words
- [ ] Demo video: valid YouTube/Loom URL
- [ ] Price: $19-$999 range
- [ ] Thumbnail: required, max 2MB
- [ ] Category: required

**Files:**
- `src/lib/validators.ts` - Zod schemas

---

### Draft Functionality
- [ ] Auto-save to drafts every 30s
- [ ] "Save as Draft" button
- [ ] View drafts in seller dashboard
- [ ] Continue editing draft
- [ ] Delete draft

**Files:**
- `src/app/seller/agents/drafts/page.tsx`

---

### Image Upload
- [ ] Upload to S3/Cloudflare R2
- [ ] Image compression (Sharp)
- [ ] Generate thumbnail sizes
- [ ] Return CDN URL
- [ ] Handle upload errors

**Files:**
- `src/app/api/upload/route.ts`
- `src/lib/upload.ts`

---

### API Routes - Seller
- [ ] POST `/api/agents` - Create agent submission
  - Validate all fields
  - Set status to UNDER_REVIEW
  - Return agent ID
- [ ] PATCH `/api/agents/[id]` - Update agent
  - Only if DRAFT or REJECTED
  - Revalidate fields
  - Reset to UNDER_REVIEW if resubmitting
- [ ] GET `/api/seller/agents` - List seller's agents
  - Filter by status
  - Include stats

**Files:**
- `src/app/api/agents/route.ts`
- `src/app/api/agents/[id]/route.ts`
- `src/app/api/seller/agents/route.ts`

---

## Week 5: Admin Panel

### Admin Dashboard
- [ ] Pending agents count (big number)
- [ ] Recent submissions list (5 latest)
- [ ] Quick stats (total agents, total sales, revenue)
- [ ] Navigation to review queue

**Files:**
- `src/app/admin/page.tsx`
- `src/components/admin/stats-overview.tsx`

---

### Review Queue
- [ ] Table/grid of pending agents
- [ ] Filter by status (pending, approved, rejected)
- [ ] Sort by submission date
- [ ] Seller name column
- [ ] Category column
- [ ] "Review" button for each
- [ ] Quick approve/reject actions (with confirmation)

**Files:**
- `src/app/admin/agents/page.tsx`
- `src/components/admin/agent-review-queue.tsx`

---

### Review Detail Page
- [ ] Full agent preview (as buyers will see it)
- [ ] Demo video embedded and playable
- [ ] Full setup guide visible
- [ ] Seller profile link
- [ ] Submission history (if resubmitted)
- [ ] Approve button (green, prominent)
- [ ] Reject button (red, opens modal)

**Files:**
- `src/app/admin/agents/[id]/page.tsx`
- `src/components/admin/agent-review-detail.tsx`

---

### Rejection Modal
- [ ] Rejection reason checkboxes
  - Demo video missing/low quality
  - Setup guide incomplete
  - Workflow not clear
  - Use case too vague
  - Pricing unrealistic
  - Other (text field)
- [ ] Multiple reasons selectable
- [ ] Required to select at least one
- [ ] "Other" text field (if checked)
- [ ] Submit rejection button

**Files:**
- `src/components/admin/rejection-modal.tsx`

---

### Approval Flow
- [ ] Approve button click
- [ ] Update agent status to APPROVED
- [ ] Set approvedAt timestamp
- [ ] Agent goes live immediately
- [ ] Send approval email to seller
- [ ] Log admin action
- [ ] Show success toast

---

### Rejection Flow
- [ ] Reject button opens modal
- [ ] Select rejection reasons
- [ ] Submit rejection
- [ ] Update agent status to REJECTED
- [ ] Store rejection reason
- [ ] Send rejection email with feedback
- [ ] Log admin action
- [ ] Show success toast

---

### Email Notifications
- [ ] Approval email template
  - Congratulations message
  - Link to live agent
  - Link to portfolio
  - Share buttons
- [ ] Rejection email template
  - Specific feedback
  - Link to edit agent
  - Encouragement to resubmit
  - Support contact

**Files:**
- `src/lib/email-templates.tsx`

---

### Admin Logs
- [ ] Log all admin actions (approve, reject, feature, delete)
- [ ] Store admin ID, action type, entity ID, metadata
- [ ] View logs in admin panel (basic table)

**Files:**
- `src/app/admin/logs/page.tsx`
- `src/lib/admin-actions.ts`

---

### API Routes - Admin
- [ ] POST `/api/admin/agents/[id]/approve`
  - Verify admin role
  - Update status
  - Send email
  - Log action
- [ ] POST `/api/admin/agents/[id]/reject`
  - Verify admin role
  - Validate rejection reason
  - Update status
  - Send email
  - Log action
- [ ] GET `/api/admin/agents` - Get review queue
  - Filter by status
  - Pagination

**Files:**
- `src/app/api/admin/agents/[id]/approve/route.ts`
- `src/app/api/admin/agents/[id]/reject/route.ts`
- `src/app/api/admin/agents/route.ts`

---

## Week 6: Seller Portfolio

### Public Portfolio Page
- [ ] URL: `/seller/[slug]`
- [ ] Seller header section
  - Avatar (large)
  - Name
  - Bio
  - Social links (icons with links)
- [ ] Agent grid (only approved agents)
- [ ] Empty state if no agents
- [ ] Responsive layout
- [ ] Shareable URL

**Files:**
- `src/app/seller/[slug]/page.tsx`
- `src/components/seller/portfolio-preview.tsx`

---

### Portfolio Settings
- [ ] Edit portfolio slug (with uniqueness check)
- [ ] Edit bio
- [ ] Edit social links
- [ ] Preview portfolio button
- [ ] Copy portfolio URL button

**Files:**
- `src/app/seller/settings/page.tsx`

---

### Social Sharing
- [ ] Open Graph meta tags
  - og:title (Seller name)
  - og:description (Bio)
  - og:image (Avatar or default)
- [ ] Twitter Card meta tags
- [ ] Generate dynamic og:image (optional, nice-to-have)

**Files:**
- `src/app/seller/[slug]/page.tsx` (metadata export)

---

### API Routes - Portfolio
- [ ] GET `/api/sellers/[slug]` - Get seller profile
  - Include approved agents
  - Return 404 if slug not found
- [ ] PATCH `/api/sellers/[slug]` - Update profile
  - Validate slug uniqueness
  - Update bio/social links

**Files:**
- `src/app/api/sellers/[slug]/route.ts`

---

## Week 7: Polish & Testing

### Error Handling
- [ ] Global error boundary
- [ ] API error responses (consistent format)
- [ ] User-friendly error messages
- [ ] 404 page (custom)
- [ ] 500 error page (custom)
- [ ] "Unauthorized" page

**Files:**
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/app/unauthorized/page.tsx`

---

### Loading States
- [ ] Page-level loading spinners
- [ ] Skeleton loaders for cards/lists
- [ ] Button loading states (spinner + disabled)
- [ ] Optimistic UI updates where possible

**Files:**
- `src/components/shared/loading-spinner.tsx`
- `src/components/shared/skeleton.tsx`

---

### Responsive Design
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1440px width)
- [ ] Hamburger menu on mobile
- [ ] Touch-friendly buttons (44px min)
- [ ] Readable font sizes on all screens

---

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

### Security Audit
- [ ] Environment variables not exposed to client
- [ ] API routes validate user authentication
- [ ] Role-based access control enforced
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React handles this, but verify)
- [ ] CSRF protection (NextAuth handles this)
- [ ] Rate limiting on API routes (consider)
- [ ] Stripe webhook signature verification

---

### Performance Optimization
- [ ] Image optimization (next/image)
- [ ] Lazy load images below fold
- [ ] Code splitting (dynamic imports)
- [ ] Database query optimization (indexes)
- [ ] API response caching (where appropriate)
- [ ] Lighthouse score > 90 on landing page

---

### Accessibility
- [ ] Semantic HTML elements
- [ ] Alt text on all images
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

---

## Week 8: Launch Prep

### Content Creation
- [ ] Create 5-10 initial agents manually
  - Variety of categories
  - High-quality setup guides
  - Professional demo videos
- [ ] Onboard 2-3 beta sellers
- [ ] Get feedback from beta users

---

### Legal Pages
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Refund Policy page
- [ ] Link in footer

**Files:**
- `src/app/legal/terms/page.tsx`
- `src/app/legal/privacy/page.tsx`
- `src/app/legal/refund/page.tsx`

---

### Production Setup
- [ ] Set up production database (Railway/Supabase)
- [ ] Run database migrations in production
- [ ] Set up production environment variables
- [ ] Configure Stripe production keys
- [ ] Set up production webhook URL
- [ ] Configure custom domain
- [ ] SSL certificate (Vercel handles this)

---

### Monitoring & Analytics
- [ ] Set up Sentry for error tracking
- [ ] Configure Vercel Analytics (or Plausible)
- [ ] Set up uptime monitoring (UptimeRobot/Better Uptime)
- [ ] Create Slack/Discord channel for alerts
- [ ] Monitor Stripe webhook logs

---

### Email Verification
- [ ] Send test emails (all templates)
- [ ] Verify deliverability
- [ ] Check spam scores
- [ ] Configure SPF/DKIM records

---

### Final Testing
- [ ] End-to-end purchase flow (real Stripe test mode)
- [ ] Seller submission to approval flow
- [ ] Email notifications received
- [ ] Content unlocks after payment
- [ ] Mobile checkout works
- [ ] Support add-on purchases tracked

---

### Launch Day Checklist
- [ ] Deploy to production (Vercel)
- [ ] Verify all environment variables set
- [ ] Run smoke tests on production
- [ ] Create admin account
- [ ] Publish first batch of agents
- [ ] Announce on social media/Product Hunt/etc.
- [ ] Monitor error logs actively
- [ ] Be ready for hotfixes

---

## Post-Launch (First 30 Days)

### Week 1-2: Monitor & Fix
- [ ] Check error logs daily
- [ ] Respond to user feedback
- [ ] Fix critical bugs within 24h
- [ ] Talk to first 5 buyers (email or call)
- [ ] Talk to first 5 sellers (email or call)

### Week 3-4: Optimize
- [ ] Analyze conversion funnel
- [ ] A/B test landing page headline
- [ ] Improve agent detail page CTAs
- [ ] Fix UX friction points
- [ ] Add missing error handling

### Metrics to Track
- [ ] Daily agent purchases
- [ ] Seller signups per week
- [ ] Agent submissions per week
- [ ] Support add-on attach rate
- [ ] Time to agent approval
- [ ] Rejection rate by reason
- [ ] Refund rate
- [ ] Support request volume

---

## Nice-to-Have Features (Only After MVP Launch)

DO NOT work on these until all above is complete and launched:

### Seller Analytics
- [ ] Views per agent (time-series chart)
- [ ] Conversion rate per agent
- [ ] Revenue breakdown
- [ ] Downloadable reports

### Featured Agents
- [ ] Admin can feature agents
- [ ] Featured badge on cards
- [ ] Featured section on homepage
- [ ] Rotation logic

### Advanced Support
- [ ] Support ticket system
- [ ] Ticket status updates
- [ ] Internal admin notes
- [ ] Support assignment

### SEO Automation
- [ ] Auto-generate meta descriptions
- [ ] Dynamic sitemap
- [ ] Structured data (JSON-LD)
- [ ] Robots.txt

### Refund Tooling
- [ ] Admin refund button
- [ ] Partial refund option
- [ ] Refund reason tracking
- [ ] Refund email notification

### Versioning
- [ ] Agent version history
- [ ] Update notifications to buyers
- [ ] Changelog display

---

## Notes

- Mark items as complete with `[x]` when done
- Re-prioritize if needed based on feedback
- Focus on MUST-HAVEs first, always
- Ship fast, iterate based on real usage

---

**Document Version**: 1.0
**Last Updated**: 2025-12-19
