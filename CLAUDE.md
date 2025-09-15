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
- Google OAuth integration via `@react-oauth/google`
- Auth routes under `src/routes/auth/`