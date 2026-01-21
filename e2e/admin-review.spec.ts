import { test, expect, TEST_USERS } from './fixtures/test-fixtures'

test.describe('Admin Seller Application Review', () => {
  test.describe('Access Control', () => {
    test('unauthenticated user is redirected to login', async ({ page }) => {
      await page.goto('/admin/seller-applications')
      await expect(page).toHaveURL(/\/login/)
    })

    test('buyer cannot access admin pages', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.buyer.email, TEST_USERS.buyer.password)
      await page.goto('/admin/seller-applications')
      // Should be redirected to agents/marketplace
      await expect(page).toHaveURL('/agents')
    })

    test('seller cannot access admin pages', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.seller.email, TEST_USERS.seller.password)
      await page.goto('/admin/seller-applications')
      await expect(page).toHaveURL('/agents')
    })

    test('admin can access seller applications page', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await page.goto('/admin/seller-applications')
      await expect(page).toHaveURL('/admin/seller-applications')
      await expect(page.getByRole('heading', { name: 'Seller Applications' })).toBeVisible()
    })
  })

  test.describe('Application Review Interface', () => {
    test.beforeEach(async ({ helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    })

    test('displays stats cards', async ({ page }) => {
      await page.goto('/admin/seller-applications')

      // Check for stat cards
      await expect(page.getByText('Pending Review')).toBeVisible()
      await expect(page.getByText('Approved')).toBeVisible()
      await expect(page.getByText('Rejected')).toBeVisible()
    })

    test('displays pending applications section', async ({ page }) => {
      await page.goto('/admin/seller-applications')

      await expect(page.getByRole('heading', { name: 'Pending Applications' })).toBeVisible()
    })

    test('displays recently reviewed section', async ({ page }) => {
      await page.goto('/admin/seller-applications')

      await expect(page.getByRole('heading', { name: 'Recently Reviewed' })).toBeVisible()
    })

    test('has back to admin link', async ({ page }) => {
      await page.goto('/admin/seller-applications')

      const backLink = page.getByRole('button', { name: /Back to Admin/ })
      await expect(backLink).toBeVisible()

      await backLink.click()
      await expect(page).toHaveURL('/admin')
    })

    test('shows application details for pending applications', async ({ page }) => {
      await page.goto('/admin/seller-applications')

      // If there are pending applications, check for expected content
      const pendingCard = page.locator('[class*="rounded-2xl"]').filter({
        hasText: 'Experience',
      })

      if ((await pendingCard.count()) > 0) {
        // Should show applicant details
        await expect(pendingCard.first().getByText('Experience')).toBeVisible()
        await expect(pendingCard.first().getByText('Agent Ideas')).toBeVisible()
      }
    })

    test('shows approve and reject buttons for pending applications', async ({ page }) => {
      await page.goto('/admin/seller-applications')

      const approveBtn = page.getByRole('button', { name: 'Approve' })
      const rejectBtn = page.getByRole('button', { name: 'Reject' })

      // If there are pending applications
      if ((await approveBtn.count()) > 0) {
        await expect(approveBtn.first()).toBeVisible()
        await expect(rejectBtn.first()).toBeVisible()
      }
    })
  })

  test.describe('Application Actions', () => {
    test.beforeEach(async ({ helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    })

    test('clicking reject opens rejection dialog', async ({ page }) => {
      await page.goto('/admin/seller-applications')

      const rejectBtn = page.getByRole('button', { name: 'Reject' })

      if ((await rejectBtn.count()) > 0) {
        await rejectBtn.first().click()

        // Dialog should appear
        await expect(page.getByRole('dialog')).toBeVisible()
        await expect(page.getByText('Reject Application')).toBeVisible()
        await expect(page.getByLabel('Rejection Reason')).toBeVisible()
      }
    })

    test('rejection requires minimum 10 characters', async ({ page }) => {
      await page.goto('/admin/seller-applications')

      const rejectBtn = page.getByRole('button', { name: 'Reject' })

      if ((await rejectBtn.count()) > 0) {
        await rejectBtn.first().click()

        // Fill short reason
        await page.getByLabel('Rejection Reason').fill('Too short')

        // Confirm button should be disabled
        const confirmBtn = page.getByRole('button', { name: 'Confirm Rejection' })
        await expect(confirmBtn).toBeDisabled()

        // Fill valid reason
        await page
          .getByLabel('Rejection Reason')
          .fill('This application does not meet our quality standards.')
        await expect(confirmBtn).toBeEnabled()
      }
    })

    test('can cancel rejection dialog', async ({ page }) => {
      await page.goto('/admin/seller-applications')

      const rejectBtn = page.getByRole('button', { name: 'Reject' })

      if ((await rejectBtn.count()) > 0) {
        await rejectBtn.first().click()

        // Click cancel
        await page.getByRole('button', { name: 'Cancel' }).click()

        // Dialog should close
        await expect(page.getByRole('dialog')).not.toBeVisible()
      }
    })
  })

  test.describe('Admin Dashboard Integration', () => {
    test.beforeEach(async ({ helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    })

    test('main admin dashboard shows seller application notification if pending', async ({
      page,
    }) => {
      await page.goto('/admin')

      // The dashboard shows a card if there are pending applications
      const sellerAppCard = page.getByText(/Seller Application.*Pending/)

      // Check if card exists (depends on test data)
      const cardExists = await sellerAppCard.isVisible().catch(() => false)

      if (cardExists) {
        // Should have "Review Now" button
        await expect(page.getByRole('button', { name: 'Review Now' })).toBeVisible()
      }
    })

    test('clicking review now navigates to seller applications', async ({ page }) => {
      await page.goto('/admin')

      const reviewNowBtn = page.getByRole('button', { name: 'Review Now' })
      const btnExists = await reviewNowBtn.isVisible().catch(() => false)

      if (btnExists) {
        await reviewNowBtn.click()
        await expect(page).toHaveURL('/admin/seller-applications')
      }
    })
  })
})

test.describe('Admin Agent Review', () => {
  test.describe('Access Control', () => {
    test('admin can access review queue', async ({ page, helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await page.goto('/admin')
      await expect(page.getByText('Pending Agent Reviews')).toBeVisible()
    })
  })

  test.describe('Review Queue', () => {
    test.beforeEach(async ({ helpers }) => {
      await helpers.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    })

    test('displays pending agents section', async ({ page }) => {
      await page.goto('/admin')
      await expect(page.getByText('Pending Agent Reviews')).toBeVisible()
    })

    test('displays recent actions section', async ({ page }) => {
      await page.goto('/admin')
      await expect(page.getByText('Recent Actions')).toBeVisible()
    })

    test('shows platform analytics', async ({ page }) => {
      await page.goto('/admin')

      await expect(page.getByText('Platform Analytics')).toBeVisible()
      await expect(page.getByText('Pending Review')).toBeVisible()
      await expect(page.getByText('Approved Agents')).toBeVisible()
      await expect(page.getByText('Total Purchases')).toBeVisible()
      await expect(page.getByText('Active Sellers')).toBeVisible()
    })
  })
})
