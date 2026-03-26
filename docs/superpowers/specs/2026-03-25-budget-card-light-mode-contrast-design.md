# Budget Card Light Mode Contrast Fix

## Context

In light mode, budget cards are nearly invisible — the borders blend into the background, there's no shadow, and the "New Budget" card text is almost transparent. This makes the budget page hard to use in light mode.

**Root causes:**

1. Card borders use `border-white/80` — white on a near-white background is invisible
2. Card background stacks `bg-white/60` (card base) with `bg-card/50` (BudgetItem) — too transparent
3. `shadow-glass` / `shadow-glass-hover` classes are referenced but never defined — cards have no shadow at all
4. "New Budget" text uses `text-muted-foreground/50` and `/30` — far too faint

## Design

### 1. Fix Card base light mode styles

**File:** `src/components/ui/card.tsx`

**Default variant** — update light mode classes:
| Current | New |
|---------|-----|
| `border-white/80` | `border-gray-200` |
| `hover:border-white/90` | `hover:border-gray-300` |
| `bg-white/60` | `bg-white/90` |
| `shadow-glass` | `shadow-sm` |
| `hover:shadow-glass-hover` | `hover:shadow-md` |

**Dashed variant** — update light mode classes:
| Current | New |
|---------|-----|
| `shadow-glass` | `shadow-sm` |
| `hover:shadow-glass-hover` | `hover:shadow-md` |

Dark mode classes remain unchanged.

### 2. Remove BudgetItem extra transparency

**File:** `src/routes/_app/budget/-components/BudgetItem.tsx` (line 35)

Remove `bg-card/50` from the Card className — the card base already handles background. This prevents double-stacked transparency.

### 3. Fix "New Budget" text opacity

**File:** `src/routes/_app/budget/index.tsx` (lines 37-41)

| Current                               | New                        |
| ------------------------------------- | -------------------------- |
| `text-muted-foreground/50` (title)    | `text-muted-foreground`    |
| `text-muted-foreground/30` (subtitle) | `text-muted-foreground/70` |

### 4. Clean up undefined shadow utilities

Remove references to `shadow-glass`, `shadow-glass-hover`, `shadow-glass-dark`, `shadow-glass-dark-hover` from `card.tsx` since they are never defined. Replace with Tailwind built-in shadow utilities:

- Light mode: `shadow-sm` / `hover:shadow-md`
- Dark mode: remove the undefined dark shadow classes (dark cards rely on border glow, not shadow)

## Files to modify

1. `src/components/ui/card.tsx` — card variant borders, background opacity, shadows
2. `src/routes/_app/budget/-components/BudgetItem.tsx` — remove `bg-card/50`
3. `src/routes/_app/budget/index.tsx` — fix text opacity values

## What stays the same

- All dark mode border/background styles (separate `dark:` prefixed classes)
- Card layout, padding, border-radius
- Backdrop blur effects
- Card content typography and spacing
- Badge and progress bar styling

## Verification

1. Run `npm run dev` and open the budget page
2. In light mode: confirm cards have visible borders, subtle shadow, and solid background
3. Confirm "New Budget" text is clearly readable
4. Switch to dark mode: confirm no visual regressions
5. Check other pages using cards (if any) for consistency
6. Run `npm run check` to verify no lint/format issues
