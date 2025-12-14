# Horeq - E-Commerce Platform

## Overview

Horeq is a full-stack e-commerce platform built with React frontend and Express backend. It provides online shopping functionality with features like product browsing, shopping cart, user authentication, order management, and affiliate marketing capabilities. The platform supports multiple user roles including customers, admins, and affiliates.

## Recent Updates (December 2024)

- **Navbar Redesign**: Single-line navigation with Shop, Combo Deals, Flash Deals and integrated search
- **60+ Categories**: Expanded category catalog with auto-scrolling animation on homepage
- **New Shop Page**: Full-featured product listing with filters, sorting, grid/list view, pagination
- **Enhanced Profile**: Complete user profile with 7 sections (Info, Orders, Addresses, Payments, Tracking, Affiliate, Settings)
- **Affiliate Dashboard**: Full affiliate system with stats, earnings, referral tracking, and payout management
- **Delivery Tracking**: Visual order tracking with step-by-step progress

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for UI animations
- **UI Components**: Radix UI primitives wrapped with custom styling

### Backend Architecture
- **Framework**: Express.js running on Node.js
- **Language**: TypeScript with ESM modules
- **Authentication**: Passport.js with local strategy, session-based auth using express-session
- **Password Hashing**: bcrypt for secure password storage
- **API Design**: RESTful endpoints under `/api/` prefix

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Validation**: Drizzle-zod for schema validation and type inference
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Migrations**: Drizzle Kit for database migrations (output to `./migrations`)

### Data Models
- Users (with roles: customer, admin, affiliate)
- Products (with categories, pricing, inventory tracking)
- Categories (with slugs, colors, icons)
- Orders and Order Items
- Cart Items
- Reviews
- Wishlist
- Affiliates

### Build System
- **Development**: Vite dev server with HMR on port 5000
- **Production Build**: Custom build script using esbuild for server and Vite for client
- **Output**: Server bundles to `dist/index.cjs`, client to `dist/public`

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components (layout, ui)
│   │   ├── pages/       # Route page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and mock data
├── server/           # Backend Express application
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations interface
│   ├── auth.ts       # Passport authentication setup
│   └── db.ts         # Drizzle database connection
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migration files
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- Session table created automatically by connect-pg-simple

### Third-Party Services
- **Google Fonts**: Outfit and Inter font families loaded via CDN

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tooling
- `passport` / `passport-local`: Authentication framework
- `express-session` / `connect-pg-simple`: Session management with PostgreSQL backing
- `@tanstack/react-query`: Async state management
- `recharts`: Charts for dashboard analytics
- `framer-motion`: Animation library
- `wouter`: Lightweight routing

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption (defaults to dev key if not set)