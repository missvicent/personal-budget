# Toolbar Meta Refactor — Static Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add static toolbar metadata to dashboard, expenses, ia-insights, and debt-calculator routes via a shared `staticToolbarMeta` helper.

**Architecture:** A one-liner helper function returns a `beforeLoad`-compatible function that provides `ToolbarMeta` to route context. Each static route calls the helper with its metadata. Dynamic routes (like `$budgetId`) continue using custom `beforeLoad` directly.

**Tech Stack:** TanStack Router (`beforeLoad`, route context), TypeScript

---

### File Structure

| File                                        | Action              | Responsibility                            |
| ------------------------------------------- | ------------------- | ----------------------------------------- |
| `src/lib/toolbar.ts`                        | Create              | `staticToolbarMeta` helper function       |
| `src/lib/__tests__/toolbar.test.ts`         | Create              | Unit test for the helper                  |
| `src/routes/_app/dashboard/index.tsx`       | Modify (line 7-9)   | Add `beforeLoad` with static toolbar meta |
| `src/routes/_app/expenses/index.tsx`        | Modify (line 24-26) | Add `beforeLoad` with static toolbar meta |
| `src/routes/_app/ia-insights/index.tsx`     | Modify (line 3-5)   | Add `beforeLoad` with static toolbar meta |
| `src/routes/_app/debt-calculator/index.tsx` | Modify (line 23-25) | Add `beforeLoad` with static toolbar meta |

---

### Task 1: Create `staticToolbarMeta` helper with test

**Files:**

- Create: `src/lib/__tests__/toolbar.test.ts`
- Create: `src/lib/toolbar.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { staticToolbarMeta } from '../toolbar'

describe('staticToolbarMeta', () => {
  it('returns a function that produces { toolbarMeta } with the given meta', () => {
    const meta = {
      title: 'Test Page',
      description: 'A test description',
      balance: { label: 'Balance', value: '$0.00' },
    }

    const beforeLoad = staticToolbarMeta(meta)
    const result = beforeLoad()

    expect(result).toEqual({ toolbarMeta: meta })
  })

  it('works without optional fields', () => {
    const meta = { title: 'Minimal Page' }

    const beforeLoad = staticToolbarMeta(meta)
    const result = beforeLoad()

    expect(result).toEqual({ toolbarMeta: { title: 'Minimal Page' } })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/lib/__tests__/toolbar.test.ts`
Expected: FAIL — cannot find module `../toolbar`

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/toolbar.ts`:

```ts
import type { ToolbarMeta } from '@/routes/__root'

export const staticToolbarMeta = (meta: ToolbarMeta) => () => ({
  toolbarMeta: meta,
})
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/lib/__tests__/toolbar.test.ts`
Expected: 2 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/toolbar.ts src/lib/__tests__/toolbar.test.ts
git commit -m "feat: add staticToolbarMeta helper for route toolbar metadata"
```

---

### Task 2: Add toolbar meta to dashboard route

**Files:**

- Modify: `src/routes/_app/dashboard/index.tsx:1,7-9`

- [ ] **Step 1: Add `beforeLoad` to the route definition**

Add the import at the top of the file (after the existing `createFileRoute` import line):

```ts
import { staticToolbarMeta } from '@/lib/toolbar'
```

Replace the route definition:

```ts
export const Route = createFileRoute('/_app/dashboard/')({
  component: RouteComponent,
})
```

With:

```ts
export const Route = createFileRoute('/_app/dashboard/')({
  beforeLoad: staticToolbarMeta({
    title: 'Dashboard',
    description: 'Overview of your financial health',
    balance: { label: 'Balance', value: '$0.00' },
  }),
  component: RouteComponent,
})
```

- [ ] **Step 2: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no type errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/dashboard/index.tsx
git commit -m "feat: add static toolbar meta to dashboard route"
```

---

### Task 3: Add toolbar meta to expenses route

**Files:**

- Modify: `src/routes/_app/expenses/index.tsx:1,24-26`

- [ ] **Step 1: Add `beforeLoad` to the route definition**

Add the import at the top of the file (after the existing `createFileRoute` import line):

```ts
import { staticToolbarMeta } from '@/lib/toolbar'
```

Replace the route definition:

```ts
export const Route = createFileRoute('/_app/expenses/')({
  component: RouteComponent,
})
```

With:

```ts
export const Route = createFileRoute('/_app/expenses/')({
  beforeLoad: staticToolbarMeta({
    title: 'Expenses',
    description: 'Track and manage your spending',
    balance: { label: 'Balance', value: '$0.00' },
  }),
  component: RouteComponent,
})
```

- [ ] **Step 2: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no type errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/expenses/index.tsx
git commit -m "feat: add static toolbar meta to expenses route"
```

---

### Task 4: Add toolbar meta to AI Insights route

**Files:**

- Modify: `src/routes/_app/ia-insights/index.tsx:1,3-5`

- [ ] **Step 1: Add `beforeLoad` to the route definition**

Replace the entire file content:

```ts
import { createFileRoute } from '@tanstack/react-router'
import { staticToolbarMeta } from '@/lib/toolbar'

export const Route = createFileRoute('/_app/ia-insights/')({
  beforeLoad: staticToolbarMeta({
    title: 'AI Insights',
    description: 'Insights and spending patterns',
    balance: { label: 'Balance', value: '$0.00' },
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello AI Insights!</div>
}
```

- [ ] **Step 2: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no type errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/ia-insights/index.tsx
git commit -m "feat: add static toolbar meta to AI Insights route"
```

---

### Task 5: Add toolbar meta to debt-calculator route

**Files:**

- Modify: `src/routes/_app/debt-calculator/index.tsx:1,23-25`

- [ ] **Step 1: Add `beforeLoad` to the route definition**

Add the import at the top of the file (after the existing `createFileRoute` import line):

```ts
import { staticToolbarMeta } from '@/lib/toolbar'
```

Replace the route definition:

```ts
export const Route = createFileRoute('/_app/debt-calculator/')({
  component: RouteComponent,
})
```

With:

```ts
export const Route = createFileRoute('/_app/debt-calculator/')({
  beforeLoad: staticToolbarMeta({
    title: 'Debt Calculator',
    description: 'Track debts and plan payoff strategies',
  }),
  component: RouteComponent,
})
```

Note: No `balance` field for debt-calculator per spec.

- [ ] **Step 2: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no type errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/debt-calculator/index.tsx
git commit -m "feat: add static toolbar meta to debt-calculator route"
```

---

### Task 6: Final verification

- [ ] **Step 1: Run all tests**

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 2: Run lint/format check**

Run: `npm run check`
Expected: No errors

- [ ] **Step 3: Build the app**

Run: `npm run build`
Expected: Clean build with no warnings or errors
