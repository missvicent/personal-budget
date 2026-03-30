# Budget Item Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor BudgetItemCard to a minimalist Apple-style card with circular progress ring colored by category.

**Architecture:** Create a reusable `CircularProgress` SVG component in `src/components/ui/`, then refactor `BudgetItemCard` to use it with a new layout matching the reference image.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, shadcn/ui Card

---

### File Map

- **Create:** `src/components/ui/circular-progress.tsx` — Reusable SVG circular progress ring
- **Modify:** `src/routes/_app/budget/-components/budget-item/BudgetItemCard.tsx` — New layout with circular ring

---

### Task 1: Create `CircularProgress` Component

**Files:**

- Create: `src/components/ui/circular-progress.tsx`

- [ ] **Step 1: Create the CircularProgress component**

```tsx
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
  children?: ReactNode
}

export const CircularProgress = ({
  value,
  size = 64,
  strokeWidth = 5,
  color = 'currentColor',
  className,
  children,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedValue = Math.min(100, Math.max(0, value))
  const offset = circumference - (clampedValue / 100) * circumference

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify the component renders**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/circular-progress.tsx
git commit -m "feat: add reusable CircularProgress component"
```

---

### Task 2: Refactor `BudgetItemCard`

**Files:**

- Modify: `src/routes/_app/budget/-components/budget-item/BudgetItemCard.tsx`

- [ ] **Step 1: Rewrite BudgetItemCard with new layout**

Replace the entire contents of `BudgetItemCard.tsx` with:

```tsx
import type { BudgetItem } from '@/types/budget.types'
import { Card, CardContent } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/circular-progress'

interface BudgetItemCardProps {
  budgetItem: BudgetItem
}

export const BudgetItemCard = ({ budgetItem }: BudgetItemCardProps) => {
  const { category_name, amount, category_icon, category_color } = budgetItem
  const budgetAmount = budgetItem.budget_amount ?? 0
  const progressValue = budgetAmount > 0 ? (amount / budgetAmount) * 100 : 0

  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="flex flex-col gap-3">
          <CircularProgress
            value={progressValue}
            size={64}
            strokeWidth={5}
            color={category_color ?? 'var(--color-primary)'}
          >
            <span className="text-xl">{category_icon}</span>
          </CircularProgress>
          <div>
            <p className="font-semibold">{category_name}</p>
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">${amount}</span>{' '}
              of ${budgetAmount}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{Math.round(progressValue)}%</p>
          <p className="text-muted-foreground text-xs">of budget</p>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Verify the build passes**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 3: Verify visually in dev**

Run: `npm run dev`
Navigate to a budget with items. Confirm:

- Circular ring shows with category color
- Emoji icon centered in ring
- Category name and "$X of $Y" below ring
- Percentage and "of budget" on the right
- Light and dark mode both look correct

- [ ] **Step 4: Commit**

```bash
git add src/routes/_app/budget/-components/budget-item/BudgetItemCard.tsx
git commit -m "refactor: redesign BudgetItemCard with circular progress ring"
```
