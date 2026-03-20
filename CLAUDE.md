# CLAUDE.md

> Read this file at the start of every session. Defines rules, stack, and conventions.

## Project Overview

Personal budget app: expense tracking, budget management, debt calculator, and AI-powered financial insights. Built with React 19 + Supabase + Clerk auth.

## Tech Stack

| Layer          | Technology                                        |
| -------------- | ------------------------------------------------- |
| UI             | React 19, TypeScript 5.7+ (strict)                |
| Build          | Vite 6, Tailwind CSS v4 (Vite plugin)             |
| Routing        | TanStack Router (file-based, code-split)          |
| Server state   | TanStack Query                                    |
| Real-time sync | ElectricSQL + TanStack DB (debt-calculator route) |
| Auth           | Clerk                                             |
| Database       | Supabase + RLS                                    |
| Forms          | react-hook-form + zod + @hookform/resolvers       |
| Styling        | shadcn/ui, Radix UI, cva, clsx + tailwind-merge   |
| Testing        | Vitest + jsdom + Testing Library                  |

## Commands

```bash
npm run dev          # Dev server on port 3000
npm run build        # Production build (vite build && tsc)
npm run test         # Run tests with Vitest
npm run check        # Fix all lint/format issues (prettier --write . && eslint --fix)
```

## Project Architecture

### Provider Tree

`ClerkProvider > SupabaseProvider > QueryClientProvider > UserSync > ThemeProvider > Router`

### Route Layouts

- `_public` — unauthenticated (landing page)
- `_app` — auth-protected (sidebar + toolbar), redirects to sign-in if unauthenticated

### Colocated Route Pattern

Each route has `-components/` and `-hooks/` folders colocated alongside the route file.

### Data Flow (3-tier)

```text
Services (src/services/)        → raw Supabase calls, one service per table/RPC
Auth hooks (src/hooks/auth/)    → useAuthQuery / useAuthMutation wrap TanStack Query with Supabase client injection
Domain hooks (src/hooks/*)      → CRUD with cache invalidation and optimistic updates
Route components                → consume domain hooks
```

### ElectricSQL

Used only in the debt-calculator route for real-time sync of `debts` and `debt_payments` tables via TanStack DB.

## Code Style & Philosophy

- Functional components and hooks only — no classes
- Strict TypeScript — no `any`, use `unknown` + narrowing
- Early returns over nested conditionals
- Single responsibility per function/component
- Immutable data patterns (spread, map, filter — no mutation)
- SOLID principles at component/hook level

## Naming Conventions

| What       | Convention                                                     |
| ---------- | -------------------------------------------------------------- |
| Components | PascalCase (`BudgetCategoryCard`)                              |
| Functions  | camelCase (`formatCurrency`)                                   |
| Constants  | UPPER_SNAKE (`DEFAULT_CURRENCY`)                               |
| Types      | PascalCase, no `I` prefix (`Transaction`)                      |
| Files      | kebab-case (`budget-category-card.tsx`)                        |
| Hooks      | `use-` prefix kebab-case file, `use` prefix camelCase function |

## TypeScript Rules

- Strict mode always enabled
- Use `satisfies` for type-safe object literals
- Prefer discriminated unions for state variants
- `type` over `interface` unless extending
- Type-only imports: `import type { X } from '...'`
- Supabase generated types live in `src/types/database.types.ts` — never edit manually, regenerate with CLI
- Use `date-fns` or `Intl.DateTimeFormat` for date formatting

## React v19 Rules

- No `useEffect` for data fetching — use domain hooks (useAuthQuery)
- `use` hook for reading contexts and promises
- `useOptimistic` for immediate UI feedback
- Composition via `children` prop
- Trust React compiler — minimize manual `useMemo`/`useCallback`

## TanStack Router Rules

- Always use `createFileRoute` — no manual route registration
- No hardcoded route paths — use typed `Link` and `useNavigate`
- Auth guards via `beforeLoad`
- Colocate route-specific components in `-components/` and hooks in `-hooks/`

## Data Fetching Rules

- **Services** (`src/services/`) own raw Supabase calls, one file per table
- **`useAuthQuery` / `useAuthMutation`** inject the Supabase client automatically
- **Domain hooks** wrap auth hooks with cache invalidation and optimistic updates
- Never make manual API calls — always go through the 3-tier pattern
- Global error handling: QueryClient caches errors, surfaces via sonner toasts

## Form Rules

- react-hook-form + zod + `zodResolver`
- shadcn Form components: `FormField`, `FormControl`, `FormLabel`, `FormMessage`
- Dialog-based pattern with custom `useXDialog()` hooks
- Schema definitions and payload transformers in `src/lib/schemas/`

## Styling Rules

- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- `cn()` helper (clsx + tailwind-merge) for class merging
- `cva` (class-variance-authority) for component variants
- Dark mode via `dark:` prefix + ThemeContext
- Mobile-first responsive design
- No `@apply` — use utility classes directly
- shadcn/ui + Radix primitives for all UI components
- `@/` path alias maps to `./src/`

## Testing Rules

- Vitest + jsdom + React Testing Library
- Colocated in `__tests__/` directories
- Test accessibility and user behavior, not implementation details
- Schema validation tests for zod schemas
- Logic/utility function tests

## Security Rules

- No `dangerouslySetInnerHTML` without DOMPurify
- Clerk handles all auth tokens — never manage tokens manually
- Supabase RLS enforces row-level security — never bypass in client code

## Common Mistakes to Avoid

- No `any` — use `unknown` + type narrowing
- No `useEffect` for data fetching — use domain hooks
- No hardcoded route strings — use typed router utilities
- No `console.log` in committed code
- Use `date-fns` — not moment or dayjs for new code
- Never edit `src/types/database.types.ts` — regenerate with `supabase gen types`
- Always use `@/` path aliases — no relative `../../` imports
