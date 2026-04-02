# Personal Budget

Personal budget management app - track expenses, manage budgets, and get AI-powered financial insights.

## Features

- **Dashboard** - Overview of your financial status with visual analytics
- **Expense Tracking** - Log and categorize your expenses and income
- **Budget Management** - Set monthly budgets by category with visual progress indicators
- **Debt Calculator** - Real-time debt tracking with ElectricSQL sync
- **Goal Tracker** - Set and monitor your financial goals (planned)
- **AI Insights** - Smart spending analysis and projections (planned)

## Tech Stack

- **Framework**: React 19 + TypeScript 5.7+
- **Routing**: TanStack Router (file-based routing with code-splitting)
- **Data Fetching**: TanStack Query
- **Real-time Sync**: ElectricSQL + TanStack DB
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui, Radix UI, Lucide Icons
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Authentication**: Clerk
- **Database**: Supabase (with RLS)
- **Testing**: Vitest + Testing Library

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_ELECTRIC_URL=http://localhost:3001  # optional, defaults to this
```

## Commands

```bash
npm run dev          # Dev server on port 3000
npm run build        # Production build (vite build && tsc)
npm run test         # Run tests with Vitest
npm run check        # Fix all lint/format issues (prettier --write . && eslint --fix)
npm run lint         # Run ESLint
npm run format       # Check formatting with Prettier
npm run serve        # Preview production build
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
      budget/                 # Budget management — includes dashboard, expenses, category allocations
      budget/-components/
        dashboard/            # Summary grid, budget overview, recent activity
        expense/              # Expense tracking with filters, forms, CRUD
        budget-card/          # Budget card components
        category-allocation/  # Category allocation grid and cards
      debt-calculator/        # Debt calculator with real-time sync (ElectricSQL)
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
docker compose up              # Run all services (app + electric)
docker compose up app          # Run only the app (port 3000)
docker compose up electric     # Run only ElectricSQL (port 3001)
docker compose logs electric   # Check ElectricSQL logs for errors
```

### Services

| Service    | Port | Description                                |
| ---------- | ---- | ------------------------------------------ |
| `app`      | 3000 | Vite dev server (Node 22 Alpine, pnpm)     |
| `electric` | 3001 | ElectricSQL sync engine for real-time data |

### ElectricSQL

The debt calculator (`/debt-calculator`) uses ElectricSQL + TanStack DB for real-time sync of `debts` and `debt_payments` tables. The Electric service requires:

- `SUPABASE_DB_URL` - direct Postgres connection string (set in `.env.local`)
- `ELECTRIC_INSECURE=true` - required for local dev (set in `docker-compose.yml`)

The app connects to Electric via `VITE_ELECTRIC_URL` (defaults to `http://localhost:3001`).

## Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) with [lint-staged](https://github.com/lint-staged/lint-staged) to ensure code quality before commits:

- **JS/TS files**: Prettier formatting + ESLint fixes
- **JSON/MD/HTML/CSS files**: Prettier formatting

## Additional Docs

Detailed references are in `.claude/`:

- `clerk-supabase-integration.md` - Auth + DB integration patterns, RLS policies, common errors
- `supabase.md` - Supabase setup notes
- `PRD.md` / `DATABASE_PRD.md` / `SUPABASE_DATABASE_PRD.md` - Product and database requirements

## License

MIT

POSTHOG
SENTRY
ray
