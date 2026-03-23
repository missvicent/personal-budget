# Remove ElectricSQL Sync Layer — Design Spec

## Problem

ElectricSQL connects directly to the Supabase dev database without a hub to mask the connection, exposing credentials and creating security vulnerabilities. The real-time sync must be removed while preserving the debt-calculator feature and TanStack DB usage.

## Decision

Replace ElectricSQL sync backend with TanStack Query (Approach B). TanStack Query owns server state fetching/caching via the existing 3-tier pattern. TanStack DB collections remain as the client-side query layer. This matches every other feature in the app.

## Scope

### What Gets Removed

- `@tanstack/electric-db-collection` package dependency
- `electricCollectionOptions` usage in `src/lib/tanstack-db.ts`
- `VITE_ELECTRIC_URL` env var and Electric URL config in `DebtDBProvider`
- `docker-compose.yml` electric service
- `useLiveQuery` imports in route-colocated `use-debts.ts` and `use-debt-payments.ts`
- `CREATE PUBLICATION electric_debt_pub` from migration file
- Route-colocated `use-debt-mutations.ts` (replaced by domain hooks)
- `SUPABASE_DB_URL` from `.env.local`
- ElectricSQL references from `README.md`

### What Stays

- `@tanstack/db`, `@tanstack/react-db`, `@electric-sql/client` dependencies (for future re-enablement)
- TanStack DB collections (debts, debtPayments) with schemas
- `DebtDBProvider` context (rewired to hydrate from TanStack Query)
- All debt-calculator components (unchanged)
- `debt.service.ts` (already handles all Supabase calls)
- `debts` and `debt_payments` tables and RLS policies

## Architecture

### Data Flow (Before)

```
ElectricSQL shape sync --> TanStack DB collections --> useLiveQuery --> components
Supabase (mutations) <-- debt.service <-- use-debt-mutations (manual useState)
```

### Data Flow (After)

```
Supabase --> debt.service --> useAuthQuery --> DebtDBProvider syncs into collection --> @tanstack/react-db useQuery --> components
Supabase <-- debt.service <-- useAuthMutation (with optimistic updates + cache invalidation)
```

### New Domain Hooks (`src/hooks/debt/`)

Following the existing 3-tier pattern used by budgets, transactions, and categories:

| File                     | Purpose                                                       |
| ------------------------ | ------------------------------------------------------------- |
| `use-debt-query-keys.ts` | Query key factory for `debts` and `debt_payments`             |
| `use-debts.ts`           | `useAuthQuery` wrapping `debtService.getAll()`                |
| `use-debt-payments.ts`   | `useAuthQuery` wrapping `debtService.getPayments()`           |
| `use-create-debt.ts`     | `useAuthMutation` with optimistic update + cache invalidation |
| `use-update-debt.ts`     | `useAuthMutation` with optimistic update + cache invalidation |
| `use-delete-debt.ts`     | `useAuthMutation` with optimistic update + cache invalidation |
| `use-record-payment.ts`  | `useAuthMutation` wrapping `debtService.recordPayment()`      |

### Service Addition

Add `getPayments(debtId?: string)` to `debt.service.ts` (currently only `recordPayment` exists for payments).

### TanStack DB Collection Changes (`src/lib/tanstack-db.ts`)

- Remove `electricCollectionOptions` import
- Remove `electricUrl` parameter from `createDebtCollections`
- Collections created with plain options: `id`, `schema`, `getKey` (no sync backend)
- Schemas unchanged

### DebtDBProvider Changes (`use-debt-db.tsx`)

- Remove `VITE_ELECTRIC_URL`
- Collections hydrated via `useEffect` that syncs TanStack Query data into them on fetch
- Pattern: domain hook fetches from Supabase -> data pushed into collection -> components read from collection
- After mutations: `useAuthMutation` invalidates query keys -> refetch -> collection re-synced

### Component Read Path

- Components still import from collections via `useDebtDB()`
- Replace `useLiveQuery` with `useQuery` from `@tanstack/react-db` for client-side filtering
- No component logic changes needed

## Documentation

Before any code is removed, create `docs/electric-sql-setup.md` containing:

- Full ElectricSQL architecture explanation
- Code snapshots of all removed/modified files
- Docker compose electric service config
- Environment variables (`VITE_ELECTRIC_URL`, `SUPABASE_DB_URL`)
- Migration publication SQL
- Step-by-step re-enablement guide

## Cleanup Checklist

- [ ] Write `docs/electric-sql-setup.md` (before any removals)
- [ ] Remove `@tanstack/electric-db-collection` from `package.json`
- [ ] Rewrite `src/lib/tanstack-db.ts` (plain collection options)
- [ ] Add `getPayments()` to `debt.service.ts`
- [ ] Create domain hooks in `src/hooks/debt/`
- [ ] Rewrite `DebtDBProvider` (hydrate from TanStack Query)
- [ ] Update route-colocated hooks to use domain hooks
- [ ] Remove route-colocated `use-debt-mutations.ts`, `use-debts.ts`, `use-debt-payments.ts`
- [ ] Update `debt-calculator/index.tsx` to use new hooks
- [ ] Remove `CREATE PUBLICATION` from migration
- [ ] Remove electric service from `docker-compose.yml`
- [ ] Clean env vars from `.env.local`
- [ ] Update `README.md`
- [ ] Run `npm run build` and `npm run test` to verify
