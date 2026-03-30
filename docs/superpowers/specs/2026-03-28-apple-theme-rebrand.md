# Apple-Inspired Theme Rebrand — Design Spec

**Date:** 2026-03-28
**Approach:** CSS Variables Only (Approach A)
**Aesthetic:** macOS Sonoma / Ventura
**Scope:** Full app — sidebar, toolbar, cards, dialogs, forms, buttons

## Problem

1. **Light mode**: Cards combine a visible `border-gray-200` with `shadow-sm`, creating a heavy, dated look
2. **Dark mode**: Pure black background (`--app-bg: var(--black)`) with dark purple cards creates excessive contrast — feels flat and harsh rather than clean

## Design Direction

Apple's macOS Sonoma aesthetic: neutral grays, ultra-thin borders (4-8% opacity), soft shadows, generous whitespace. Dark mode uses dark grays (not pure black) for depth.

---

## 1. Color Palette

### Light Mode

| Token                 | Current                | New                    | Notes                                     |
| --------------------- | ---------------------- | ---------------------- | ----------------------------------------- |
| `--background`        | `oklch(0.98 0.01 300)` | `oklch(0.955 0 0)`     | Neutral gray, no purple tint              |
| `--app-bg`            | (same as background)   | `oklch(0.955 0 0)`     | App canvas                                |
| `--card`              | `var(--white)`         | `oklch(1 0 0)`         | Pure white cards                          |
| `--card-foreground`   | `var(--grey-900)`      | `oklch(0.2 0 0)`       | Near-black text                           |
| `--foreground`        | `oklch(0.37 0.02 280)` | `oklch(0.25 0 0)`      | Primary text — dark, neutral              |
| `--muted`             | `var(--grey-100)`      | `oklch(0.96 0 0)`      | Muted background                          |
| `--muted-foreground`  | `var(--grey-500)`      | `oklch(0.55 0 0)`      | Secondary text                            |
| `--border`            | `var(--grey-300)`      | `oklch(0.92 0 0)`      | Ultra-light border                        |
| `--input`             | `var(--grey-200)`      | `oklch(0.94 0 0)`      | Input backgrounds                         |
| `--ring`              | `var(--grey-400)`      | `oklch(0.68 0.18 290)` | Focus ring — matches softer purple accent |
| `--accent`            | `var(--grey-100)`      | `oklch(0.96 0 0)`      | Neutral accent bg                         |
| `--accent-foreground` | `var(--grey-800)`      | `oklch(0.25 0 0)`      | Accent text                               |

### Dark Mode

| Token                | Current                | New                     | Notes                                   |
| -------------------- | ---------------------- | ----------------------- | --------------------------------------- |
| `--app-bg`           | `var(--black)`         | `oklch(0.15 0 0)`       | Dark gray, NOT pure black               |
| `--background`       | `var(--grey-800)`      | `oklch(0.2 0 0)`        | Elevated surface                        |
| `--card`             | `oklch(0.25 0.08 285)` | `oklch(0.23 0.005 280)` | Near-neutral, barely perceptible warmth |
| `--card-foreground`  | `var(--foreground)`    | `oklch(0.93 0 0)`       | Bright but not pure white               |
| `--foreground`       | `var(--grey-100)`      | `oklch(0.93 0 0)`       | Slightly softer than white              |
| `--muted-foreground` | (grey)                 | `oklch(0.6 0 0)`        | Secondary text in dark                  |
| `--border`           | `var(--grey-700)`      | `oklch(0.3 0 0)`        | Subtle separation                       |
| `--input`            | (grey)                 | `oklch(0.25 0 0)`       | Dark input bg                           |

### Accent Color — Softer Purple

| Token                  | Current                      | New                    |
| ---------------------- | ---------------------------- | ---------------------- |
| `--purple-bright`      | `oklch(0.65 0.25 295)`       | `oklch(0.68 0.18 290)` |
| `--color-brand`        | `#7c6af0`                    | `#8b80e0`              |
| `--color-brand-light`  | `#a89ff5`                    | `#b0a8e8`              |
| `--color-brand-hover`  | `#8d7cf5`                    | `#9a90e5`              |
| `--primary` (light)    | `oklch(0.65 0.25 295)`       | `oklch(0.62 0.16 290)` |
| `--primary` (dark)     | `oklch(0.558 0.228 292.717)` | `oklch(0.7 0.14 290)`  |
| `--primary-foreground` | `var(--grey-50)`             | `oklch(1 0 0)`         |

---

## 2. Card Treatment

### Light Mode Cards

**Before:**

```
bg-white/90 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
```

**After:**

```
bg-white border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)]
hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]
```

- Border at 4% black opacity — barely visible edge definition
- Soft, small shadow — lighter than Tailwind's `shadow-sm`
- Hover: shadow only, NO translate bounce
- Transition: `transition-shadow duration-200`

### Dark Mode Cards

**Before:**

```
dark:bg-[#7c6af0]/[0.08] dark:border-[#7c6af0]/[0.15]
dark:hover:bg-[#7c6af0]/[0.12] dark:hover:border-[#7c6af0]/[0.25]
```

**After:**

```
dark:bg-white/[0.05] dark:border-white/[0.08]
dark:hover:bg-white/[0.07] dark:hover:border-white/[0.12]
```

- White at 5% opacity for card surface
- White border at 8% opacity — hairline
- No shadow in dark mode (Apple convention)
- Subtle hover brightening

---

## 3. Sidebar

Sidebar matches content area with subtle background offset (like macOS Finder).

### Light Mode Sidebar

- Background: `oklch(0.97 0 0)` — slightly darker than content bg
- Active item: `bg-black/[0.04]` fill with accent-colored text `oklch(0.55 0.14 290)`
- Active indicator: `2px` left border in accent color
- Hover: `bg-black/[0.03]`
- Separator: `border-r border-black/[0.06]`

### Dark Mode Sidebar

- Background: `oklch(0.17 0 0)` — slightly lighter than app-bg
- Active item: `bg-white/[0.08]` with bright accent text
- Hover: `bg-white/[0.04]`
- Separator: `border-r border-white/[0.06]`

### CSS Variable Changes

| Token                         | Current (light)        | New (light)            | Current (dark)         | New (dark)            |
| ----------------------------- | ---------------------- | ---------------------- | ---------------------- | --------------------- |
| `--sidebar`                   | `var(--white)`         | `oklch(0.97 0 0)`      | `var(--purple-dark)`   | `oklch(0.17 0 0)`     |
| `--sidebar-foreground`        | `var(--foreground)`    | `oklch(0.4 0 0)`       | (inherited)            | `oklch(0.7 0 0)`      |
| `--sidebar-accent`            | `oklch(0.96 0.02 290)` | `oklch(0.94 0 0)`      | (dark purple)          | `oklch(0.22 0 0)`     |
| `--sidebar-accent-foreground` | `var(--purple-bright)` | `oklch(0.55 0.14 290)` | (bright)               | `oklch(0.7 0.14 290)` |
| `--sidebar-item-active-bg`    | `oklch(0.94 0.04 290)` | `oklch(0.94 0 0)`      | `oklch(0.22 0.08 285)` | `oklch(0.22 0 0)`     |
| `--sidebar-item-active-text`  | `oklch(0.5 0.2 290)`   | `oklch(0.55 0.14 290)` | `oklch(0.8 0.15 290)`  | `oklch(0.7 0.14 290)` |

---

## 4. Toolbar / Header

Frosted glass effect matching macOS title bars.

- **Light:** `bg-white/80 backdrop-blur-xl border-b border-black/[0.06]`
- **Dark:** `bg-[oklch(0.17_0_0)]/80 backdrop-blur-xl border-b border-white/[0.06]`

---

## 5. Buttons & Interactive Elements

### "+ Add Budget" style buttons

- Light: `border border-black/[0.08] bg-white hover:bg-black/[0.02]`
- Dark: `border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.08]`

### Primary buttons

- Use new softer `--primary` value — same styling pattern, just new color

### Destructive

- Keep `--destructive` unchanged — red is red

---

## 6. Dialog & Form Treatment

Dialogs and forms inherit the new card treatment automatically through CSS variables:

- Dialog overlay: `bg-black/40` (light) / `bg-black/60` (dark)
- Dialog content: same card bg/border pattern
- Form inputs: `--input` variable already covers this

---

## 7. Files to Modify

1. **`src/styles.css`** — All CSS variable changes (light + dark palettes, sidebar tokens, brand colors)
2. **`src/components/ui/card.tsx`** — Card CVA variants (border, shadow, hover)
3. **`src/routes/_app.tsx`** — Toolbar/header frosted glass if AppToolbar styling is inline
4. **`src/routes/_app/-components/AppToolbar.tsx`** — Toolbar frosted glass styling

Files that should NOT need changes (inherit through CSS variables):

- Sidebar component (`sidebar.tsx`) — uses CSS variable tokens
- Dialog components — inherit card/border tokens
- Form components — inherit input/border tokens
- Button components — inherit primary/accent tokens

---

## 8. Verification

1. Toggle between light and dark mode — both should feel cohesive and Apple-like
2. Light mode: cards should have barely-visible edges, no heavy borders
3. Dark mode: background should feel dark gray, not black — cards should be distinguishable
4. Sidebar should blend with content area, separated by a hairline border
5. Toolbar should have frosted glass effect when content scrolls behind it
6. All interactive elements (buttons, inputs, links) should use the softer purple accent
7. Run `npm run check` to ensure no lint/format issues
8. Run `npm run build` to verify no build errors
