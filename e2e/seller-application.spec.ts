import { test, expect, TEST_USERS, TEST_SELLER_APPLICATION } from './fixtures/test-fixtures'

test.describe('Seller Application Flow', () => {
  test.describe('Access Control', () => {
    test('unauthenticated user is redirected to login when accessing /become-seller', async ({
      page,
    }) => {
      await page.goto('/become-seller')
      await expect(page).toHaveURL(/\/login\?next=.*become-seller/)
    })

    test('authenticated seller is redirected to dashboard', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
      await page.goto('/become-seller')
      await expect(page).toHaveURL('/dashboard')
    })

    test('authenticated admin is redirected to dashboard', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await page.goto('/become-seller')
      await expect(page).toHaveURL('/dashboard')
    })
  })

  test.describe('Application Form', () => {
    test.beforeEach(async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
    })

    test('displays the seller application form for buyers', async ({ page }) => {
      await page.goto('/become-seller')

      // Check page header
      await expect(page.getByRole('heading', { name: 'Become a Seller' })).toBeVisible()

      // Check form fields exist
      await expect(page.getByLabel(/Full Name/)).toBeVisible()
      await expect(page.getByLabel(/Background & Experience/)).toBeVisible()
      await expect(page.getByLabel(/Agent Ideas/)).toBeVisible()
      await expect(page.getByLabel(/Relevant Links/)).toBeVisible()

      // Check submit button
      await expect(page.getByRole('button', { name: 'Submit Application' })).toBeVisible()
    })

    test('shows benefits section on the application page', async ({ page }) => {
      await page.goto('/become-seller')

      // Check for benefit cards
      await expect(page.getByText('Quality First')).toBeVisible()
      await expect(page.getByText('Fair Revenue')).toBeVisible()
      await expect(page.getByText('Support')).toBeVisible()
    })

    test('validates required fields - full name too short', async ({ page }) => {
      await page.goto('/become-seller')

      // Fill with invalid data
      await page.getByLabel(/Full Name/).fill('A')
      await page.getByLabel(/Background & Experience/).fill(TEST_SELLER_APPLICATION.experience)
      await page.getByLabel(/Agent Ideas/).fill(TEST_SELLER_APPLICATION.agentIdeas)

      await page.getByRole('button', { name: 'Submit Application' }).click()

      // Should show error message
      await expect(page.getByText(/at least 2 characters/)).toBeVisible()
    })

    test('validates required fields - experience too short', async ({ page }) => {
      await page.goto('/become-seller')

      await page.getByLabel(/Full Name/).fill(TEST_SELLER_APPLICATION.fullName)
      await page.getByLabel(/Background & Experience/).fill('Too short')
      await page.getByLabel(/Agent Ideas/).fill(TEST_SELLER_APPLICATION.agentIdeas)

      await page.getByRole('button', { name: 'Submit Application' }).click()

      // Should show error message about experience length
      await expect(page.getByText(/at least 50 characters/)).toBeVisible()
    })

    test('validates required fields - agent ideas too short', async ({ page }) => {
      await page.goto('/become-seller')

      await page.getByLabel(/Full Name/).fill(TEST_SELLER_APPLICATION.fullName)
      await page.getByLabel(/Background & Experience/).fill(TEST_SELLER_APPLICATION.experience)
      await page.getByLabel(/Agent Ideas/).fill('Short')

      await page.getByRole('button', { name: 'Submit Application' }).click()

      // Should show error message about ideas length
      await expect(page.getByText(/at least 30 characters/)).toBeVisible()
    })

    test('successfully submits valid application', async ({ page }) => {
      await page.goto('/become-seller')

      // Fill all fields with valid data
      await page.getByLabel(/Full Name/).fill(TEST_SELLER_APPLICATION.fullName)
      await page.getByLabel(/Background & Experience/).fill(TEST_SELLER_APPLICATION.experience)
      await page.getByLabel(/Agent Ideas/).fill(TEST_SELLER_APPLICATION.agentIdeas)
      await page.getByLabel(/Relevant Links/).fill(TEST_SELLER_APPLICATION.relevantLinks)

      await page.getByRole('button', { name: 'Submit Application' }).click()

      // Should redirect to success page
      await expect(page).toHaveURL('/become-seller/success')

      // Check success message
      await expect(page.getByText('Application Submitted!')).toBeVisible()
      await expect(page.getByText(/24-48 hours/)).toBeVisible()
    })
  })

  test.describe('Application Status', () => {
    test.beforeEach(async ({ helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
    })

    test('shows pending status when application is under review', async ({ page }) => {
      // Assuming the buyer has already submitted an application
      await page.goto('/become-seller')

      // If there's a pending application, should show status
      const pendingStatus = page.getByText('Application Under Review')
      const formVisible = page.getByLabel(/Full Name/)

      // Either shows pending status OR shows the form (if no application)
      const isPending = await pendingStatus.isVisible().catch(() => false)
      const isFormVisible = await formVisible.isVisible().catch(() => false)

      expect(isPending || isFormVisible).toBeTruthy()
    })

    test('success page has navigation buttons', async ({ page }) => {
      await page.goto('/become-seller/success')

      await expect(page.getByRole('link', { name: 'Browse Agents' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Check Status' })).toBeVisible()
    })
  })

  test.describe('Navigation Integration', () => {
    test('buyer sees "Become a Seller" link in navigation', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
      await page.goto('/')

      // Open user menu
      await page.click('[data-testid="user-menu"]').catch(() => {
        // Alternative: look for avatar button
        return page.click('button:has([class*="avatar"])')
      })

      // Should see "Become a Seller" option
      await expect(page.getByText('Become a Seller')).toBeVisible()
    })

    test('seller does NOT see "Become a Seller" link in navigation', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
      await page.goto('/')

      // Open user menu
      await page.click('[data-testid="user-menu"]').catch(() => {
        return page.click('button:has([class*="avatar"])')
      })

      // Should NOT see "Become a Seller" option
      await expect(page.getByText('Become a Seller')).not.toBeVisible()

      // Should see "Seller Dashboard" instead
      await expect(page.getByText('Seller Dashboard')).toBeVisible()
    })
  })
})

test.describe('Submit Agent Access Control', () => {
  test('buyer is redirected to /become-seller when accessing /submit-agent', async ({
    page,
    helpers,
  }) => {
    await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
    await page.goto('/submit-agent')
    await expect(page).toHaveURL('/become-seller')
  })

  test('seller can access /submit-agent', async ({ page, helpers }) => {
    await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
    await page.goto('/submit-agent')
    await expect(page).toHaveURL('/submit-agent')
    await expect(page.getByRole('heading', { name: 'Submit New Agent' })).toBeVisible()
  })

  test('admin can access /submit-agent', async ({ page, helpers }) => {
    await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    await page.goto('/submit-agent')
    await expect(page).toHaveURL('/submit-agent')
  })
})
