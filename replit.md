# Horeq - E-Commerce Platform

## Overview

Horeq is a full-stack e-commerce platform built with React frontend and Express backend. It provides online shopping functionality with features like product browsing, shopping cart, user authentication, order management, and affiliate marketing capabilities. The platform supports multiple user roles including customers, admins, and affiliates.

## Recent Updates (December 2024)

### Vendor Dashboard Redesign - Complete Implementation
The vendor dashboard has been completely redesigned with a modern, responsive interface featuring:

**7-Tab Interface:**
1. **Overview** - Sales metrics, earnings tracking, store status, commission rates
2. **Products** - Advanced product management with image upload, pricing, stock, categories
3. **Combos** - Product bundle creation with multi-select and automatic pricing
4. **Affiliates** - Affiliate product management with per-product commission settings, status tracking
5. **Commissions** - Commission history, rates, transaction tracking
6. **Payment** - Balance display, payout requests, payment method configuration (Bank Transfer, PayPal, Stripe, Crypto)
7. **Settings** - Store customization, payment details, store statistics

**Advanced Features:**
- Drag-and-drop image upload with preview
- Combo bundle builder with multiple product selection and savings calculation
- Affiliate product management with commission type (percentage/fixed) per product
- Real-time commission tracking
- Payment method configuration
- Store settings with analytics
- Product sharing with copy-to-clipboard functionality
- Responsive design for desktop, tablet, and mobile

### Admin Dashboard - Vendor Management
Complete vendor management section added to Admin Dashboard:
- **Vendor Applications** - Review pending applications, approve/reject with custom commission rates
- **Vendor Stores** - View all active vendor stores, manage verification status, track sales and earnings
- Filtering by status (pending, approved, rejected)
- Real-time updates and notifications
- Commission rate configuration
- Vendor analytics and statistics

### Platform Features (Existing)
- **Vendor Marketplace System**: Multi-vendor support with branded storefronts
- **Brands System**: Brand management with logo, description, and product association
- **120 Categories**: Expanded category catalog
- **Product Listing**: 1000+ unique products with filters, sorting, pagination
- **Enhanced Checkout**: 3-step checkout with shipping options and coupon support
- **User Profile**: 7 sections (Info, Orders, Addresses, Payments, Tracking, Affiliate, Settings)
- **Affiliate Program**: Apply-to-join affiliate program with tier system
- **Delivery Tracking**: Visual order tracking with step-by-step progress

### Admin Dashboard Enhancements
- **Affiliate Tier System**: Manage tiers (Bronze, Silver, Gold, Platinum) with commission levels
- **Affiliate Analytics**: Performance charts for clicks, conversions, and earnings
- **Affiliate Payout Management**: Approval/rejection workflow
- **Product-Level Affiliate Settings**: Per-product commission controls
- **CMS Page Builder**: Drag-drop blocks (Hero, Features, Testimonials)
- **System Settings**: General, Payment, Email, and Shipping configuration
- **Roles & Permissions**: Role management with granular CRUD matrix
- **Reports Dashboard**: Sales, Products, Customers, and Traffic analytics with export options
- **Enhanced Coupons**: Full CRUD, search filters, affiliate support
- **Tools Section**: Import/export, activity log, reports, diagnostics

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for UI animations
- **UI Components**: Radix UI primitives wrapped with custom styling

### Backend Architecture
- **Framework**: Express.js running on Node.js
- **Language**: TypeScript with ESM modules
- **Authentication**: Passport.js with local strategy, session-based auth
- **Password Hashing**: bcrypt for secure password storage
- **API Design**: RESTful endpoints under `/api/` prefix

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Validation**: Drizzle-zod for schema validation and type inference
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Migrations**: Drizzle Kit for database migrations (output to `./migrations`)

### Data Models
- Users (with roles: customer, admin, affiliate, vendor)
- Products (with categories, pricing, inventory tracking, vendor/brand associations)
- Categories (with slugs, colors, icons)
- Brands (with logos, descriptions, websites)
- Vendor Stores (with commission rates, verification status, earnings tracking)
- Vendor Applications (approval workflow for new vendors)
- Orders and Order Items
- Cart Items
- Reviews
- Wishlist
- Affiliates
- Transactions (comprehensive financial tracking)
- Commission Ledger (affiliate commission history)
- Combos (product bundles)

### Build System
- **Development**: Vite dev server with HMR on port 5000
- **Production Build**: Custom build script using esbuild for server and Vite for client
- **Output**: Server bundles to `dist/index.cjs`, client to `dist/public`

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components (layout, ui)
│   │   ├── pages/       # Route page components (VendorDashboard, AdminDashboard, etc.)
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and helper functions
├── server/           # Backend Express application
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions (2600+ lines)
│   ├── storage.ts    # Database operations interface
│   ├── auth.ts       # Passport authentication setup
│   └── db.ts         # Drizzle database connection
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema (960 lines)
└── migrations/       # Database migration files
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- Session table created automatically by connect-pg-simple

### Third-Party Services
- **Google Fonts**: Outfit and Inter font families loaded via CDN
- **Stripe**: Payment processing integration (available for setup)

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tooling
- `passport` / `passport-local`: Authentication framework
- `express-session` / `connect-pg-simple`: Session management with PostgreSQL backing
- `@tanstack/react-query`: Async state management
- `recharts`: Charts for dashboard analytics
- `framer-motion`: Animation library
- `wouter`: Lightweight routing
- `shadcn/ui`: Component library
- `tailwindcss`: Utility-first CSS framework

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption (defaults to dev key if not set)

## Features Status

### ✅ Completed
- Vendor Dashboard with 7 tabs and full feature set
- Image upload for products
- Affiliate product management
- Combo bundle builder
- Payment and payout management
- Admin vendor management and approval workflow
- Database integration for all vendor operations
- Real-time data synchronization

### 🎯 Ready for Enhancement
- Advanced inventory tracking and stock alerts
- Order management from vendor perspective
- Customer reviews and ratings management
- Advanced sales analytics and reporting
- Bulk product operations
- Vendor performance analytics
- Custom commission rules per product

