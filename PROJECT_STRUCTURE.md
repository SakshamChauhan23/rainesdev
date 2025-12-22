# Project Structure Overview

This document provides a visual overview of the complete project folder structure.

## Directory Tree

```
RainesDev(AI-Agent)/
├── .next/                          # Next.js build output (generated)
├── node_modules/                   # Dependencies (generated)
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   ├── seed.ts                    # Database seeding script
│   └── migrations/                # Database migrations (generated)
├── public/
│   ├── images/                    # Static images
│   ├── icons/                     # Icon assets
│   └── favicon.ico               # Favicon
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)/             # Public route group
│   │   │   ├── agents/
│   │   │   │   ├── page.tsx      # Browse all agents
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx  # Agent detail page
│   │   │   │   └── category/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx
│   │   │   ├── seller/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Public seller portfolio
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   ├── dashboard/             # User dashboards
│   │   │   ├── buyer/
│   │   │   │   ├── page.tsx      # Buyer dashboard
│   │   │   │   ├── library/
│   │   │   │   │   └── page.tsx  # Purchased agents
│   │   │   │   └── support/
│   │   │   │       └── page.tsx  # Support requests
│   │   │   ├── seller/
│   │   │   │   ├── page.tsx      # Seller dashboard
│   │   │   │   ├── agents/
│   │   │   │   │   ├── page.tsx  # My agents
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx
│   │   │   │   ├── analytics/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── admin/                 # Admin panel
│   │   │   ├── page.tsx          # Admin dashboard
│   │   │   ├── agents/
│   │   │   │   ├── page.tsx      # Review queue
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Review detail
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   ├── support/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── checkout/
│   │   │   └── [agentId]/
│   │   │       ├── page.tsx      # Checkout page
│   │   │       └── success/
│   │   │           └── page.tsx  # Success page
│   │   ├── api/                   # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── agents/
│   │   │   │   ├── route.ts      # GET, POST agents
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts  # GET, PATCH, DELETE agent
│   │   │   │   └── featured/
│   │   │   │       └── route.ts
│   │   │   ├── categories/
│   │   │   │   └── route.ts
│   │   │   ├── purchases/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── support/
│   │   │   │   └── route.ts
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts
│   │   │   ├── upload/
│   │   │   │   └── route.ts      # File upload endpoint
│   │   │   └── admin/
│   │   │       ├── agents/
│   │   │       │   ├── approve/
│   │   │       │   │   └── route.ts
│   │   │       │   └── reject/
│   │   │       │       └── route.ts
│   │   │       └── users/
│   │   │           └── route.ts
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Homepage
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── ui/                    # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── label.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── alert.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── container.tsx
│   │   ├── agent/
│   │   │   ├── agent-card.tsx
│   │   │   ├── agent-grid.tsx
│   │   │   ├── agent-detail-hero.tsx
│   │   │   ├── setup-guide-display.tsx
│   │   │   └── agent-status-badge.tsx
│   │   ├── purchase/
│   │   │   ├── checkout-form.tsx
│   │   │   ├── support-addon-toggle.tsx
│   │   │   ├── price-breakdown.tsx
│   │   │   └── purchase-confirmation.tsx
│   │   ├── seller/
│   │   │   ├── agent-submission-form.tsx
│   │   │   ├── seller-dashboard-stats.tsx
│   │   │   ├── agent-analytics.tsx
│   │   │   └── portfolio-preview.tsx
│   │   ├── admin/
│   │   │   ├── agent-review-card.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── stats-overview.tsx
│   │   │   ├── user-management-table.tsx
│   │   │   ├── category-manager.tsx
│   │   │   └── support-request-queue.tsx
│   │   ├── dashboard/
│   │   │   ├── buyer-library.tsx
│   │   │   ├── seller-agent-list.tsx
│   │   │   └── dashboard-card.tsx
│   │   ├── forms/
│   │   │   ├── markdown-editor.tsx
│   │   │   ├── image-upload.tsx
│   │   │   ├── video-url-input.tsx
│   │   │   └── form-field.tsx
│   │   └── shared/
│   │       ├── search-bar.tsx
│   │       ├── pagination.tsx
│   │       ├── empty-state.tsx
│   │       ├── loading-spinner.tsx
│   │       ├── confirm-dialog.tsx
│   │       └── video-player.tsx
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── utils.ts               # Utility functions
│   │   ├── stripe.ts              # Stripe client
│   │   ├── email.ts               # Email service
│   │   ├── upload.ts              # File upload helpers
│   │   └── validators.ts          # Zod schemas
│   ├── hooks/
│   │   ├── use-agent.ts
│   │   ├── use-agents.ts
│   │   ├── use-purchase.ts
│   │   ├── use-auth.ts
│   │   ├── use-debounce.ts
│   │   ├── use-infinite-scroll.ts
│   │   └── use-toast.ts
│   ├── contexts/
│   │   ├── auth-context.tsx
│   │   ├── cart-context.tsx
│   │   └── toast-context.tsx
│   ├── types/
│   │   ├── index.ts               # Shared types
│   │   ├── api.ts                 # API types
│   │   └── next-auth.d.ts         # NextAuth type extensions
│   └── middleware.ts               # Route protection
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Example environment variables
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── .prettierrc                     # Prettier configuration
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── README.md                       # Project documentation
├── DEVELOPMENT_PLAN.md             # Development roadmap
├── COMPONENT_ARCHITECTURE.md       # Component documentation
├── One-Pager.txt                   # Product requirements
└── PROJECT_STRUCTURE.md            # This file
```

## Key Directories Explained

### `/src/app`
Next.js 14 App Router directory. Contains all routes, layouts, and API endpoints.

### `/src/components`
Organized by feature and purpose:
- `ui/` - Reusable base components
- `layout/` - Layout wrappers
- `agent/`, `purchase/`, `seller/`, `admin/` - Feature-specific components
- `shared/` - Cross-feature shared components

### `/src/lib`
Utility functions, configurations, and service integrations.

### `/src/hooks`
Custom React hooks for data fetching and state management.

### `/src/types`
TypeScript type definitions and interfaces.

### `/prisma`
Database schema, migrations, and seed scripts.

## File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `agent-card.tsx`)
- **Pages**: `page.tsx` (App Router convention)
- **Layouts**: `layout.tsx` (App Router convention)
- **API Routes**: `route.ts` (App Router convention)
- **Hooks**: `use-*.ts` (e.g., `use-agent.ts`)
- **Utils**: `kebab-case.ts` (e.g., `format-price.ts`)
- **Types**: `kebab-case.ts` (e.g., `api-types.ts`)

## Route Groups

Next.js route groups (folders in parentheses) organize routes without affecting URLs:

- `(auth)/` - Authentication pages
- `(public)/` - Public-facing pages
- Routes outside groups are also public by default

## API Routes Organization

```
/api
├── /auth              # Authentication endpoints
├── /agents            # Agent CRUD operations
├── /categories        # Category management
├── /purchases         # Purchase operations
├── /support           # Support requests
├── /stripe            # Payment processing
├── /upload            # File uploads
└── /admin             # Admin-only operations
```

## Protected Routes

Routes protected by middleware (requires authentication):
- `/dashboard/*` - All user dashboards
- `/admin/*` - Admin panel (requires ADMIN role)
- `/seller/*` - Seller features (requires SELLER role)

## Static Assets

```
/public
├── /images            # Product images, logos
├── /icons             # Icon files
└── favicon.ico        # Site favicon
```

## Generated Directories

These are created during build/development:
- `.next/` - Next.js build output
- `node_modules/` - NPM dependencies
- `prisma/migrations/` - Database migrations

## Configuration Files

- `next.config.js` - Next.js settings
- `tailwind.config.ts` - Tailwind CSS theme
- `tsconfig.json` - TypeScript compiler options
- `.eslintrc.json` - Code linting rules
- `.prettierrc` - Code formatting rules
- `postcss.config.js` - PostCSS plugins

## Environment Files

- `.env` - Local environment variables (gitignored)
- `.env.example` - Template for environment variables

## Next Steps

1. Create remaining directory structure
2. Implement base UI components
3. Build API routes
4. Develop page components
5. Add authentication flows
6. Integrate payment system
7. Build admin panel
8. Add testing infrastructure

---

**Last Updated**: 2025-12-19
