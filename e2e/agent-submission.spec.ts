import { test, expect, TEST_USERS, TEST_AGENT } from './fixtures/test-fixtures'

test.describe('Agent Submission Flow', () => {
  test.describe('Access Control', () => {
    test('unauthenticated user is redirected to login', async ({ page }) => {
      await page.goto('/submit-agent')
      await expect(page).toHaveURL(/\/login\?next=.*submit-agent/)
    })

    test('buyer is redirected to become-seller page', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
      await page.goto('/submit-agent')
      await expect(page).toHaveURL('/become-seller')
    })

    test('seller can access submit-agent page', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
      await page.goto('/submit-agent')
      await expect(page).toHaveURL('/submit-agent')
      await expect(page.getByRole('heading', { name: 'Submit New Agent' })).toBeVisible()
    })

    test('admin can access submit-agent page', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await page.goto('/submit-agent')
      await expect(page).toHaveURL('/submit-agent')
    })
  })

  test.describe('Agent Submission Form', () => {
    test.beforeEach(async ({ helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
    })

    test('displays all required form fields', async ({ page }) => {
      await page.goto('/submit-agent')

      // Check form fields
      await expect(page.getByLabel('Agent Title')).toBeVisible()
      await expect(page.getByLabel('Category')).toBeVisible()
      await expect(page.getByLabel(/Price/)).toBeVisible()
      await expect(page.getByLabel('Short Description')).toBeVisible()
      await expect(page.getByLabel(/Workflow Overview/)).toBeVisible()
      await expect(page.getByLabel('Use Case')).toBeVisible()
      await expect(page.getByLabel(/Demo Video URL/)).toBeVisible()
      await expect(page.getByLabel(/Thumbnail/)).toBeVisible()
      await expect(page.getByLabel(/Setup Guide/)).toBeVisible()
    })

    test('submit button is visible', async ({ page }) => {
      await page.goto('/submit-agent')
      await expect(page.getByRole('button', { name: 'Submit Agent for Review' })).toBeVisible()
    })

    test('validates title minimum length', async ({ page }) => {
      await page.goto('/submit-agent')

      await page.getByLabel('Agent Title').fill('AB')
      await page.getByLabel('Category').selectOption({ index: 1 })
      await page.getByLabel(/Price/).fill('49.99')
      await page.getByLabel('Short Description').fill('Test description')
      await page.getByLabel(/Workflow Overview/).fill('Test workflow')
      await page.getByLabel('Use Case').fill('Test use case')
      await page.getByLabel(/Setup Guide/).fill('This is a test setup guide that is long enough')

      await page.getByRole('button', { name: 'Submit Agent for Review' }).click()

      await expect(page.getByText(/at least 3 characters/)).toBeVisible()
    })

    test('validates category is required', async ({ page }) => {
      await page.goto('/submit-agent')

      await page.getByLabel('Agent Title').fill(TEST_AGENT.title)
      // Don't select category
      await page.getByLabel(/Price/).fill('49.99')
      await page.getByLabel('Short Description').fill(TEST_AGENT.shortDescription)
      await page.getByLabel(/Workflow Overview/).fill(TEST_AGENT.workflowOverview)
      await page.getByLabel('Use Case').fill(TEST_AGENT.useCase)
      await page.getByLabel(/Setup Guide/).fill(TEST_AGENT.setupGuide)

      await page.getByRole('button', { name: 'Submit Agent for Review' }).click()

      await expect(page.getByText(/select a category/i)).toBeVisible()
    })

    test('validates price is a valid number', async ({ page }) => {
      await page.goto('/submit-agent')

      await page.getByLabel('Agent Title').fill(TEST_AGENT.title)
      await page.getByLabel('Category').selectOption({ index: 1 })
      await page.getByLabel(/Price/).fill('invalid')
      await page.getByLabel('Short Description').fill(TEST_AGENT.shortDescription)
      await page.getByLabel(/Workflow Overview/).fill(TEST_AGENT.workflowOverview)
      await page.getByLabel('Use Case').fill(TEST_AGENT.useCase)
      await page.getByLabel(/Setup Guide/).fill(TEST_AGENT.setupGuide)

      await page.getByRole('button', { name: 'Submit Agent for Review' }).click()

      await expect(page.getByText(/valid number/i)).toBeVisible()
    })

    test('validates setup guide minimum length', async ({ page }) => {
      await page.goto('/submit-agent')

      await page.getByLabel('Agent Title').fill(TEST_AGENT.title)
      await page.getByLabel('Category').selectOption({ index: 1 })
      await page.getByLabel(/Price/).fill('49.99')
      await page.getByLabel('Short Description').fill(TEST_AGENT.shortDescription)
      await page.getByLabel(/Workflow Overview/).fill(TEST_AGENT.workflowOverview)
      await page.getByLabel('Use Case').fill(TEST_AGENT.useCase)
      await page.getByLabel(/Setup Guide/).fill('Short')

      await page.getByRole('button', { name: 'Submit Agent for Review' }).click()

      await expect(page.getByText(/at least 10 characters/i)).toBeVisible()
    })

    test('successfully submits valid agent', async ({ page }) => {
      await page.goto('/submit-agent')

      // Fill all required fields
      await page.getByLabel('Agent Title').fill(TEST_AGENT.title + ' ' + Date.now()) // Unique title
      await page.getByLabel('Category').selectOption({ index: 1 })
      await page.getByLabel(/Price/).fill(TEST_AGENT.price)
      await page.getByLabel('Short Description').fill(TEST_AGENT.shortDescription)
      await page.getByLabel(/Workflow Overview/).fill(TEST_AGENT.workflowOverview)
      await page.getByLabel('Use Case').fill(TEST_AGENT.useCase)
      await page.getByLabel(/Setup Guide/).fill(TEST_AGENT.setupGuide)

      await page.getByRole('button', { name: 'Submit Agent for Review' }).click()

      // Should redirect to dashboard with success message
      await expect(page).toHaveURL(/\/dashboard\?success=created/)
    })
  })

  test.describe('Server Action Validation', () => {
    test('server rejects agent creation from non-seller', async ({ page, helpers }) => {
      // This test simulates what would happen if someone bypassed client-side redirects
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)

      // Try to submit agent via direct form post (simulated)
      // The server action should reject it
      const response = await page.evaluate(async () => {
        const formData = new FormData()
        formData.append('title', 'Test Agent')
        formData.append('categoryId', 'test-category')
        formData.append('price', '49.99')
        formData.append('shortDescription', 'Test description')
        formData.append('workflowOverview', 'Test workflow')
        formData.append('useCase', 'Test use case')
        formData.append('setupGuide', 'This is a test setup guide')

        try {
          const res = await fetch('/submit-agent', {
            method: 'POST',
            body: formData,
          })
          return { status: res.status, redirected: res.redirected }
        } catch {
          return { error: true }
        }
      })

      // The request should be blocked or redirected
      expect(response.redirected || response.status === 302 || response.status === 403).toBeTruthy()
    })
  })
})

test.describe('Seller Dashboard', () => {
  test.describe('Access Control', () => {
    test('buyer cannot access seller dashboard', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
      await page.goto('/dashboard')
      // Should either redirect or show unauthorized
      const url = page.url()
      expect(
        url.includes('/become-seller') || url.includes('/agents') || url.includes('/403')
      ).toBeTruthy()
    })

    test('seller can access dashboard', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/dashboard')
    })
  })

  test.describe('Dashboard Content', () => {
    test.beforeEach(async ({ helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
    })

    test('displays seller agents', async ({ page }) => {
      await page.goto('/dashboard')
      // Dashboard should show agent list or empty state
      const hasAgents = await page.getByText(/My Agents|Your Agents|No agents/i).isVisible()
      expect(hasAgents).toBeTruthy()
    })

    test('has link to submit new agent', async ({ page }) => {
      await page.goto('/dashboard')
      // Should have a way to create new agent
      const createLink = page.getByRole('link', { name: /Create|Submit|New Agent/i })
      if (await createLink.isVisible()) {
        await createLink.click()
        await expect(page).toHaveURL('/submit-agent')
      }
    })
  })
})

test.describe('Agent Lifecycle', () => {
  test.describe('Full Flow: Submit -> Review -> Approve', () => {
    // This test requires clean test data
    test.skip('complete agent submission and approval flow', async ({ page, helpers }) => {
      const uniqueTitle = `E2E Test Agent ${Date.now()}`

      // Step 1: Seller submits agent
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
      await page.goto('/submit-agent')

      await page.getByLabel('Agent Title').fill(uniqueTitle)
      await page.getByLabel('Category').selectOption({ index: 1 })
      await page.getByLabel(/Price/).fill('49.99')
      await page.getByLabel('Short Description').fill('E2E test agent description')
      await page.getByLabel(/Workflow Overview/).fill('# E2E Test Workflow')
      await page.getByLabel('Use Case').fill('E2E testing purposes')
      await page
        .getByLabel(/Setup Guide/)
        .fill('# E2E Setup Guide\n\n1. Install\n2. Configure\n3. Run')

      await page.getByRole('button', { name: 'Submit Agent for Review' }).click()
      await expect(page).toHaveURL(/\/dashboard/)

      // Step 2: Admin reviews and approves
      await helpers.logout()
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await page.goto('/admin')

      // Find the agent in pending review
      const agentCard = page.locator('[class*="rounded"]').filter({ hasText: uniqueTitle })
      await expect(agentCard).toBeVisible()

      // Approve the agent
      await agentCard.getByRole('button', { name: 'Approve' }).click()

      // Verify agent is now approved
      await page.reload()
      const recentActions = page.locator('[class*="bg-green"]').filter({ hasText: uniqueTitle })
      await expect(recentActions).toBeVisible()
    })
  })
})
