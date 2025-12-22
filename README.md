# AI Agent Marketplace

A curated marketplace where AI Engineers can list ready-to-use AI agent workflows, and buyers can discover, purchase, and unlock step-by-step setup guides with optional tech support.

## Features

- **Buyer Features**: Browse agents by category, purchase workflows, access setup guides
- **Seller Features**: Submit agents for review, manage portfolio, track analytics
- **Admin Features**: Review and moderate agent submissions, manage platform
- **Payment Integration**: Stripe checkout with support add-ons
- **Authentication**: Role-based access control (Buyer, Seller, Admin)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works great!)
- Stripe account (optional for MVP testing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd RainesDev\(AI-Agent\)
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase database:

**📘 Follow the detailed guide: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

Quick steps:
- Create a Supabase project at [supabase.com](https://supabase.com)
- Copy your database connection strings
- Create `.env` file: `cp .env.example .env`
- Add your Supabase credentials to `.env`
- Generate a NextAuth secret: `openssl rand -base64 32`

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials (After Seeding)

- **Admin**: admin@aimarketplace.com / admin123
- **Seller**: seller@example.com / seller123
- **Buyer**: buyer@example.com / buyer123

**Important**: Change these passwords in production!

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboards
│   ├── admin/             # Admin panel
│   └── seller/            # Seller dashboard
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   ├── agent/            # Agent-related components
│   ├── purchase/         # Purchase flow components
│   ├── seller/           # Seller components
│   ├── admin/            # Admin components
│   └── shared/           # Shared components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth configuration
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
├── hooks/                 # Custom React hooks
└── middleware.ts          # Next.js middleware

prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Database seed script
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database

## Documentation

- [Development Plan](DEVELOPMENT_PLAN.md) - Comprehensive development roadmap
- [Component Architecture](COMPONENT_ARCHITECTURE.md) - Component structure and patterns
- [One-Pager](One-Pager.txt) - Product requirements document

## Development Workflow

1. Review the [Development Plan](DEVELOPMENT_PLAN.md) for implementation phases
2. Check [Component Architecture](COMPONENT_ARCHITECTURE.md) for component guidelines
3. Create feature branches from `develop`
4. Follow the naming conventions and coding standards
5. Write tests for new features
6. Submit pull requests for review

## Database Schema

The application uses the following main models:
- **User**: Multi-role users (Buyer, Seller, Admin)
- **Agent**: AI agent listings with locked content
- **Purchase**: Transaction records
- **Category**: Agent categories
- **SellerProfile**: Extended seller information
- **SupportRequest**: Tech support tickets
- **Review**: Agent reviews and ratings
- **AdminLog**: Audit trail for admin actions

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema.

## Environment Variables

Required environment variables (see [.env.example](.env.example)):

```bash
DATABASE_URL=              # PostgreSQL connection string
NEXTAUTH_URL=             # Application URL
NEXTAUTH_SECRET=          # Auth secret key
STRIPE_SECRET_KEY=        # Stripe secret key
STRIPE_PUBLISHABLE_KEY=   # Stripe public key
STRIPE_WEBHOOK_SECRET=    # Stripe webhook secret
AWS_ACCESS_KEY_ID=        # AWS credentials
AWS_SECRET_ACCESS_KEY=    # AWS secret
AWS_BUCKET_NAME=          # S3 bucket name
RESEND_API_KEY=           # Email service API key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For questions or support, please contact the development team.
