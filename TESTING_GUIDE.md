# 🧪 Testing Guide - Agent Status Management

## 📋 **Agent Status Manager Script**

I've created a convenient script to manage agent statuses for testing.

### **Commands:**

#### **1. List All Agents**
```bash
npm run manage-agent list
```

**Output:**
```
📋 All Agents:

ID                             | Title                           | Status         | Seller
────────────────────────────────────────────────────────────────────────────────────────────
cmjdqkm9k0001xej6j832ne9e      | Agent 2                         | DRAFT          | sakshamchauhan23@gmail.com
```

---

#### **2. Update Agent Status**

**Change to UNDER_REVIEW:**
```bash
npm run manage-agent update <agent-id> UNDER_REVIEW
```

**Change to APPROVED:**
```bash
npm run manage-agent update <agent-id> APPROVED
```

**Change to REJECTED (with reason):**
```bash
npm run manage-agent update <agent-id> REJECTED "Title needs to be more descriptive and explain the use case better"
```

**Change back to DRAFT:**
```bash
npm run manage-agent update <agent-id> DRAFT
```

---

## ✅ **Testing JIRA-3 & JIRA-4**

### **Test 1: Edit DRAFT Agent** ✅

1. **Go to dashboard:**
   ```
   http://localhost:3000/dashboard
   ```

2. **Click "Edit" on your draft agent**

3. **Expected Results:**
   - ✅ All fields are pre-filled with current values
   - ✅ Slug field is disabled (grayed out)
   - ✅ If video URL exists, video preview shows above the form
   - ✅ All fields are editable
   - ✅ "Save Changes" button is visible

4. **Make some changes:**
   - Change title to "Updated Test Agent"
   - Change price to 99.99
   - Change description

5. **Click "Save Changes"**

6. **Expected Results:**
   - ✅ Redirects to `/dashboard`
   - ✅ Changes are visible in dashboard
   - ✅ Agent card shows updated info

---

### **Test 2: Read-Only Mode (UNDER_REVIEW)** ⏳

1. **Get your agent ID from dashboard** (or use `npm run manage-agent list`)

2. **Update status to UNDER_REVIEW:**
   ```bash
   npm run manage-agent update <your-agent-id> UNDER_REVIEW
   ```

3. **Refresh dashboard and click "Edit"**

4. **Expected Results:**
   - ✅ Blue banner: "Editing Disabled - This agent is currently under review..."
   - ✅ All form fields are disabled (grayed out)
   - ✅ "Back to Dashboard" button instead of "Save Changes"
   - ✅ No way to submit changes

5. **Reset status back to DRAFT for more testing:**
   ```bash
   npm run manage-agent update <your-agent-id> DRAFT
   ```

---

### **Test 3: Rejection Reason Display** ⏳

1. **Update status to REJECTED with a reason:**
   ```bash
   npm run manage-agent update <your-agent-id> REJECTED "The title needs to be more descriptive. Please include what type of tasks this agent handles."
   ```

2. **Refresh dashboard and click "Edit"**

3. **Expected Results:**
   - ✅ Red banner at top: "Agent Rejected"
   - ✅ Rejection reason displayed: "Reason: The title needs to be more descriptive..."
   - ✅ Form is still EDITABLE (can fix and resubmit)
   - ✅ "Save Changes" button visible

4. **Make changes to fix the issues**

5. **Click "Save Changes"**

6. **Expected Results:**
   - ✅ Changes saved
   - ✅ Status STAYS as REJECTED (will change when we implement JIRA-10)
   - ✅ Rejection reason still visible (will clear when resubmitted)

---

### **Test 4: Approved State (Read-Only)** ⏳

1. **Update status to APPROVED:**
   ```bash
   npm run manage-agent update <your-agent-id> APPROVED
   ```

2. **Refresh dashboard and click "Edit"**

3. **Expected Results:**
   - ✅ Blue banner: "Editing Disabled - This agent is live on the marketplace..."
   - ✅ All fields disabled
   - ✅ "Back to Dashboard" button only
   - ✅ Video preview shows if URL exists

---

## 📝 **Quick Reference**

### **Agent Status Flow:**

```
DRAFT → UNDER_REVIEW → APPROVED (live)
                    ↓
                 REJECTED → (edit) → DRAFT → (resubmit) → UNDER_REVIEW
```

### **Editability Rules:**

| Status | Editable? | Can Save? | Button Text |
|--------|-----------|-----------|-------------|
| DRAFT | ✅ Yes | ✅ Yes | "Save Changes" |
| REJECTED | ✅ Yes | ✅ Yes | "Save Changes" |
| UNDER_REVIEW | ❌ No | ❌ No | "Back to Dashboard" |
| APPROVED | ❌ No | ❌ No | "Back to Dashboard" |

---

## 🎯 **What Works Now:**

- ✅ Edit page with pre-filled data
- ✅ Slug is locked (cannot change)
- ✅ Video preview if URL exists
- ✅ Ownership verification (only agent owner can edit)
- ✅ Status-based editability
- ✅ Rejection reason display
- ✅ Read-only mode for UNDER_REVIEW/APPROVED
- ✅ Save changes updates database
- ✅ Redirects to dashboard after save

---

## 🚀 **Coming Next:**

- ⏳ JIRA-5-7: Submit for Review button + workflow
- ⏳ JIRA-8: View submission page (for UNDER_REVIEW agents)
- ⏳ JIRA-9-10: Resubmit workflow (REJECTED → fix → resubmit)
- ⏳ JIRA-1-2: Dashboard status badges + dynamic CTAs

---

## 🛠️ **Troubleshooting:**

### **Can't find agent ID?**
```bash
npm run manage-agent list
```
This shows all agents with their IDs.

### **Script not working?**
Make sure you're in the project root directory:
```bash
cd /Users/apple/Desktop/RainesDev\(AI-Agent\)
npm run manage-agent list
```

### **Changes not showing?**
1. Refresh the page (Cmd+R)
2. Check terminal for any errors
3. Verify agent ID is correct

---

**Ready to test!** Try all 4 tests above and let me know if everything works as expected. 🚀
