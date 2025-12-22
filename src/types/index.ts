import { User, Agent, Purchase, Category, SellerProfile, SupportRequest, Review } from '@prisma/client'

// Extended types with relations
export type AgentWithRelations = Agent & {
  seller: User & {
    sellerProfile?: SellerProfile | null
  }
  category: Category
  reviews?: Review[]
  _count?: {
    purchases: number
    reviews: number
  }
}

export type PurchaseWithRelations = Purchase & {
  agent: Agent
  buyer: User
}

export type SupportRequestWithRelations = SupportRequest & {
  purchase: Purchase
  agent: Agent
  buyer: User
  seller: User
  assignedTo?: User | null
}

export type UserWithProfile = User & {
  sellerProfile?: SellerProfile | null
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  name: string
  role: 'BUYER' | 'SELLER'
}

export interface AgentSubmissionForm {
  title: string
  categoryId: string
  shortDescription: string
  workflowOverview: string
  useCase: string
  price: number
  supportAddonPrice: number
  demoVideoUrl?: string
  thumbnailUrl?: string
  setupGuide: string
  workflowDetails?: any
}

export interface CheckoutForm {
  agentId: string
  supportAddon: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter types
export interface AgentFilters {
  categoryId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  status?: string
  featured?: boolean
  page?: number
  limit?: number
}

export interface DashboardStats {
  totalAgents?: number
  totalSales?: number
  totalRevenue?: number
  pendingReviews?: number
  viewCount?: number
  purchaseCount?: number
}
