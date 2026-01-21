import { test as base, expect, Page } from '@playwright/test'

/**
 * Test user credentials - these should match test accounts in your database
 * For real E2E tests, you'll need to either:
 * 1. Use seeded test accounts
 * 2. Create accounts dynamically via API
 * 3. Mock authentication
 */
export const TEST_USERS = {
  buyer: {
    email: 'test-buyer@example.com',
    password: 'TestBuyer123!',
    name: 'Test Buyer',
  },
  seller: {
    email: 'test-seller@example.com',
    password: 'TestSeller123!',
    name: 'Test Seller',
  },
  admin: {
    email: 'admin@aimarketplace.com',
    password: 'Admin123!',
    name: 'Admin User',
  },
}

/**
 * Test data for seller application
 */
export const TEST_SELLER_APPLICATION = {
  fullName: 'John E2E Tester',
  experience:
    'I have 5 years of experience building AI automation workflows using tools like n8n, Make, and custom Python scripts. I have successfully deployed over 50 automation projects for various clients.',
  agentIdeas:
    'I plan to create agents for customer support automation, lead qualification, and content scheduling. My target audience is small to medium businesses looking to automate repetitive tasks.',
  relevantLinks: 'https://github.com/test-user\nhttps://linkedin.com/in/test-user',
}

/**
 * Test data for agent submission
 */
export const TEST_AGENT = {
  title: 'E2E Test Customer Support Bot',
  shortDescription: 'An AI-powered customer support bot for testing purposes',
  price: '49.99',
  workflowOverview:
    '# How It Works\n\n1. Receives customer queries\n2. Analyzes intent\n3. Provides responses',
  useCase: 'Best for SaaS companies looking to automate tier-1 support',
  setupGuide:
    '# Setup Instructions\n\n1. Install the agent\n2. Configure API keys\n3. Deploy to production',
}

/**
 * Helper class for common page interactions
 */
export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Login with email/password via Supabase Auth UI
   */
  async login(email: string, password: string) {
    await this.page.goto('/login')
    await this.page.waitForLoadState('networkidle')

    // Fill login form
    await this.page.fill('input[type="email"]', email)
    await this.page.fill('input[type="password"]', password)

    // Submit
    await this.page.click('button[type="submit"]')

    // Wait for redirect after successful login
    await this.page.waitForURL(url => !url.pathname.includes('/login'), {
      timeout: 10000,
    })
  }

  /**
   * Sign up a new user
   */
  async signup(email: string, password: string, name?: string) {
    await this.page.goto('/signup')
    await this.page.waitForLoadState('networkidle')

    if (name) {
      await this.page.fill('input[name="name"]', name)
    }
    await this.page.fill('input[type="email"]', email)
    await this.page.fill('input[type="password"]', password)

    await this.page.click('button[type="submit"]')

    // Wait for redirect or confirmation
    await this.page.waitForTimeout(2000)
  }

  /**
   * Logout the current user
   */
  async logout() {
    // Click user menu and logout
    await this.page.click('[data-testid="user-menu"]').catch(() => {
      // Try alternative selector
      return this.page.click('button:has-text("Sign out")')
    })
    await this.page.click('text=Sign out').catch(() => {})
    await this.page.waitForURL('/')
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="user-menu"]', { timeout: 3000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * Navigate and wait for page load
   */
  async navigateTo(path: string) {
    await this.page.goto(path)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Fill a form field by label
   */
  async fillByLabel(label: string, value: string) {
    await this.page.getByLabel(label).fill(value)
  }

  /**
   * Select an option from a dropdown by label
   */
  async selectByLabel(label: string, optionText: string) {
    await this.page.getByLabel(label).click()
    await this.page.getByRole('option', { name: optionText }).click()
  }

  /**
   * Wait for a toast message
   */
  async waitForToast(text: string) {
    await this.page.waitForSelector(`text=${text}`, { timeout: 5000 })
  }

  /**
   * Check if an element contains text
   */
  async hasText(selector: string, text: string): Promise<boolean> {
    const element = await this.page.$(selector)
    if (!element) return false
    const content = await element.textContent()
    return content?.includes(text) ?? false
  }
}

/**
 * Extended test fixture with helpers
 */
export const test = base.extend<{ helpers: TestHelpers }>({
  helpers: async ({ page }, use) => {
    const helpers = new TestHelpers(page)
    await use(helpers)
  },
})

export { expect }
