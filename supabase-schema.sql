-- AI Agent Marketplace Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('BUYER', 'SELLER', 'ADMIN');
CREATE TYPE agent_status AS ENUM ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED');
CREATE TYPE purchase_status AS ENUM ('PENDING', 'COMPLETED', 'REFUNDED');
CREATE TYPE support_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED');
CREATE TYPE admin_action AS ENUM ('APPROVE_AGENT', 'REJECT_AGENT', 'FEATURE_AGENT', 'DELETE_AGENT', 'BAN_USER', 'REFUND_PURCHASE', 'ASSIGN_SUPPORT', 'UPDATE_CATEGORY');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'BUYER' NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seller profiles table
CREATE TABLE seller_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    portfolio_url_slug VARCHAR(255) UNIQUE NOT NULL,
    social_links JSONB,
    verification_status verification_status DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    workflow_overview TEXT NOT NULL,
    use_case TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    support_addon_price DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    demo_video_url TEXT,
    thumbnail_url TEXT,
    status agent_status DEFAULT 'DRAFT' NOT NULL,
    rejection_reason TEXT,
    setup_guide TEXT NOT NULL,
    workflow_details JSONB,
    view_count INTEGER DEFAULT 0 NOT NULL,
    purchase_count INTEGER DEFAULT 0 NOT NULL,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    approved_at TIMESTAMPTZ
);

-- Purchases table
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID NOT NULL REFERENCES agents(id),
    amount_paid DECIMAL(10, 2) NOT NULL,
    support_addon_purchased BOOLEAN DEFAULT FALSE NOT NULL,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    status purchase_status DEFAULT 'PENDING' NOT NULL,
    purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Support requests table
CREATE TABLE support_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID NOT NULL REFERENCES purchases(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID NOT NULL REFERENCES agents(id),
    status support_status DEFAULT 'PENDING' NOT NULL,
    buyer_message TEXT,
    admin_notes TEXT,
    assigned_to_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    verified_purchase BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(agent_id, buyer_id)
);

-- Admin logs table
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action admin_action NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_agents_seller_id ON agents(seller_id);
CREATE INDEX idx_agents_category_id ON agents(category_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_featured ON agents(featured);
CREATE INDEX idx_agents_slug ON agents(slug);

CREATE INDEX idx_purchases_buyer_id ON purchases(buyer_id);
CREATE INDEX idx_purchases_agent_id ON purchases(agent_id);
CREATE INDEX idx_purchases_status ON purchases(status);

CREATE INDEX idx_support_requests_buyer_id ON support_requests(buyer_id);
CREATE INDEX idx_support_requests_seller_id ON support_requests(seller_id);
CREATE INDEX idx_support_requests_agent_id ON support_requests(agent_id);
CREATE INDEX idx_support_requests_status ON support_requests(status);

CREATE INDEX idx_reviews_agent_id ON reviews(agent_id);
CREATE INDEX idx_reviews_buyer_id ON reviews(buyer_id);

CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_entity ON admin_logs(entity_type, entity_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);

-- Insert initial categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Customer Support', 'customer-support', 'AI agents that automate customer service and support workflows', 1),
('Sales & Marketing', 'sales-marketing', 'Agents for lead generation, email campaigns, and sales automation', 2),
('Data Analysis', 'data-analysis', 'Intelligent agents for data processing, analysis, and reporting', 3),
('Content Creation', 'content-creation', 'AI-powered content writing, editing, and optimization agents', 4),
('Development Tools', 'development-tools', 'Coding assistants, code review, and development automation agents', 5),
('Productivity', 'productivity', 'Task automation, scheduling, and workflow optimization agents', 6);

-- Insert default admin user (password: admin123)
-- Note: You should change this password in production!
INSERT INTO users (email, password_hash, role, name) VALUES
('admin@aimarketplace.com', '$2a$10$rQJ5qXxGxvK9ZqZ5qXxGxuK9ZqZ5qXxGxvK9ZqZ5qXxGxvK9ZqZ5q', 'ADMIN', 'Admin User');

-- Insert default seller user (password: seller123)
INSERT INTO users (email, password_hash, role, name) VALUES
('seller@example.com', '$2a$10$rQJ5qXxGxvK9ZqZ5qXxGxuK9ZqZ5qXxGxvK9ZqZ5qXxGxvK9ZqZ5q', 'SELLER', 'John Seller');

-- Insert default buyer user (password: buyer123)
INSERT INTO users (email, password_hash, role, name) VALUES
('buyer@example.com', '$2a$10$rQJ5qXxGxvK9ZqZ5qXxGxuK9ZqZ5qXxGxvK9ZqZ5qXxGxvK9ZqZ5q', 'BUYER', 'Jane Buyer');

-- Create seller profile for the default seller
INSERT INTO seller_profiles (user_id, bio, portfolio_url_slug, verification_status)
SELECT id, 'AI Engineer with 5 years of experience building automation workflows', 'john-seller', 'VERIFIED'
FROM users WHERE email = 'seller@example.com';

-- Success message
SELECT 'Database schema created successfully!' AS message;
