// Database Types for Supabase
// These types match the schema in supabase-schema.sql

export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN'
export type AgentStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'
export type PurchaseStatus = 'PENDING' | 'COMPLETED' | 'REFUNDED'
export type SupportStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type VerificationStatus = 'PENDING' | 'VERIFIED'
export type AdminAction = 
  | 'APPROVE_AGENT' 
  | 'REJECT_AGENT' 
  | 'FEATURE_AGENT' 
  | 'DELETE_AGENT' 
  | 'BAN_USER' 
  | 'REFUND_PURCHASE' 
  | 'ASSIGN_SUPPORT' 
  | 'UPDATE_CATEGORY'

// Database Tables
export interface User {
  id: string
  email: string
  password_hash: string
  role: UserRole
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface SellerProfile {
  id: string
  user_id: string
  bio: string | null
  portfolio_url_slug: string
  social_links: Record<string, string> | null
  verification_status: VerificationStatus
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  seller_id: string
  category_id: string
  title: string
  slug: string
  short_description: string
  workflow_overview: string
  use_case: string
  price: number
  support_addon_price: number
  demo_video_url: string | null
  thumbnail_url: string | null
  status: AgentStatus
  rejection_reason: string | null
  setup_guide: string
  workflow_details: Record<string, unknown> | null
  view_count: number
  purchase_count: number
  featured: boolean
  created_at: string
  updated_at: string
  approved_at: string | null
}

export interface Purchase {
  id: string
  buyer_id: string
  agent_id: string
  amount_paid: number
  support_addon_purchased: boolean
  stripe_payment_intent_id: string | null
  status: PurchaseStatus
  purchased_at: string
  created_at: string
}

export interface SupportRequest {
  id: string
  purchase_id: string
  buyer_id: string
  seller_id: string
  agent_id: string
  status: SupportStatus
  buyer_message: string | null
  admin_notes: string | null
  assigned_to_id: string | null
  created_at: string
  resolved_at: string | null
  updated_at: string
}

export interface Review {
  id: string
  agent_id: string
  buyer_id: string
  rating: number
  comment: string | null
  verified_purchase: boolean
  created_at: string
  updated_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: AdminAction
  entity_type: string
  entity_id: string
  metadata: Record<string, unknown> | null
  created_at: string
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<User, 'id'>>
      }
      seller_profiles: {
        Row: SellerProfile
        Insert: Omit<SellerProfile, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<SellerProfile, 'id'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Category, 'id'>>
      }
      agents: {
        Row: Agent
        Insert: Omit<Agent, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'purchase_count'> & { id?: string }
        Update: Partial<Omit<Agent, 'id'>>
      }
      purchases: {
        Row: Purchase
        Insert: Omit<Purchase, 'id' | 'created_at' | 'purchased_at'> & { id?: string }
        Update: Partial<Omit<Purchase, 'id'>>
      }
      support_requests: {
        Row: SupportRequest
        Insert: Omit<SupportRequest, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<SupportRequest, 'id'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Review, 'id'>>
      }
      admin_logs: {
        Row: AdminLog
        Insert: Omit<AdminLog, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<AdminLog, 'id'>>
      }
    }
    Enums: {
      user_role: UserRole
      agent_status: AgentStatus
      purchase_status: PurchaseStatus
      support_status: SupportStatus
      verification_status: VerificationStatus
      admin_action: AdminAction
    }
  }
}
