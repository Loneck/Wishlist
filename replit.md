# Gift List Application

## Overview

This is a full-stack gift wishlist application built with a React frontend and Express backend. The app allows users to create and manage a personal gift wishlist with two main views: an admin interface for managing gifts and a public view for others to browse and reserve gifts. The application features a modern UI built with shadcn/ui components and uses PostgreSQL with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database Layer**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful API with JSON responses
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error handling middleware

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless connection
- **ORM**: Drizzle ORM with migration support
- **Schema Management**: Type-safe database schema definitions in shared folder
- **Backup Storage**: In-memory storage implementation for development/testing

### Database Schema
- **Gifts Table**: Stores gift information (id, name, description, quantity, price, created_at)
- **Reservations Table**: Tracks who reserved which gifts and quantities
- **Relationships**: One-to-many relationship between gifts and reservations with cascade delete

### Authentication and Authorization
- Currently no authentication system implemented
- Application relies on trust-based reservation system where users provide their names
- Admin and public views are client-side only distinctions

### API Structure
- **GET /api/gifts**: Retrieve all gifts with reservation details
- **POST /api/gifts**: Create new gift (admin functionality)
- **PUT /api/gifts/:id**: Update existing gift (admin functionality)
- **DELETE /api/gifts/:id**: Remove gift (admin functionality)
- **POST /api/reservations**: Create gift reservation (public functionality)

### Development Workflow
- **Build System**: Vite for frontend, esbuild for backend production builds
- **Development Server**: Hot module replacement with Vite dev server
- **Database Migrations**: Drizzle Kit for schema migrations
- **Type Safety**: Shared TypeScript types between frontend and backend

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: @neondatabase/serverless driver for database connectivity

### UI and Styling
- **shadcn/ui**: Pre-built accessible UI components
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Font Awesome**: Additional icon library via CDN

### Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type checking and compilation
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast JavaScript bundler for production builds

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema parsing

### Utility Libraries
- **date-fns**: Date manipulation utilities
- **clsx & class-variance-authority**: Conditional CSS class management
- **nanoid**: URL-safe unique ID generation