# ToolbarMeta for Dynamic Routes — Implementation Guide

## Context

The `AppToolbar` currently derives its title from `pathname.split('/').pop()`, which shows a raw UUID for `/budget/$budgetId`. We need the toolbar to show the budget name, date range, and spent amount — while keeping it domain-agnostic via a `toolbarMeta` pattern that any dynamic route can use.

## Problem

When you navigate to `/budget/79397abf-3794-40ad-...`, the toolbar shows the UUID as the title. That's because `AppToolbar` does `pathname.split('/').pop()` and there's no entry in `NAVIGATION_ITEMS` for dynamic routes. We need a way for child routes to tell the toolbar what to display.

## What You'll Learn

1. **Route Context** — TanStack Router lets each route add data to a shared context object via `beforeLoad`. Parent routes define the shape, child routes extend it.
2. **`ensureQueryData`** — A function on `queryClient` that returns cached data if available, or fetches it if not. Unlike `useQuery` (a React hook), it works outside components — perfect for `beforeLoad`.
3. **`useMatches()`** — Returns all matched route segments for the current URL. Each match carries its context, so a parent component (toolbar) can read data set by a deeply nested child route.
4. **Domain-agnostic layouts** — The toolbar reads a generic `ToolbarMeta` type. It never imports anything budget-related. This follows the **Open-Closed Principle** (SOLID): open for extension (any route can provide toolbar data), closed for modification (no toolbar changes needed for new routes).

## Architecture: How Data Flows

```
                    Provider Tree (main.tsx)
                    ========================
                    ClerkProvider
                      └─ SupabaseProvider  ←── creates supabase client (needs Clerk's getToken)
                           └─ QueryClientProvider  ←── provides queryClient
                                └─ AppRouter  ←── sits inside BOTH providers
                                     │
                                     │  passes supabase + queryClient into router context
                                     ▼
                    Route Tree
                    ==========
                    __root.tsx  ←── defines RouterContext type
                      └─ _app.tsx  ←── uses context.auth for auth guard
                           ├─ AppToolbar  ←── reads toolbarMeta from useMatches()
                           └─ budget/
                                ├─ index.tsx  ←── budget list (uses useBudgetOverview hook)
                                └─ $budgetId.tsx  ←── beforeLoad:
                                                       1. ensureQueryData → gets cached overview
                                                       2. finds budget by ID
                                                       3. returns { toolbarMeta }
                                                       4. TanStack Router merges into context
                                                       5. AppToolbar reads it via useMatches()
```

### Why can't `beforeLoad` just use hooks?

`beforeLoad` runs **before** React renders the component. It's a plain async function, not a React component. So it can't call `useSupabase()`, `useQueryClient()`, or any hook. That's why we pass `supabase` and `queryClient` through the router context — `beforeLoad` receives context as a parameter.

### Why `ensureQueryData` instead of a direct Supabase call?

`ensureQueryData` checks the TanStack Query cache first. If the user navigated from `/budget` (which already fetched the overview via `useBudgetOverview`), the data is already cached under `['budgets', 'overview']`. No extra network request. If the user navigates directly to `/budget/$id` (cold load), it fetches, caches, and returns the data — so subsequent navigation to `/budget` is also instant.

### Why a singleton `queryClient`?

Currently `queryClient` is created inside `useState()` in `QueryClientContext.tsx`. That means it only exists inside React — you can't import it in `Router.tsx` to pass into the router context. Making it a module-level singleton lets both `QueryClientProvider` and `Router.tsx` reference the same instance.

For SSR apps, you need `queryClient` per-request to avoid sharing state between users. But this is a Vite SPA — one user, one browser tab, one `queryClient`. A singleton is correct and simpler.

## Existing Code You'll Reuse (no new files needed)

| What                                | File                                        | How it's used                                                                   |
| ----------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------- |
| `budgetService.getOverview`         | `src/services/budget.service.ts`            | RPC call to `get_budgets_overview`. Used in `beforeLoad` with `ensureQueryData` |
| Query key `['budgets', 'overview']` | `src/hooks/budget/use-budget-query-keys.ts` | Same key used by `useBudgetOverview` — shares cache automatically               |
| `formatDateRange`                   | `src/lib/dates/formatDate.ts`               | Formats start/end dates for toolbar description                                 |
| `parseISO`                          | `date-fns`                                  | Parses ISO date strings into Date objects                                       |
| `NAVIGATION_ITEMS`                  | `src/config/navigation.ts`                  | Fallback for static routes (dashboard, expenses, etc.)                          |
| `useSupabase`                       | `src/contexts/SupabaseContext.tsx`          | Gets supabase client inside `AppRouter` to pass to router context               |
| `createQueryClient`                 | `src/lib/queryClient.ts`                    | Factory function — we'll also export a singleton from here                      |

## Files to Change (6 files, 0 new files)

| #   | File                                         | What changes                                         | Why                                       |
| --- | -------------------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| 1   | `src/lib/queryClient.ts`                     | Add `export const queryClient = createQueryClient()` | Make queryClient importable outside React |
| 2   | `src/contexts/QueryClientContext.tsx`        | Import singleton, remove `useState`                  | Use the shared instance                   |
| 3   | `src/routes/__root.tsx`                      | Add `ToolbarMeta` type + extend `RouterContext`      | Define the contract for toolbar data      |
| 4   | `src/Router.tsx`                             | Pass `supabase` + `queryClient` into context         | Make them available in `beforeLoad`       |
| 5   | `src/routes/_app/budget/$budgetId.tsx`       | Add `beforeLoad` with `ensureQueryData`              | Fetch budget data, return `toolbarMeta`   |
| 6   | `src/routes/_app/-components/AppToolbar.tsx` | Use `useMatches()`, remove `console.log`             | Read `toolbarMeta` from child routes      |

---

## Step-by-step Implementation

### Step 1: Export queryClient as a singleton

**WHY:** Currently `queryClient` is created inside `useState(createQueryClient)` in `QueryClientContext.tsx`. This means it only exists inside the React component tree. We need it importable as a plain module export so `Router.tsx` can pass it into the router context.

**File: `src/lib/queryClient.ts`**

Current state:

```ts
export const createQueryClient = (): QueryClient => {
  return new QueryClient({ ... })
}
```

Add one line at the bottom:

```ts
export const queryClient = createQueryClient()
```

**File: `src/contexts/QueryClientContext.tsx`**

Current state:

```ts
const [queryClient] = useState(createQueryClient)
```

Change to:

```ts
import { queryClient } from '@/lib/queryClient'

export const TanstackQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

**What changed:** Removed `useState` — the singleton is created at module load time. `QueryClientProvider` still wraps children, so `useQueryClient()` still works everywhere in the app.

**VERIFY:** `npm run build` — should pass. Run the app — everything works as before.

---

### Step 2: Define ToolbarMeta type and extend RouterContext

**WHY:** `beforeLoad` receives `context` as a parameter, typed by `RouterContext`. Currently it only has `auth`. We need to add `supabase` and `queryClient` so dynamic routes can fetch data. We also define `ToolbarMeta` — the generic shape that any route can return.

**File: `src/routes/__root.tsx`**

Add these imports at the top:

```ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { QueryClient } from '@tanstack/react-query'
```

Export the `ToolbarMeta` type (other files will import it):

```ts
export type ToolbarMeta = {
  title: string
  description?: string
  balance?: {
    label: string
    value: string
  }
}
```

Extend the existing `RouterContext`:

```ts
interface RouterContext {
  auth: {
    isLoaded: boolean
    isSignedIn: boolean
    userId: string | null | undefined
  }
  supabase: SupabaseClient
  queryClient: QueryClient
}
```

**Design decisions:**

- `ToolbarMeta` is **exported** because `$budgetId.tsx` imports it to type the return value
- `balance` uses `{ label, value }` strings — formatting happens in the route, not the toolbar
- The type is **generic** — `title` could be a budget name, expense category, or debt name
- `description` and `balance` are optional — not all routes need them

**VERIFY:** `npm run build` — will fail with errors in `Router.tsx` because context now requires `supabase` and `queryClient`. That's expected — Step 3 fixes it.

---

### Step 3: Pass supabase + queryClient into the router

**WHY:** Look at your provider tree in `main.tsx`:

```
ClerkProvider > SupabaseProvider > QueryClientProvider > ... > AppRouter
```

`AppRouter` sits inside both providers. So it can call `useSupabase()` and import `queryClient`, then pass both into `RouterProvider`'s context. This makes them available to every route's `beforeLoad`.

**File: `src/Router.tsx`**

Add imports:

```ts
import { useSupabase } from '@/contexts/SupabaseContext'
import { queryClient } from '@/lib/queryClient'
```

Update `createRouter` initial context — the `undefined!` values are **non-null assertions**. TanStack Router requires initial values at creation time, but they get replaced by the real values when `RouterProvider` renders:

```ts
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    supabase: undefined!, // ← add
    queryClient: undefined!, // ← add
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})
```

Update `AppRouter` to get supabase and pass everything:

```ts
export function AppRouter() {
  const auth = useAuth()
  const supabase = useSupabase() // ← add this line

  if (!auth.isLoaded) {
    return
  }

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isLoaded: auth.isLoaded,
          isSignedIn: !!auth.isSignedIn,
          userId: auth.userId,
        },
        supabase,    // ← add
        queryClient, // ← add
      }}
    />
  )
}
```

**VERIFY:** `npm run build` — should pass now. App works exactly as before. The `_app.tsx` auth guard still works because it only uses `context.auth`.

---

### Step 4: Add beforeLoad to $budgetId route

**WHY:** This is the core feature. When a user navigates to `/budget/$budgetId`:

1. `beforeLoad` runs before the component renders
2. It calls `ensureQueryData` with the **same query key** (`['budgets', 'overview']`) that `useBudgetOverview` uses
3. If the user came from `/budget`, the data is already cached → instant, no network call
4. If cold loading, it fetches from Supabase and caches for later
5. It finds the specific budget by `params.budgetId`
6. It returns `{ toolbarMeta }` — TanStack Router automatically merges this into the route's context
7. `AppToolbar` reads it via `useMatches()`

**File: `src/routes/_app/budget/$budgetId.tsx`**

Replace the entire file:

```ts
import { createFileRoute, redirect } from '@tanstack/react-router'
import { parseISO } from 'date-fns'
import type { ToolbarMeta } from '@/routes/__root'
import { budgetService } from '@/services/budget.service'
import { formatDateRange } from '@/lib/dates/formatDate'

export const Route = createFileRoute('/_app/budget/$budgetId')({
  beforeLoad: async ({ context, params }) => {
    // ensureQueryData checks the TanStack Query cache first.
    // Query key ['budgets', 'overview'] is the SAME key used by
    // useBudgetOverview in the budget list page — shared cache!
    //
    // If user came from /budget → cache hit, no network request.
    // If cold load (direct URL) → fetches, caches, returns data.
    const overviews = await context.queryClient.ensureQueryData({
      queryKey: ['budgets', 'overview'],
      queryFn: () => budgetService.getOverview(context.supabase),
    })

    // Find this specific budget in the overview list
    const budget = overviews.find((b) => b.budget_id === params.budgetId)

    // If budget doesn't exist, redirect to the list page
    if (!budget) {
      throw redirect({ to: '/budget' })
    }

    // Build the toolbar metadata — format everything here,
    // keep the toolbar purely presentational
    const toolbarMeta: ToolbarMeta = {
      title: budget.budget_name,
      description: budget.end_date
        ? formatDateRange(
            parseISO(budget.start_date),
            parseISO(budget.end_date),
          )
        : undefined,
      balance: {
        label: 'Spent',
        value: `$${budget.total_spent.toFixed(2)} of $${budget.budget_amount.toFixed(2)}`,
      },
    }

    // TanStack Router merges this return value into the route's context.
    // No state management, no context provider — just return an object.
    return { toolbarMeta }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>BudgetPage</div>
}
```

**Key concepts in this code:**

- `context.queryClient` — available because we added it in Step 3
- `context.supabase` — available because we added it in Step 3
- `ensureQueryData({ queryKey, queryFn })` — same API shape as `useQuery`, but not a hook
- `throw redirect(...)` — TanStack Router catches this and navigates instead of rendering
- `return { toolbarMeta }` — auto-merged into context, no boilerplate needed

**VERIFY:** `npm run build` — should pass. Click a budget card — page loads but toolbar still shows UUID (Step 5 will fix that).

---

### Step 5: Update AppToolbar to read toolbarMeta from route matches

**WHY:** `useMatches()` returns an array of all route segments that matched the current URL. For `/budget/$budgetId`, the matches are:

```
[
  { id: '__root__',     context: { auth, supabase, queryClient } },
  { id: '/_app',        context: { auth, supabase, queryClient } },
  { id: '/_app/budget/$budgetId', context: { auth, supabase, queryClient, toolbarMeta } }
]
```

The deepest match (`$budgetId`) has `toolbarMeta` in its context. We scan from deepest to shallowest to find the first one that provides it. Static routes (like `/dashboard`) won't have `toolbarMeta`, so we fall back to `NAVIGATION_ITEMS`.

**File: `src/routes/_app/-components/AppToolbar.tsx`**

Replace the entire file:

```tsx
import { useLocation, useMatches } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { NAVIGATION_ITEMS } from '@/config/navigation'
import type { ToolbarMeta } from '@/routes/__root'

export const AppToolbar = () => {
  const { pathname } = useLocation()
  const matches = useMatches()

  // Scan route matches from deepest (most specific) to shallowest (root).
  // The first match that has toolbarMeta in its context wins.
  //
  // Why reverse? For /budget/$budgetId, matches are:
  //   [__root__, _app, _app/budget/$budgetId]
  // We want the deepest one ($budgetId) — it has the toolbarMeta.
  const toolbarMeta = [...matches]
    .reverse()
    .reduce<ToolbarMeta | undefined>((found, match) => {
      if (found) return found
      const ctx = match.context as Record<string, unknown> | undefined
      if (ctx && 'toolbarMeta' in ctx) return ctx.toolbarMeta as ToolbarMeta
      return undefined
    }, undefined)

  // Fallback: static routes use NAVIGATION_ITEMS (dashboard, expenses, etc.)
  const staticItem = NAVIGATION_ITEMS.find((item) => item.url === pathname)

  // Priority: toolbarMeta > NAVIGATION_ITEMS > pathname fallback
  const title =
    toolbarMeta?.title ?? staticItem?.title ?? pathname.split('/').pop() ?? ''
  const description = toolbarMeta?.description ?? staticItem?.description ?? ''
  const balance = toolbarMeta?.balance

  return (
    <header
      className={cn(
        'bg-sidebar border-b',
        'h-[72px]',
        'flex shrink-0 items-center',
        'select-none',
      )}
    >
      <div
        className={cn('flex w-full items-center justify-start', 'gap-2 p-4')}
      >
        <SidebarTrigger className="md:hidden" />
        <div className="flex w-full items-center justify-between gap-2 px-4">
          <div className="flex flex-col items-start justify-center">
            <p className="text-foreground text-lg leading-tight font-semibold capitalize md:text-lg">
              {title}
            </p>
            <span className="text-muted-foreground text-xs leading-tight md:text-sm">
              {description}
            </span>
          </div>
          <div className="flex flex-col items-end justify-center">
            <p className="text-muted-foreground text-xs leading-tight uppercase md:text-base">
              {balance?.label ?? 'Balance'}
            </p>
            <span className="text-foreground font-mono text-xl leading-tight font-semibold md:text-base">
              {balance?.value ?? '$4418.26'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
```

**What changed from the original:**

- Added `useMatches` import
- Added `ToolbarMeta` import
- Replaced `pathnameParts` logic with `toolbarMeta` → `staticItem` → `pathname` fallback chain
- Balance section now reads from `toolbarMeta.balance` when available
- Removed `console.log('pathnameParts', pathname)` (project rule: no console.log in committed code)

**NOTE about the type cast:** `match.context as Record<string, unknown>` is needed because `useMatches()` returns heterogeneous context types. The `'toolbarMeta' in ctx` check is a runtime guard. You could extract this into a `useToolbarMeta()` hook to isolate the cast — that's optional but cleaner if you want to practice custom hooks.

---

## Verification Checklist

After all steps, test these scenarios:

- [ ] `npm run build` — no TypeScript errors
- [ ] `npm run test` — all existing tests still pass
- [ ] `/budget` — toolbar shows "Budgets" / "Set and monitor budget limits" (unchanged)
- [ ] Click a budget card → `/budget/$id` — toolbar shows budget name, date range, spent/total
- [ ] Paste `/budget/$id` directly in browser (cold load) — toolbar still works (ensureQueryData fetches fresh)
- [ ] Paste `/budget/fake-uuid-that-doesnt-exist` — redirects to `/budget`
- [ ] `/dashboard`, `/expenses`, `/debt-calculator` — unchanged, still use NAVIGATION_ITEMS fallback

## Bonus: Adding toolbarMeta to another route later

Once this is done, adding toolbar support to any new dynamic route is just:

```ts
// In any route file:
export const Route = createFileRoute('/_app/some-route/$id')({
  beforeLoad: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData({ ... })
    return {
      toolbarMeta: {
        title: data.name,
        description: 'whatever',
        balance: { label: 'Total', value: '$123.00' },
      },
    }
  },
  component: SomeComponent,
})
```

No toolbar changes needed. That's the power of the generic `ToolbarMeta` type.
