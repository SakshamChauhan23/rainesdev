# Component Architecture Documentation

## Overview
This document outlines the component structure, design patterns, and organization for the AI Agent Marketplace application.

---

## Design System & UI Components

### Base Components (shadcn/ui based)
Located in: `src/components/ui/`

These are reusable, unstyled components that form the foundation of the UI:

```
ui/
├── button.tsx              # Button variants (primary, secondary, outline, ghost)
├── input.tsx               # Text input, email, password fields
├── textarea.tsx            # Multi-line text input
├── select.tsx              # Dropdown select component
├── dialog.tsx              # Modal dialogs
├── dropdown-menu.tsx       # Dropdown menus for actions
├── toast.tsx               # Toast notifications
├── card.tsx                # Card container
├── badge.tsx               # Status badges
├── avatar.tsx              # User avatars
├── tabs.tsx                # Tab navigation
├── label.tsx               # Form labels
├── skeleton.tsx            # Loading skeletons
└── alert.tsx               # Alert messages
```

---

## Feature Components

### 1. Layout Components
Located in: `src/components/layout/`

```typescript
// Header.tsx
interface HeaderProps {
  user?: User | null
}
// Features: Logo, navigation, user menu, search bar

// Footer.tsx
// Features: Links, social media, copyright

// Sidebar.tsx (for dashboards)
interface SidebarProps {
  role: 'buyer' | 'seller' | 'admin'
  activeItem?: string
}

// Container.tsx
interface ContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}
```

---

### 2. Agent Components
Located in: `src/components/agent/`

```typescript
// AgentCard.tsx
interface AgentCardProps {
  agent: {
    id: string
    title: string
    shortDescription: string
    price: number
    thumbnailUrl?: string
    seller: {
      name: string
      avatarUrl?: string
    }
    category: {
      name: string
    }
  }
  onClick?: () => void
}
// Used in: Browse page, Category pages, Seller portfolios

// AgentGrid.tsx
interface AgentGridProps {
  agents: Agent[]
  loading?: boolean
  emptyMessage?: string
}

// AgentDetailHero.tsx
interface AgentDetailHeroProps {
  agent: Agent
  onPurchaseClick: () => void
  isPurchased?: boolean
}

// SetupGuideDisplay.tsx
interface SetupGuideDisplayProps {
  setupGuide: string
  workflowDetails?: any
  agentTitle: string
}
// Only shown to buyers who purchased

// AgentStatusBadge.tsx
interface AgentStatusBadgeProps {
  status: AgentStatus
}
```

---

### 3. Purchase & Checkout Components
Located in: `src/components/purchase/`

```typescript
// CheckoutForm.tsx
interface CheckoutFormProps {
  agent: Agent
  onSuccess: (purchaseId: string) => void
  onCancel: () => void
}
// Features: Price display, support add-on toggle, Stripe payment

// SupportAddonToggle.tsx
interface SupportAddonToggleProps {
  price: number
  checked: boolean
  onChange: (checked: boolean) => void
}

// PriceBreakdown.tsx
interface PriceBreakdownProps {
  basePrice: number
  supportAddon?: number
  total: number
}

// PurchaseConfirmation.tsx
interface PurchaseConfirmationProps {
  purchase: Purchase
  agent: Agent
  onViewSetupGuide: () => void
}
```

---

### 4. Seller Components
Located in: `src/components/seller/`

```typescript
// AgentSubmissionForm.tsx
interface AgentSubmissionFormProps {
  agentId?: string // For editing
  onSubmitSuccess: () => void
}
// Features: Rich text editor, video URL input, file upload, pricing

// SellerDashboardStats.tsx
interface SellerDashboardStatsProps {
  stats: {
    totalAgents: number
    totalSales: number
    totalRevenue: number
    pendingReviews: number
  }
}

// AgentAnalytics.tsx
interface AgentAnalyticsProps {
  agentId: string
  viewCount: number
  purchaseCount: number
  conversionRate: number
}

// PortfolioPreview.tsx
interface PortfolioPreviewProps {
  seller: SellerProfile
  agents: Agent[]
}
```

---

### 5. Admin Components
Located in: `src/components/admin/`

```typescript
// AgentReviewCard.tsx
interface AgentReviewCardProps {
  agent: Agent
  onApprove: (agentId: string) => void
  onReject: (agentId: string, reason: string) => void
}

// AdminSidebar.tsx
// Navigation for admin panel sections

// StatsOverview.tsx
interface StatsOverviewProps {
  stats: {
    totalUsers: number
    pendingAgents: number
    totalRevenue: number
    activeSupportRequests: number
  }
}

// UserManagementTable.tsx
interface UserManagementTableProps {
  users: User[]
  onBanUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

// CategoryManager.tsx
// CRUD operations for categories

// SupportRequestQueue.tsx
interface SupportRequestQueueProps {
  requests: SupportRequest[]
  onAssign: (requestId: string, adminId: string) => void
  onResolve: (requestId: string) => void
}
```

---

### 6. Dashboard Components
Located in: `src/components/dashboard/`

```typescript
// BuyerLibrary.tsx
interface BuyerLibraryProps {
  purchases: Purchase[]
}
// Displays purchased agents with access to setup guides

// SellerAgentList.tsx
interface SellerAgentListProps {
  agents: Agent[]
  onEdit: (agentId: string) => void
  onDelete: (agentId: string) => void
}

// DashboardCard.tsx
interface DashboardCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}
```

---

### 7. Form Components
Located in: `src/components/forms/`

```typescript
// MarkdownEditor.tsx
interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// ImageUpload.tsx
interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  accept?: string
  maxSize?: number
}

// VideoUrlInput.tsx
interface VideoUrlInputProps {
  value: string
  onChange: (url: string) => void
  onValidate?: (url: string) => boolean
}

// FormField.tsx (wrapper for react-hook-form)
interface FormFieldProps {
  name: string
  label: string
  error?: string
  children: React.ReactNode
}
```

---

### 8. Shared Components
Located in: `src/components/shared/`

```typescript
// SearchBar.tsx
interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  filters?: Filter[]
}

// Pagination.tsx
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

// LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

// ConfirmDialog.tsx
interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'destructive'
}

// VideoPlayer.tsx
interface VideoPlayerProps {
  url: string
  thumbnail?: string
  autoplay?: boolean
}
```

---

## Component Patterns

### 1. Container/Presenter Pattern

```typescript
// Container component (handles logic)
export function AgentListContainer() {
  const { data, loading, error } = useAgents()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return <AgentListPresenter agents={data} />
}

// Presenter component (pure UI)
interface AgentListPresenterProps {
  agents: Agent[]
}

export function AgentListPresenter({ agents }: AgentListPresenterProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  )
}
```

---

### 2. Compound Components Pattern

```typescript
// Used for complex components with multiple sub-components
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>
}

Card.Header = function CardHeader({ children }) {
  return <div className="card-header">{children}</div>
}

Card.Body = function CardBody({ children }) {
  return <div className="card-body">{children}</div>
}

Card.Footer = function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>
}

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

---

### 3. Render Props Pattern

```typescript
interface DataFetcherProps<T> {
  url: string
  children: (data: T, loading: boolean, error?: Error) => React.ReactNode
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const { data, loading, error } = useFetch<T>(url)
  return <>{children(data, loading, error)}</>
}

// Usage
<DataFetcher<Agent[]> url="/api/agents">
  {(agents, loading, error) => (
    loading ? <LoadingSpinner /> : <AgentGrid agents={agents} />
  )}
</DataFetcher>
```

---

## State Management

### Context Providers
Located in: `src/contexts/`

```typescript
// AuthContext.tsx
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

// CartContext.tsx (for checkout flow)
interface CartContextType {
  selectedAgent: Agent | null
  supportAddon: boolean
  setSelectedAgent: (agent: Agent) => void
  toggleSupportAddon: () => void
  clearCart: () => void
}

// ToastContext.tsx
interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}
```

---

### Custom Hooks
Located in: `src/hooks/`

```typescript
// useAgent.ts
export function useAgent(agentId: string) {
  // Fetch single agent with SWR or React Query
}

// useAgents.ts
export function useAgents(filters?: AgentFilters) {
  // Fetch agents list with pagination
}

// usePurchase.ts
export function usePurchase(agentId: string) {
  // Check if user has purchased this agent
}

// useAuth.ts
export function useAuth() {
  // Access auth context
}

// useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T

// useInfiniteScroll.ts
export function useInfiniteScroll(callback: () => void)
```

---

## Component Organization Best Practices

### 1. File Structure
```
components/
├── ui/                 # Base design system components
├── layout/            # Layout wrappers
├── agent/             # Agent-specific components
├── purchase/          # Purchase/checkout flow
├── seller/            # Seller dashboard & tools
├── admin/             # Admin panel components
├── dashboard/         # Dashboard shared components
├── forms/             # Form-related components
└── shared/            # Shared utilities
```

### 2. Component File Template
```typescript
// Import dependencies
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Import types
import type { Agent } from '@/types'

// Component interface
interface AgentCardProps {
  agent: Agent
  onClick?: () => void
  className?: string
}

// Component implementation
export function AgentCard({ agent, onClick, className }: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn('agent-card', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Component content */}
    </div>
  )
}
```

### 3. Naming Conventions
- **Components**: PascalCase (e.g., `AgentCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAgent.ts`)
- **Utils**: camelCase (e.g., `formatPrice.ts`)
- **Types**: PascalCase (e.g., `Agent`, `Purchase`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### 4. Props Best Practices
```typescript
// ✅ Good: Explicit, typed props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

// ❌ Avoid: Any or unclear props
interface ButtonProps {
  [key: string]: any
}
```

### 5. Composition over Props
```typescript
// ✅ Good: Composable
<Card>
  <Card.Header>
    <h2>Title</h2>
  </Card.Header>
  <Card.Body>
    <p>Content</p>
  </Card.Body>
</Card>

// ❌ Avoid: Too many props
<Card
  title="Title"
  content="Content"
  showHeader={true}
  headerClassName="..."
  bodyClassName="..."
/>
```

---

## Testing Strategy

### Component Tests
```typescript
// AgentCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { AgentCard } from './AgentCard'

describe('AgentCard', () => {
  const mockAgent = {
    id: '1',
    title: 'Test Agent',
    price: 99.99,
    // ... other required fields
  }

  it('renders agent information correctly', () => {
    render(<AgentCard agent={mockAgent} />)
    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<AgentCard agent={mockAgent} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('article'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## Accessibility Guidelines

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add aria-labels where needed
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus Management**: Manage focus for modals and dynamic content
5. **Color Contrast**: Maintain WCAG AA standards

```typescript
// Example: Accessible button
<button
  type="button"
  aria-label="Purchase agent"
  className="btn-primary"
  disabled={isPurchasing}
  onClick={handlePurchase}
>
  {isPurchasing ? 'Processing...' : 'Purchase Now'}
</button>
```

---

## Performance Optimization

### 1. Code Splitting
```typescript
// Lazy load heavy components
const AdminPanel = dynamic(() => import('@/components/admin/AdminPanel'), {
  loading: () => <LoadingSpinner />,
})
```

### 2. Memoization
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateComplexValue(data)
}, [data])

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### 3. Virtualization
```typescript
// Use virtual scrolling for long lists
import { VirtualScroll } from '@/components/shared/VirtualScroll'

<VirtualScroll items={agents} itemHeight={200}>
  {(agent) => <AgentCard agent={agent} />}
</VirtualScroll>
```

---

## Next Steps

1. Implement base UI components from shadcn/ui
2. Build layout components (Header, Footer, Container)
3. Create agent-related components
4. Implement form components with validation
5. Build dashboard components for each user role
6. Add accessibility features
7. Write component tests
8. Optimize performance

---

**Document Version**: 1.0
**Last Updated**: 2025-12-19
