# Overview

ThinkLab is a comprehensive SaaS platform that enables users to create, manage, and collaborate on AI-powered projects. The platform provides a complete suite of AI tools including text generation, image creation, code generation, and data analysis, alongside project management features like Kanban boards and real-time collaboration. It includes a marketplace for AI templates and tools, with a credit-based usage system and tiered subscription plans ranging from free trials to enterprise solutions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in a Single Page Application (SPA) architecture
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider supporting light/dark modes with CSS variables
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture with centralized route registration
- **Middleware**: Custom logging, error handling, and authentication middleware
- **File Structure**: Modular organization with separate concerns for routes, services, and storage

## Authentication & Authorization
- **Primary Auth**: Replit OpenID Connect (OIDC) integration with Passport.js
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Role-Based Access**: Three-tier system (user, admin, manager) with route-level protection
- **Security Features**: Built-in support for 2FA, email/phone verification, and GDPR compliance

## Data Storage
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Design**: Comprehensive schema covering users, projects, tasks, AI usage tracking, marketplace items, and notifications
- **Connection Management**: Connection pooling with @neondatabase/serverless

## AI Services Integration
- **Primary Provider**: OpenAI API integration (GPT-4o model)
- **Services**: Text generation, image generation (DALL-E 3), and code generation
- **Architecture**: Modular AI service layer allowing for easy provider swapping
- **Usage Tracking**: Credit-based system with detailed usage analytics

## Project Management
- **Features**: Kanban boards, task management, project categorization
- **Collaboration**: Real-time features for team plans
- **File Management**: Project-based file storage and organization
- **Status Tracking**: Multi-state project workflow (draft, active, completed, archived)

## Subscription & Payment System
- **Plans**: Five-tier system (Free Trial, Starter $5/month, Pro $15/month, Team $25/month, Enterprise)
- **Payment Integration**: Stripe for payment processing with webhook support
- **Credit System**: Usage-based credits with automatic renewal for paid plans
- **Billing**: Support for both monthly and yearly billing cycles

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OIDC authentication service
- **Session Storage**: PostgreSQL-backed session management

## AI & ML Services
- **OpenAI API**: Primary AI service provider for text, image, and code generation
- **Model Access**: GPT-4o for text/code generation, DALL-E 3 for image generation

## Payment Processing
- **Stripe**: Payment processing, subscription management, and webhook handling
- **PayPal**: Alternative payment method (configured but not fully implemented)

## Development & Deployment
- **Vite**: Frontend build tool and development server
- **Replit**: Development environment with integrated cartographer plugin
- **TypeScript**: Type checking and compilation across frontend and backend

## UI & Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix + Tailwind

## Communication & Notifications
- **Email**: SMTP/SendGrid integration for user communications
- **SMS**: Twilio integration for phone verification and 2FA
- **Real-time**: WebSocket support for collaborative features