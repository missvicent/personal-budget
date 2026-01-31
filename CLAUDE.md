# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal budget management application built with:

- React 19 with TypeScript
- TanStack Router for file-based routing
- Vite as build tool with Tailwind CSS v4
- Vitest for testing
- Google OAuth integration

## Essential Commands

```bash
# Development
npm run dev          # Start dev server on port 3000
npm run start        # Alias for dev

# Build & Preview
npm run build        # Build for production (vite build && tsc)
npm run serve        # Preview production build

# Testing
npm run test         # Run tests with Vitest

# Code Quality
npm run lint         # Run ESLint
npm run format       # Check formatting with Prettier
npm run check        # Fix all issues (prettier --write . && eslint --fix)
```

## Architecture & Structure

### Routing System

- File-based routing using TanStack Router with auto code-splitting enabled
- Routes defined in `src/routes/` directory
- `__root.tsx` provides the layout wrapper with Header component and dev tools
- Route tree is auto-generated in `src/routeTree.gen.ts`
- Router configuration in `src/main.tsx`:
  - Intent-based preloading
  - Scroll restoration enabled
  - Structural sharing for optimal performance

### Component Structure

- Layout components: `src/routes/__root.tsx` wraps all routes
- Shared components in `src/components/` (Header, Login, etc.)
- Route-specific components in their respective route files

### Styling

- Tailwind CSS v4 configured via Vite plugin
- Global styles in `src/styles.css`
- Path alias `@/` maps to `./src/` directory

### Type Safety

- Strict TypeScript configuration with no emit
- TanStack Router provides full type safety for routes
- Router instance registered for type inference

## Development Guidelines

### Route Creation

- Add new `.tsx` files to `src/routes/` for automatic route generation
- Use `createRoute` or `createFileRoute` from TanStack Router
- Nested routes use directory structure (e.g., `auth/sign-in.tsx`)

### State Management

- Consider TanStack Store or React Query for state management (see README for setup)
- Router context available for sharing data across routes

### Data Fetching

- Use route loaders for prefetching data before rendering
- TanStack Query integration available for complex data requirements

### Testing

- Vitest configured with jsdom environment
- Global test utilities available
- Place tests alongside components or in dedicated test files

## Important Configuration Files

- `vite.config.ts`: Build configuration with TanStack Router plugin
- `tsconfig.json`: TypeScript settings with bundler module resolution
- `eslint.config.js`: Uses TanStack's ESLint configuration
- `package.json`: Scripts and dependencies

## Authentication

- Clerk for user authentication (`@clerk/clerk-react`)
- Supabase for database with Row Level Security (RLS)
- Auth routes under `src/routes/auth/`

### Clerk + Supabase Integration

This project uses Clerk for authentication and Supabase for the database. Key points:

#### User IDs

- Clerk user IDs are strings like `user_33IZQVpXj8DAGKJyec47RxZanBE`
- NOT UUIDs - all `user_id` columns must be TEXT type, not UUID

#### Supabase Client Setup

- Located in `src/lib/supabaseClient.ts`
- Uses Clerk JWT token via `getToken({ template: 'supabase' })`
- Hook: `src/hooks/use-supabase.ts`

#### RLS Policies

When creating Row Level Security policies, use JWT claims (NOT `auth.uid()`):

```sql
-- ✅ Correct for Clerk
CREATE POLICY "Users can manage own data"
ON your_table
FOR ALL
USING ((auth.jwt()->>'sub') = user_id)
WITH CHECK ((auth.jwt()->>'sub') = user_id);

-- ❌ Wrong - auth.uid() is for Supabase Auth only
USING (auth.uid() = user_id)
```

#### Auto-set user_id on Insert

Add a default to automatically set user_id from JWT:

```sql
ALTER TABLE your_table
ALTER COLUMN user_id SET DEFAULT (auth.jwt()->>'sub');
```

#### Common Errors

| Error                                  | Cause                              | Fix                         |
| -------------------------------------- | ---------------------------------- | --------------------------- |
| `invalid input syntax for type uuid`   | Column is UUID, Clerk ID is string | Change column to TEXT       |
| `operator does not exist: text = uuid` | Type mismatch in RLS policy        | Change column type first    |
| `violates row-level security policy`   | user_id not set or wrong           | Add default or pass user_id |
