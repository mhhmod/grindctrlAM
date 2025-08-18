# Overview

This is a modern full-stack e-commerce application built with React, Express, and TypeScript. The application serves as a single-product marketplace focused on selling a luxury cropped black t-shirt. It features a clean, minimal design with a complete order processing system that integrates with external webhooks for order fulfillment.

The application follows a monorepo structure with shared TypeScript schemas and implements a modern tech stack including shadcn/ui components, Tailwind CSS for styling, and Drizzle ORM for database operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL for cloud hosting
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **API Design**: RESTful API with consistent JSON responses and error handling

## Database Design
The schema includes three main entities:
- **Users**: Authentication and user management
- **Products**: Product catalog with image URLs and pricing
- **Orders**: Order processing with customer details and webhook tracking

All schemas are defined using Drizzle ORM with Zod validation schemas for runtime type checking.

## Development Architecture
- **Build System**: Vite for frontend bundling and esbuild for backend compilation
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Development Tools**: Hot module replacement, runtime error overlays, and Replit integration
- **Code Organization**: Monorepo structure with separate client, server, and shared directories

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connectivity
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **@tanstack/react-query**: Server state management and caching
- **express**: Web application framework for Node.js
- **wouter**: Minimal routing library for React

### UI and Styling
- **@radix-ui/react-***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating type-safe CSS variants
- **lucide-react**: Icon library for consistent iconography

### Development and Build Tools
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution engine for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development tools

### Validation and Forms
- **zod**: Schema validation library
- **react-hook-form**: Performant forms with validation
- **@hookform/resolvers**: Zod resolver for React Hook Form

### Webhook Integration
- **External Webhook Service**: n8n or similar automation platform for order processing
- **Webhook Configuration**: Environment variable driven webhook URLs for order notifications

The application is designed to be deployed on Replit with automatic environment provisioning and includes production-ready features like error boundaries, loading states, and comprehensive form validation.