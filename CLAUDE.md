# CLAUDE.md

Personal budget management app - track expenses, manage budgets, and get AI-powered financial insights.

## Tech Stack

- React 19 + TypeScript
- TanStack Router (file-based routing with code-splitting)
- TanStack Query (server state / data fetching)
- Vite + Tailwind CSS v4
- Clerk (authentication) + Supabase (database + RLS)
- Vitest (testing)

## Commands

```bash
npm run dev          # Dev server on port 3000
npm run build        # Production build (vite build && tsc)
npm run test         # Run tests with Vitest
npm run check        # Fix all lint/format issues (prettier --write . && eslint --fix)
```

## Project Structure

```
src/
  main.tsx                    # Entry point - provider tree (Clerk > Supabase > Query > Theme)
  Router.tsx                  # TanStack Router setup
  routes/
    __root.tsx                # Root layout with devtools
    _public.tsx               # Public layout (landing page)
    _app.tsx                  # Auth-protected layout (sidebar + toolbar)
    _app/
      dashboard/              # Dashboard route with summary grid, budget overview, recent activity
      expenses/               # Expense tracking with filters, forms, CRUD
      budget/                 # Budget management with category cards and summary
      ia-insights/            # AI-powered spending insights (planned)
      goal-tracker/           # Financial goal tracking (planned)
      profile/                # User profile settings
    auth/
      sign-in.tsx             # Clerk sign-in
      sign-up.tsx             # Clerk sign-up
  components/
    ui/                       # Base UI primitives (shadcn/radix-based)
    common/                   # App-wide components (Header, SearchInput, ThemeToggle)
    shared/                   # Reusable business components (ExpenseItem, StatCard, BudgetCategoryCard)
    features/home/            # Landing page feature sections
  hooks/
    auth/                     # use-auth-query, use-auth-mutation (Supabase + Clerk wrappers)
    categories/               # CRUD hooks for categories
    transactions/             # CRUD hooks for transactions
    use-budget.ts             # Budget data hook
    use-theme.ts              # Theme toggle hook
    use-user-setting.ts       # User preferences
  services/                   # Supabase API layer (transactions, categories, budget, profiles, accounts)
  contexts/                   # React contexts (Auth, Supabase, QueryClient, Theme)
  lib/                        # Utilities (format, colors, error handling, validations)
  config/navigation.ts        # Sidebar navigation items
  types/                      # Shared types + Supabase generated types
```

## Architecture Patterns

### Provider Tree (main.tsx)

`ClerkProvider > SupabaseProvider > TanstackQueryClientProvider > UserSync > ThemeProvider > AppRouter`

### Route Layouts

- `_public` - unauthenticated routes (landing page)
- `_app` - authenticated routes, redirects to sign-in if not logged in. Renders sidebar + toolbar layout
- Route-specific components live in `-components/` and hooks in `-hooks/` folders colocated with the route

### Data Flow

1. **Services** (`src/services/`) - raw Supabase calls, each service owns one table/RPC
2. **Auth hooks** (`src/hooks/auth/`) - `useAuthQuery` and `useAuthMutation` wrap TanStack Query with Supabase client injection
3. **Domain hooks** (`src/hooks/categories/`, `src/hooks/transactions/`) - use auth hooks for CRUD with optimistic updates
4. **Route components** - consume domain hooks, colocate route-specific UI in `-components/`

### Styling

- Tailwind CSS v4 via Vite plugin
- Path alias `@/` maps to `./src/`
- shadcn/ui components in `src/components/ui/`

## Docker

```bash
docker compose up       # Run dev server in container
```

- `Dockerfile` - Node 22 Alpine, pnpm, dev server on port 3000
- `docker-compose.yml` - service config with port mapping and volume mounts

## Additional Docs

Detailed references are in `.claude/`:

- `clerk-supabase-integration.md` - Auth + DB integration patterns, RLS policies, common errors
- `supabase.md` - Supabase setup notes
- `PRD.md` / `DATABASE_PRD.md` / `SUPABASE_DATABASE_PRD.md` - Product and database requirements
