import { test, expect, TEST_USERS } from './fixtures/test-fixtures'

test.describe('Marketplace Core Functionality', () => {
  test.describe('Public Pages', () => {
    test('homepage loads successfully', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveTitle(/Rouze|AI Agent|Marketplace/i)
    })

    test('agents page is accessible without login', async ({ page }) => {
      await page.goto('/agents')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('agent detail page loads for valid agent', async ({ page }) => {
      await page.goto('/agents')

      // Click on first agent if available
      const agentCard = page.locator('[class*="card"]').first()
      if (await agentCard.isVisible()) {
        await agentCard.click()
        // Should navigate to agent detail page
        await expect(page).toHaveURL(/\/agents\/[\w-]+/)
      }
    })

    test('categories are displayed on agents page', async ({ page }) => {
      await page.goto('/agents')

      // Categories should be visible as filters
      const categoryFilters = page.locator('[class*="category"], [class*="filter"]')
      const hasCategories = (await categoryFilters.count()) > 0
      // Categories might be in different UI elements
      expect(
        hasCategories || (await page.getByText(/Customer Support|Sales/i).isVisible())
      ).toBeTruthy()
    })
  })

  test.describe('Authentication', () => {
    test('login page loads', async ({ page }) => {
      await page.goto('/login')
      await expect(page.getByRole('heading', { name: /log in|sign in/i })).toBeVisible()
    })

    test('signup page loads', async ({ page }) => {
      await page.goto('/signup')
      await expect(page.getByRole('heading', { name: /sign up|create account/i })).toBeVisible()
    })

    test('login redirects to home on success', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
      await expect(page).toHaveURL('/')
    })
  })

  test.describe('Protected Routes', () => {
    test('library requires authentication', async ({ page }) => {
      await page.goto('/library')
      await expect(page).toHaveURL(/\/login/)
    })

    test('checkout requires authentication', async ({ page }) => {
      await page.goto('/checkout/test-id')
      await expect(page).toHaveURL(/\/login/)
    })

    test('dashboard requires seller role', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
      await page.goto('/dashboard')
      // Buyer should be redirected
      const url = page.url()
      expect(url).not.toContain('/dashboard')
    })

    test('admin requires admin role', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
      await page.goto('/admin')
      await expect(page).toHaveURL('/agents')
    })
  })

  test.describe('User Library', () => {
    test.beforeEach(async ({ helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
    })

    test('library page loads for authenticated user', async ({ page }) => {
      await page.goto('/library')
      await expect(page).toHaveURL('/library')
    })

    test('library shows purchased agents or empty state', async ({ page }) => {
      await page.goto('/library')
      // Should show either purchases or empty state
      const hasContent = await page
        .getByText(/My Library|Purchased|No purchases|You haven't/i)
        .isVisible()
      expect(hasContent).toBeTruthy()
    })
  })

  test.describe('Navigation', () => {
    test('navigation shows correct links for guest', async ({ page }) => {
      await page.goto('/')

      await expect(page.getByRole('link', { name: /Browse|Agents/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /Log in|Sign in/i })).toBeVisible()
    })

    test('navigation shows correct links for buyer', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
      await page.goto('/')

      // Open user menu
      await page.click('[data-testid="user-menu"]').catch(() => {
        return page.click('button:has([class*="avatar"])')
      })

      await expect(page.getByText('My Library')).toBeVisible()
      await expect(page.getByText('Become a Seller')).toBeVisible()
    })

    test('navigation shows correct links for seller', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
      await page.goto('/')

      // Open user menu
      await page.click('[data-testid="user-menu"]').catch(() => {
        return page.click('button:has([class*="avatar"])')
      })

      await expect(page.getByText('My Library')).toBeVisible()
      await expect(page.getByText('Seller Dashboard')).toBeVisible()
    })

    test('navigation shows correct links for admin', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await page.goto('/')

      // Open user menu
      await page.click('[data-testid="user-menu"]').catch(() => {
        return page.click('button:has([class*="avatar"])')
      })

      await expect(page.getByText('Admin Panel')).toBeVisible()
    })
  })

  test.describe('Legal Pages', () => {
    test('terms page loads', async ({ page }) => {
      await page.goto('/terms')
      await expect(page.getByRole('heading', { name: /Terms/i })).toBeVisible()
    })

    test('refund policy page loads', async ({ page }) => {
      await page.goto('/refund-policy')
      await expect(page.getByRole('heading', { name: /Refund/i })).toBeVisible()
    })
  })
})

test.describe('Complete User Journeys', () => {
  test.describe('Buyer Journey', () => {
    test('buyer can browse and view agent details', async ({ page }) => {
      // Browse marketplace
      await page.goto('/agents')
      await expect(page).toHaveURL('/agents')

      // Click on an agent if available
      const agentLinks = page.locator('a[href^="/agents/"]')
      if ((await agentLinks.count()) > 0) {
        await agentLinks.first().click()
        await expect(page).toHaveURL(/\/agents\/[\w-]+/)

        // Agent detail page should show key information
        await expect(page.getByText(/Buy|Purchase|\$/)).toBeVisible()
      }
    })

    test('buyer journey: browse -> login -> library', async ({ page, helpers }) => {
      // Start as guest browsing
      await page.goto('/agents')

      // Try to access library - should redirect to login
      await page.goto('/library')
      await expect(page).toHaveURL(/\/login/)

      // Login
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)

      // Now should be able to access library
      await page.goto('/library')
      await expect(page).toHaveURL('/library')
    })
  })

  test.describe('Seller Journey', () => {
    test('seller can submit and manage agents', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)

      // Access dashboard
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/dashboard')

      // Can navigate to submit agent
      await page.goto('/submit-agent')
      await expect(page).toHaveURL('/submit-agent')
      await expect(page.getByRole('heading', { name: 'Submit New Agent' })).toBeVisible()
    })
  })

  test.describe('Admin Journey', () => {
    test('admin can review agents and applications', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)

      // Access admin dashboard
      await page.goto('/admin')
      await expect(page).toHaveURL('/admin')
      await expect(page.getByText('Platform Analytics')).toBeVisible()

      // Access seller applications
      await page.goto('/admin/seller-applications')
      await expect(page).toHaveURL('/admin/seller-applications')
      await expect(page.getByRole('heading', { name: 'Seller Applications' })).toBeVisible()
    })
  })
})

test.describe('Complete Seller Application Flow', () => {
  // This is a full integration test of the seller application flow
  test.skip('full flow: buyer applies -> admin reviews -> buyer becomes seller', async ({
    page,
    helpers,
  }) => {
    const uniqueEmail = `e2e-test-${Date.now()}@example.com`

    // Note: This test would require:
    // 1. Creating a new user or using a fresh test user
    // 2. Submitting seller application
    // 3. Admin approving
    // 4. Verifying role change

    // Step 1: Create new buyer account
    await page.goto('/signup')
    await page.fill('input[name="name"]', 'E2E Test User')
    await page.fill('input[type="email"]', uniqueEmail)
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')

    // Step 2: Submit seller application
    await page.goto('/become-seller')
    await page.getByLabel(/Full Name/).fill('E2E Test Applicant')
    await page
      .getByLabel(/Background & Experience/)
      .fill(
        'I have extensive experience in AI and automation. I have built multiple successful projects.'
      )
    await page
      .getByLabel(/Agent Ideas/)
      .fill('I want to create agents for customer support, lead generation, and data analysis.')
    await page.getByRole('button', { name: 'Submit Application' }).click()

    await expect(page).toHaveURL('/become-seller/success')

    // Step 3: Admin reviews and approves
    await helpers.logout()
    await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    await page.goto('/admin/seller-applications')

    const applicationCard = page.locator('[class*="rounded"]').filter({
      hasText: 'E2E Test Applicant',
    })
    await applicationCard.getByRole('button', { name: 'Approve' }).click()

    // Step 4: Verify user is now a seller
    await helpers.logout()
    await helpers.login(uniqueEmail, 'TestPassword123!')

    // Should now be able to access seller dashboard
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')

    // Should be able to submit agents
    await page.goto('/submit-agent')
    await expect(page).toHaveURL('/submit-agent')
  })
})
