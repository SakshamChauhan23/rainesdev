# 🎯 Seller Workflow - Development Plan

## 📊 Overview

This document breaks down the complete Seller Workflow into actionable development steps, organized by Epic and prioritized for MVP delivery.

**Total Epics:** 6
**Total Stories:** 12
**Estimated Development Time:** 3-4 weeks

---

## 🏗️ Epic Breakdown & Dependencies

```
EPIC 1: Seller Dashboard – Lifecycle Visibility
  ↓
EPIC 2: Agent Edit (Critical Seller Capability)
  ↓
EPIC 3: Submit Agent for Review
  ↓
EPIC 4: Review Pending State (Seller Side)
  ↓
EPIC 5: Rejection Handling (Critical Loop Closure)
  ↓
EPIC 6: Approved Agent State
```

---

# 🚀 SPRINT 1: Foundation (Week 1)

## EPIC 1: Seller Dashboard – Lifecycle Visibility

### ✅ Current State
- Dashboard exists at `/dashboard`
- Agents displayed in grid
- Basic "View" and "Edit" buttons present

### 🔨 Work Required

---

### **JIRA-1: Display Agent Status Badge on Seller Dashboard**
**Priority:** P0 | **Effort:** 2 points | **Time:** 2 hours

#### Implementation Steps

1. **Update Dashboard Component**
   - File: `src/app/dashboard/page.tsx`
   - Already fetches `agent.status` from DB
   - Badge component already in use

2. **Update Status Badge Styling**
   ```tsx
   // Add status-specific styling
   const getStatusVariant = (status: AgentStatus) => {
     switch (status) {
       case 'DRAFT': return 'secondary'
       case 'UNDER_REVIEW': return 'default'
       case 'APPROVED': return 'default'
       case 'REJECTED': return 'destructive'
       default: return 'secondary'
     }
   }
   ```

3. **Update Agent Card Display**
   - Change badge color based on status
   - Ensure status is visible before price

#### Acceptance Criteria Checklist
- [ ] Each agent card shows exactly one status badge
- [ ] DRAFT status shows secondary variant
- [ ] UNDER_REVIEW status shows default variant
- [ ] APPROVED status shows success/default variant
- [ ] REJECTED status shows destructive variant
- [ ] Status badge updates immediately after status change
- [ ] Status is derived from `agent.status` in DB

#### Files to Modify
- `src/app/dashboard/page.tsx` (lines 104-113)

---

### **JIRA-2: Show Primary CTA Based on Agent Status**
**Priority:** P0 | **Effort:** 3 points | **Time:** 3 hours

#### Implementation Steps

1. **Create CTA Logic Function**
   ```tsx
   function getAgentCTA(status: AgentStatus, slug: string, id: string) {
     switch (status) {
       case 'DRAFT':
         return { text: 'Edit Agent', href: `/dashboard/agents/${id}/edit`, variant: 'default' }
       case 'UNDER_REVIEW':
         return { text: 'View Submission', href: `/dashboard/agents/${id}`, variant: 'outline' }
       case 'APPROVED':
         return { text: 'View Live', href: `/agents/${slug}`, variant: 'default' }
       case 'REJECTED':
         return { text: 'Edit & Resubmit', href: `/dashboard/agents/${id}/edit`, variant: 'destructive' }
       default:
         return { text: 'View', href: `/agents/${slug}`, variant: 'outline' }
     }
   }
   ```

2. **Replace Current Button Logic**
   - Remove current "View" and "Edit" buttons
   - Replace with single dynamic CTA
   - Use function above to determine button properties

3. **Update CardFooter**
   ```tsx
   <CardFooter className="border-t bg-muted/50 p-4">
     <Button
       variant={cta.variant}
       className="w-full"
       asChild
     >
       <Link href={cta.href}>
         {cta.text}
       </Link>
     </Button>
   </CardFooter>
   ```

#### Acceptance Criteria Checklist
- [ ] DRAFT agents show "Edit Agent" button
- [ ] UNDER_REVIEW agents show "View Submission" button
- [ ] APPROVED agents show "View Live" button
- [ ] REJECTED agents show "Edit & Resubmit" button
- [ ] Only ONE CTA visible per agent
- [ ] CTA routes correctly to specified page
- [ ] No secondary actions shown

#### Files to Modify
- `src/app/dashboard/page.tsx` (lines 128-139)

---

## Sprint 1 Deliverables
- ✅ Status badges working correctly
- ✅ Dynamic CTAs based on status
- ✅ Dashboard shows clear next actions

---

# 🚀 SPRINT 2: Edit Capability (Week 1-2)

## EPIC 2: Agent Edit (Critical Seller Capability)

---

### **JIRA-3: Create Edit Agent Page**
**Priority:** P0 | **Effort:** 5 points | **Time:** 5 hours

#### Implementation Steps

1. **Create Edit Page Route**
   ```bash
   mkdir -p src/app/dashboard/agents/[id]/edit
   touch src/app/dashboard/agents/[id]/edit/page.tsx
   ```

2. **Fetch Existing Agent Data**
   ```tsx
   // src/app/dashboard/agents/[id]/edit/page.tsx
   import { createClient } from '@/lib/supabase/server'
   import { redirect } from 'next/navigation'
   import { prisma } from '@/lib/prisma'

   export default async function EditAgentPage({ params }: { params: { id: string } }) {
     const supabase = createClient()
     const { data: { user } } = await supabase.auth.getUser()

     if (!user) redirect('/login')

     const agent = await prisma.agent.findUnique({
       where: { id: params.id },
       include: { category: true }
     })

     if (!agent || agent.sellerId !== user.id) {
       redirect('/dashboard')
     }

     // Check if editable
     const isEditable = agent.status === 'DRAFT' || agent.status === 'REJECTED'

     const categories = await prisma.category.findMany({
       select: { id: true, name: true },
       orderBy: { name: 'asc' }
     })

     return (
       <Container className="max-w-3xl py-12">
         <EditAgentForm
           agent={agent}
           categories={categories}
           isReadOnly={!isEditable}
         />
       </Container>
     )
   }
   ```

3. **Create Edit Form Component**
   ```bash
   touch src/components/agent/edit-agent-form.tsx
   ```

4. **Reuse Submission Form Logic**
   - Copy `submit-agent-form.tsx` structure
   - Pre-fill all fields with agent data
   - Add `isReadOnly` prop for read-only mode
   - Change action to `updateAgent` instead of `createAgent`

5. **Handle Read-Only Mode**
   - If status is `UNDER_REVIEW` or `APPROVED`, disable all inputs
   - Show banner: "This agent cannot be edited in its current state"
   - Remove submit button, show "Back to Dashboard" instead

#### Acceptance Criteria Checklist
- [ ] Route exists at `/dashboard/agents/[id]/edit`
- [ ] Form reuses existing submission form structure
- [ ] All fields pre-filled from database
- [ ] Editable only if status = `DRAFT` or `REJECTED`
- [ ] If status = `UNDER_REVIEW` or `APPROVED`, page is read-only
- [ ] Non-owners redirected to dashboard
- [ ] Slug field is disabled (never changes)

#### Files to Create
- `src/app/dashboard/agents/[id]/edit/page.tsx`
- `src/components/agent/edit-agent-form.tsx`

#### Files to Reference
- `src/app/submit-agent/page.tsx` (template)
- `src/components/agent/submit-agent-form.tsx` (template)

---

### **JIRA-4: Save Edited Agent Changes**
**Priority:** P0 | **Effort:** 3 points | **Time:** 3 hours

#### Implementation Steps

1. **Create Update Server Action**
   ```bash
   touch src/app/dashboard/agents/[id]/edit/actions.ts
   ```

2. **Implement Update Logic**
   ```tsx
   'use server'

   import { createClient } from '@/lib/supabase/server'
   import { prisma } from '@/lib/prisma'
   import { redirect } from 'next/navigation'

   export type UpdateAgentState = {
     errors?: {
       title?: string[]
       price?: string[]
       _form?: string[]
     }
     message?: string
   }

   export async function updateAgent(
     agentId: string,
     prevState: UpdateAgentState,
     formData: FormData
   ): Promise<UpdateAgentState> {
     const supabase = createClient()
     const { data: { user } } = await supabase.auth.getUser()

     if (!user) {
       return { message: 'You must be logged in' }
     }

     // Verify ownership and editability
     const agent = await prisma.agent.findUnique({
       where: { id: agentId }
     })

     if (!agent || agent.sellerId !== user.id) {
       return { message: 'Agent not found or access denied' }
     }

     if (agent.status !== 'DRAFT' && agent.status !== 'REJECTED') {
       return { message: 'Agent cannot be edited in current state' }
     }

     // Extract and validate fields
     const title = formData.get('title') as string
     const categoryId = formData.get('categoryId') as string
     const shortDescription = formData.get('shortDescription') as string
     const price = parseFloat(formData.get('price') as string)
     const workflowOverview = formData.get('workflowOverview') as string
     const useCase = formData.get('useCase') as string
     const demoVideoUrl = formData.get('demoVideoUrl') as string

     if (!title || title.length < 3) {
       return { message: 'Title must be at least 3 characters' }
     }
     if (!categoryId) {
       return { message: 'Please select a category' }
     }
     if (isNaN(price) || price < 0) {
       return { message: 'Price must be a valid number' }
     }

     try {
       await prisma.agent.update({
         where: { id: agentId },
         data: {
           title,
           categoryId,
           shortDescription,
           price,
           workflowOverview,
           useCase,
           demoVideoUrl: demoVideoUrl || null,
         }
       })
     } catch (error) {
       console.error('Failed to update agent:', error)
       return { message: 'Database error: Failed to update agent' }
     }

     redirect('/dashboard')
   }
   ```

3. **Update Form to Use New Action**
   - Bind action with agent ID
   - Use `useFormState` with `updateAgent`
   - Show success/error messages

#### Acceptance Criteria Checklist
- [ ] Save button persists changes to DB
- [ ] Success redirects to `/dashboard`
- [ ] Error state shown if save fails
- [ ] Validation rules same as create
- [ ] Only owner can update
- [ ] Only DRAFT/REJECTED can be updated
- [ ] Slug never changes on update

#### Files to Create
- `src/app/dashboard/agents/[id]/edit/actions.ts`

#### Files to Modify
- `src/components/agent/edit-agent-form.tsx`

---

## Sprint 2 Deliverables
- ✅ Edit page functional for DRAFT/REJECTED agents
- ✅ Update action working correctly
- ✅ Read-only mode for other statuses

---

# 🚀 SPRINT 3: Review Submission (Week 2)

## EPIC 3: Submit Agent for Review

---

### **JIRA-5: Add "Submit for Review" Action**
**Priority:** P0 | **Effort:** 2 points | **Time:** 2 hours

#### Implementation Steps

1. **Add Submit Button to Dashboard**
   - Show only when `status === 'DRAFT'`
   - Place in agent card footer (secondary action)
   - OR add to edit page as primary action

2. **Update Dashboard Card**
   ```tsx
   {agent.status === 'DRAFT' && (
     <div className="flex gap-2 w-full">
       <Button variant="default" className="flex-1" asChild>
         <Link href={`/dashboard/agents/${agent.id}/edit`}>
           Edit Agent
         </Link>
       </Button>
       <Button
         variant="outline"
         className="flex-1"
         onClick={() => setSubmitModalOpen(agent.id)}
       >
         Submit for Review
       </Button>
     </div>
   )}
   ```

3. **Alternative: Add to Edit Page**
   - Add "Submit for Review" button at bottom of edit page
   - Only visible for DRAFT agents
   - Opens confirmation modal

#### Acceptance Criteria Checklist
- [ ] Button visible only when status = `DRAFT`
- [ ] Button text: "Submit for Review"
- [ ] Clicking opens confirmation modal
- [ ] Button styled appropriately (outline or secondary variant)

#### Files to Modify
- `src/app/dashboard/page.tsx` OR
- `src/app/dashboard/agents/[id]/edit/page.tsx`

---

### **JIRA-6: Confirmation Modal for Submit for Review**
**Priority:** P0 | **Effort:** 3 points | **Time:** 3 hours

#### Implementation Steps

1. **Create Submit Confirmation Dialog Component**
   ```bash
   touch src/components/agent/submit-confirmation-dialog.tsx
   ```

2. **Implement Dialog**
   ```tsx
   'use client'

   import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
   } from '@/components/ui/dialog'
   import { Button } from '@/components/ui/button'
   import { useState } from 'react'
   import { submitAgentForReview } from '@/app/dashboard/agents/actions'

   export function SubmitConfirmationDialog({
     agentId,
     isOpen,
     onClose
   }: {
     agentId: string
     isOpen: boolean
     onClose: () => void
   }) {
     const [loading, setLoading] = useState(false)

     const handleConfirm = async () => {
       setLoading(true)
       await submitAgentForReview(agentId)
       onClose()
       window.location.reload() // Or use router.refresh()
     }

     return (
       <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Submit for Review?</DialogTitle>
             <DialogDescription>
               You won't be able to edit this agent until review is complete.
             </DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <Button variant="outline" onClick={onClose} disabled={loading}>
               Cancel
             </Button>
             <Button onClick={handleConfirm} disabled={loading}>
               {loading ? 'Submitting...' : 'Confirm'}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     )
   }
   ```

3. **Add Dialog to Dashboard**
   - Import and use dialog component
   - Manage open/close state
   - Pass agent ID to dialog

#### Acceptance Criteria Checklist
- [ ] Modal displays confirmation message
- [ ] Modal text: "You won't be able to edit this agent until review is complete."
- [ ] Confirm button proceeds with submission
- [ ] Cancel button closes modal with no action
- [ ] Modal prevents accidental submission

#### Files to Create
- `src/components/agent/submit-confirmation-dialog.tsx`

#### Files to Modify
- `src/app/dashboard/page.tsx`

---

### **JIRA-7: Update Agent Status to UNDER_REVIEW**
**Priority:** P0 | **Effort:** 2 points | **Time:** 2 hours

#### Implementation Steps

1. **Create Submit Server Action**
   ```bash
   touch src/app/dashboard/agents/actions.ts
   ```

2. **Implement Status Update**
   ```tsx
   'use server'

   import { createClient } from '@/lib/supabase/server'
   import { prisma } from '@/lib/prisma'
   import { revalidatePath } from 'next/cache'

   export async function submitAgentForReview(agentId: string) {
     const supabase = createClient()
     const { data: { user } } = await supabase.auth.getUser()

     if (!user) {
       throw new Error('Unauthorized')
     }

     const agent = await prisma.agent.findUnique({
       where: { id: agentId }
     })

     if (!agent || agent.sellerId !== user.id) {
       throw new Error('Agent not found')
     }

     if (agent.status !== 'DRAFT') {
       throw new Error('Agent must be in DRAFT status')
     }

     await prisma.agent.update({
       where: { id: agentId },
       data: { status: 'UNDER_REVIEW' }
     })

     revalidatePath('/dashboard')
   }
   ```

3. **Handle Success/Error**
   - Show success toast (optional)
   - Refresh dashboard to show new status
   - Update CTA to "View Submission"

#### Acceptance Criteria Checklist
- [ ] Status changes from `DRAFT` → `UNDER_REVIEW`
- [ ] Only owner can submit
- [ ] Only DRAFT agents can be submitted
- [ ] Editing disabled immediately after submission
- [ ] Dashboard updates without manual refresh
- [ ] CTA changes to "View Submission"

#### Files to Create
- `src/app/dashboard/agents/actions.ts`

#### Files to Modify
- `src/components/agent/submit-confirmation-dialog.tsx`

---

## Sprint 3 Deliverables
- ✅ Submit for review button working
- ✅ Confirmation modal functional
- ✅ Status updates correctly

---

# 🚀 SPRINT 4: Pending & Rejection States (Week 3)

## EPIC 4: Review Pending State (Seller Side)

---

### **JIRA-8: Read-Only Submission View**
**Priority:** P1 | **Effort:** 3 points | **Time:** 3 hours

#### Implementation Steps

1. **Create View Submission Page**
   ```bash
   mkdir -p src/app/dashboard/agents/[id]
   touch src/app/dashboard/agents/[id]/page.tsx
   ```

2. **Implement Read-Only View**
   ```tsx
   import { createClient } from '@/lib/supabase/server'
   import { redirect } from 'next/navigation'
   import { prisma } from '@/lib/prisma'
   import { Container } from '@/components/layout/container'
   import { AgentHero } from '@/components/agent/agent-hero'
   import { WorkflowContent } from '@/components/agent/workflow-content'
   import { VideoPlayer } from '@/components/agent/video-player'

   export default async function ViewSubmissionPage({ params }: { params: { id: string } }) {
     const supabase = createClient()
     const { data: { user } } = await supabase.auth.getUser()

     if (!user) redirect('/login')

     const agent = await prisma.agent.findUnique({
       where: { id: params.id },
       include: { category: true, seller: true }
     })

     if (!agent || agent.sellerId !== user.id) {
       redirect('/dashboard')
     }

     return (
       <Container className="py-12">
         {agent.status === 'UNDER_REVIEW' && (
           <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-900">
             <p className="font-medium">Your agent is currently under review</p>
             <p className="text-sm">You'll be notified once the review is complete.</p>
           </div>
         )}

         <AgentHero agent={agent} />
         {agent.demoVideoUrl && <VideoPlayer url={agent.demoVideoUrl} />}
         <WorkflowContent
           workflowOverview={agent.workflowOverview}
           useCase={agent.useCase}
         />
       </Container>
     )
   }
   ```

3. **Reuse Public Agent Components**
   - Use same layout as public agent page
   - No edit controls
   - Add status banner at top

#### Acceptance Criteria Checklist
- [ ] "View Submission" opens read-only agent preview
- [ ] Preview matches public agent page layout
- [ ] Banner text: "Your agent is currently under review"
- [ ] No edit controls visible
- [ ] Only accessible by agent owner

#### Files to Create
- `src/app/dashboard/agents/[id]/page.tsx`

#### Files to Reference
- `src/app/agents/[slug]/page.tsx` (layout template)

---

## EPIC 5: Rejection Handling (Critical Loop Closure)

---

### **JIRA-9: Display Rejection Reason to Seller**
**Priority:** P0 | **Effort:** 2 points | **Time:** 2 hours

#### Implementation Steps

1. **Update View Submission Page**
   - Add rejection reason display for REJECTED status
   - Show in alert/banner format

2. **Add Rejection Banner**
   ```tsx
   {agent.status === 'REJECTED' && agent.rejectionReason && (
     <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-900">
       <p className="font-semibold mb-2">Agent Rejected</p>
       <p className="text-sm">
         <strong>Reason:</strong> {agent.rejectionReason}
       </p>
     </div>
   )}
   ```

3. **Update Edit Page**
   - Show rejection reason at top of edit page
   - Clearly labeled "Rejection Reason"
   - Read-only text display

#### Acceptance Criteria Checklist
- [ ] Rejection reason visible only when status = `REJECTED`
- [ ] Text is read-only
- [ ] Clearly labeled "Rejection Reason"
- [ ] Displayed prominently (banner/alert style)
- [ ] Visible on both view and edit pages

#### Files to Modify
- `src/app/dashboard/agents/[id]/page.tsx`
- `src/app/dashboard/agents/[id]/edit/page.tsx`

---

### **JIRA-10: Enable Edit & Resubmit After Rejection**
**Priority:** P0 | **Effort:** 3 points | **Time:** 3 hours

#### Implementation Steps

1. **Update Edit Action for Resubmit**
   - Modify `updateAgent` action to handle resubmit
   - Add optional `resubmit` parameter

2. **Create Resubmit Action**
   ```tsx
   export async function updateAndResubmitAgent(
     agentId: string,
     prevState: UpdateAgentState,
     formData: FormData
   ): Promise<UpdateAgentState> {
     // ... same validation as updateAgent ...

     try {
       await prisma.agent.update({
         where: { id: agentId },
         data: {
           title,
           categoryId,
           shortDescription,
           price,
           workflowOverview,
           useCase,
           demoVideoUrl: demoVideoUrl || null,
           status: 'UNDER_REVIEW', // Change status on resubmit
           rejectionReason: null,   // Clear rejection reason
         }
       })
     } catch (error) {
       return { message: 'Failed to resubmit agent' }
     }

     redirect('/dashboard')
   }
   ```

3. **Update Edit Form**
   - Add "Save as Draft" button (updates without status change)
   - Add "Submit for Review" button (updates and changes status)
   - Only show submit button for REJECTED agents

4. **Clear Rejection Reason on Resubmit**
   - When status changes to UNDER_REVIEW, set `rejectionReason` to null

#### Acceptance Criteria Checklist
- [ ] "Edit & Resubmit" CTA opens edit page
- [ ] After resubmit, status → `UNDER_REVIEW`
- [ ] After resubmit, old rejection reason cleared
- [ ] Can save as draft without resubmitting
- [ ] Can resubmit directly from edit page
- [ ] Only REJECTED agents can resubmit

#### Files to Modify
- `src/app/dashboard/agents/[id]/edit/actions.ts`
- `src/components/agent/edit-agent-form.tsx`

---

## Sprint 4 Deliverables
- ✅ View submission page working
- ✅ Rejection reason displayed
- ✅ Resubmit flow functional

---

# 🚀 SPRINT 5: Approved State & Polish (Week 3-4)

## EPIC 6: Approved Agent State

---

### **JIRA-11: Approved Agent Read-Only State**
**Priority:** P1 | **Effort:** 2 points | **Time:** 2 hours

#### Implementation Steps

1. **Update View/Edit Pages**
   - Detect APPROVED status
   - Show read-only banner
   - Disable all editing

2. **Add Approved Banner**
   ```tsx
   {agent.status === 'APPROVED' && (
     <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-900">
       <p className="font-semibold">This agent is live on the marketplace</p>
       <p className="text-sm">
         Buyers can now purchase and use your agent workflow.
       </p>
     </div>
   )}
   ```

3. **Remove Edit Controls**
   - No edit or submit buttons visible
   - Edit page shows read-only view with banner

#### Acceptance Criteria Checklist
- [ ] Approved agents are fully read-only
- [ ] Banner text: "This agent is live on the marketplace"
- [ ] No edit or submit buttons visible
- [ ] Edit page redirects to view page OR shows read-only view

#### Files to Modify
- `src/app/dashboard/agents/[id]/page.tsx`
- `src/app/dashboard/agents/[id]/edit/page.tsx`

---

### **JIRA-12: View Live Agent Link**
**Priority:** P1 | **Effort:** 1 point | **Time:** 1 hour

#### Implementation Steps

1. **Update Dashboard CTA**
   - Already implemented in JIRA-2
   - Verify "View Live" routes to `/agents/[slug]`

2. **Add "View Live" to View Page**
   ```tsx
   {agent.status === 'APPROVED' && (
     <div className="mb-6">
       <Button asChild>
         <Link href={`/agents/${agent.slug}`}>
           View Live Listing
         </Link>
       </Button>
     </div>
   )}
   ```

#### Acceptance Criteria Checklist
- [ ] "View Live" button opens public agent page
- [ ] Opens in same tab
- [ ] URL matches `/agents/[slug]`
- [ ] Only visible for APPROVED agents

#### Files to Modify
- `src/app/dashboard/page.tsx` (already done in JIRA-2)
- `src/app/dashboard/agents/[id]/page.tsx`

---

## Sprint 5 Deliverables
- ✅ Approved state handled correctly
- ✅ View live link working
- ✅ Complete seller workflow functional

---

# 📊 Implementation Summary

## Total Effort Estimate

| Sprint | Epic | Stories | Points | Hours | Days |
|--------|------|---------|--------|-------|------|
| Sprint 1 | Epic 1: Dashboard | 2 | 5 | 5h | 1d |
| Sprint 2 | Epic 2: Edit | 2 | 8 | 8h | 1.5d |
| Sprint 3 | Epic 3: Submit | 3 | 7 | 7h | 1d |
| Sprint 4 | Epic 4-5: Pending/Reject | 3 | 7 | 7h | 1d |
| Sprint 5 | Epic 6: Approved | 2 | 3 | 3h | 0.5d |
| **Total** | **6 Epics** | **12 Stories** | **30 points** | **30h** | **5 days** |

**Realistic Timeline:** 2-3 weeks (accounting for testing, debugging, edge cases)

---

## Files to Create (New)

1. `src/app/dashboard/agents/[id]/edit/page.tsx`
2. `src/app/dashboard/agents/[id]/edit/actions.ts`
3. `src/app/dashboard/agents/[id]/page.tsx`
4. `src/app/dashboard/agents/actions.ts`
5. `src/components/agent/edit-agent-form.tsx`
6. `src/components/agent/submit-confirmation-dialog.tsx`

**Total New Files:** 6

---

## Files to Modify (Existing)

1. `src/app/dashboard/page.tsx` - Update status badges and CTAs
2. Database schema (if needed) - Already has `status` and `rejectionReason` fields

**Total Modified Files:** 1 (potentially 2)

---

## Database Schema Verification

### Required Fields (Already Exist ✅)
```prisma
model Agent {
  status          AgentStatus @default(DRAFT)  ✅
  rejectionReason String?     @db.Text         ✅
  slug            String      @unique          ✅
}

enum AgentStatus {
  DRAFT          ✅
  UNDER_REVIEW   ✅
  APPROVED       ✅
  REJECTED       ✅
  ARCHIVED       ✅
}
```

**No database migrations needed!** All required fields already exist.

---

## Testing Checklist

### Per Sprint Testing

**Sprint 1:**
- [ ] Status badges display correctly for all statuses
- [ ] CTAs match expected status
- [ ] Links route correctly

**Sprint 2:**
- [ ] Edit page loads with pre-filled data
- [ ] Save updates database correctly
- [ ] Read-only mode prevents edits
- [ ] Non-owners cannot access

**Sprint 3:**
- [ ] Submit button only shows for DRAFT
- [ ] Confirmation modal works
- [ ] Status updates to UNDER_REVIEW
- [ ] Dashboard reflects new status

**Sprint 4:**
- [ ] View submission shows correct data
- [ ] Rejection reason displays
- [ ] Resubmit clears rejection and updates status
- [ ] Can save as draft without resubmitting

**Sprint 5:**
- [ ] Approved agents are read-only
- [ ] View live link works
- [ ] All statuses handled correctly

---

## Risk Mitigation

### Potential Issues & Solutions

1. **Session/Auth Issues**
   - Risk: User not authenticated on server actions
   - Solution: Already handled with Supabase SSR client

2. **Foreign Key Errors**
   - Risk: User ID mismatch (current issue)
   - Solution: Debug logging in place, fix before starting

3. **Concurrent Edits**
   - Risk: Admin approves while seller edits
   - Solution: Check status before every update

4. **Slug Changes**
   - Risk: Slug changing breaks URLs
   - Solution: Disable slug field in edit form

---

## Next Immediate Action

**BEFORE starting this workflow:**
1. ✅ Fix current agent submission error (JIRA-CURRENT)
2. ✅ Verify authentication working
3. ✅ Test creating a draft agent successfully

**THEN start with:**
- **JIRA-1** (2 hours) - Update status badges on dashboard

---

## Dependencies

### External Dependencies (Already Configured)
- ✅ Prisma ORM
- ✅ Supabase Auth
- ✅ shadcn/ui components (Dialog, Button, Badge)
- ✅ Next.js App Router

### Internal Dependencies
- Must fix agent submission error FIRST
- Each epic builds on previous epic
- Cannot skip JIRA-3 (edit page) - it's required for all other tickets

---

**Document Version:** 1.0
**Last Updated:** 2025-12-20
**Status:** Ready for Development
