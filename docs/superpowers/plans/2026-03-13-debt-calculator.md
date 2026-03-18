# Debt Calculator Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a debt calculator module with TanStack DB + ElectricSQL for tracking consumer debts and comparing snowball/avalanche payoff strategies.

**Architecture:** Route-scoped TanStack DB provider syncs debt data via ElectricSQL shape streams. Writes go through Supabase client (reusing existing Clerk auth + RLS). The rest of the app stays on TanStack Query — no shared tables, no conflicts.

**Tech Stack:** React 19, TanStack DB, ElectricSQL (`@electric-sql/client`), Supabase, Zod, react-hook-form, Vitest

**Spec:** `docs/superpowers/specs/2026-03-13-debt-calculator-design.md`

---

## File Structure

### New Files

| File                                                               | Responsibility                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `src/types/database.types.ts`                                      | Add `Debt`, `DebtPayment`, `DebtType` types (modify existing)                   |
| `src/lib/validations/debt.schema.ts`                               | Zod schemas for debt + payment forms, payload transforms                        |
| `src/lib/tanstack-db.ts`                                           | TanStack DB instance factory with ElectricSQL shape streams                     |
| `src/services/debt.service.ts`                                     | Supabase CRUD + RPC calls for debts and payments                                |
| `src/routes/_app/debt-calculator/index.tsx`                        | Route entry, wraps content with DebtDBProvider                                  |
| `src/routes/_app/debt-calculator/-hooks/use-debt-db.ts`            | DebtDBProvider context + useDebtDB hook                                         |
| `src/routes/_app/debt-calculator/-hooks/use-debts.ts`              | Live query for debts collection                                                 |
| `src/routes/_app/debt-calculator/-hooks/use-debt-payments.ts`      | Live query for debt payments collection                                         |
| `src/routes/_app/debt-calculator/-hooks/use-debt-mutations.ts`     | Async writes via Supabase (ElectricSQL syncs back; optimistic updates deferred) |
| `src/routes/_app/debt-calculator/-hooks/use-debt-dialog.ts`        | Dialog state (open, selected debt, mode)                                        |
| `src/routes/_app/debt-calculator/-hooks/use-payoff-calculator.ts`  | useMemo wrapper for payoff strategy functions                                   |
| `src/routes/_app/debt-calculator/-lib/payoff-strategies.ts`        | Pure snowball/avalanche calculation functions                                   |
| `src/routes/_app/debt-calculator/-components/DebtForm.tsx`         | Create/edit debt dialog form                                                    |
| `src/routes/_app/debt-calculator/-components/DebtCard.tsx`         | Individual debt card (icon + stats grid)                                        |
| `src/routes/_app/debt-calculator/-components/DebtList.tsx`         | Grid of DebtCards                                                               |
| `src/routes/_app/debt-calculator/-components/DebtSummary.tsx`      | Aggregate stats bar                                                             |
| `src/routes/_app/debt-calculator/-components/PayoffComparison.tsx` | Snowball vs avalanche side-by-side                                              |
| `src/routes/_app/debt-calculator/-components/PaymentForm.tsx`      | Record payment dialog                                                           |
| `src/routes/_app/debt-calculator/-components/index.ts`             | Barrel export                                                                   |

### Modified Files

| File                          | Change                                                        |
| ----------------------------- | ------------------------------------------------------------- |
| `src/types/database.types.ts` | Add Debt, DebtPayment, DebtType, CreateDebt, UpdateDebt types |
| `src/config/navigation.ts`    | Add Debt Calculator nav entry                                 |
| `docker-compose.yml`          | Add ElectricSQL service                                       |

---

## Chunk 1: Foundation (Types, Validation, Infrastructure)

### Task 1: Install Dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install TanStack DB and ElectricSQL packages**

```bash
pnpm add @tanstack/db @tanstack/react-db @electric-sql/client
```

- [ ] **Step 2: Verify installation**

Run: `pnpm ls @tanstack/db @tanstack/react-db @electric-sql/client`
Expected: All three packages listed with versions

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: add TanStack DB and ElectricSQL dependencies"
```

---

### Task 2: Add TypeScript Types

**Files:**

- Modify: `src/types/database.types.ts`

- [ ] **Step 1: Add Debt and DebtPayment types**

Add to the end of `src/types/database.types.ts`:

```typescript
export type DebtType =
  | 'credit_card'
  | 'personal_loan'
  | 'auto_loan'
  | 'student_loan'
  | 'mortgage'

export interface Debt {
  id: string
  user_id: string
  name: string
  type: DebtType
  principal_amount: number
  interest_rate: number
  current_balance: number
  minimum_payment: number
  start_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DebtPayment {
  id: string
  debt_id: string
  user_id: string
  amount_paid: number
  principal_paid: number
  interest_paid: number
  payment_date: string
  notes: string | null
  created_at: string
}

export type CreateDebt = Omit<
  Debt,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>
export type UpdateDebt = Partial<
  Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors related to Debt types

- [ ] **Step 3: Commit**

```bash
git add src/types/database.types.ts
git commit -m "feat: add Debt and DebtPayment type definitions"
```

---

### Task 3: Create Validation Schemas

**Files:**

- Create: `src/lib/validations/debt.schema.ts`

Reference pattern: `src/lib/validations/budget.schema.ts`

- [ ] **Step 1: Write test for debt schema validation**

Create `src/lib/validations/__tests__/debt.schema.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import {
  debtSchema,
  debtPaymentSchema,
  toDebtPayload,
  toDebtPaymentPayload,
} from '../debt.schema'

describe('debtSchema', () => {
  it('validates a valid debt', () => {
    const result = debtSchema.safeParse({
      name: 'Chase Sapphire',
      type: 'credit_card',
      principal_amount: 12000,
      interest_rate: 19.99,
      current_balance: 8240,
      minimum_payment: 165,
      start_date: '2024-01-15',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = debtSchema.safeParse({
      name: '',
      type: 'credit_card',
      principal_amount: 12000,
      interest_rate: 19.99,
      current_balance: 8240,
      minimum_payment: 165,
      start_date: '2024-01-15',
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative interest rate', () => {
    const result = debtSchema.safeParse({
      name: 'Test',
      type: 'mortgage',
      principal_amount: 200000,
      interest_rate: -1,
      current_balance: 180000,
      minimum_payment: 1200,
      start_date: '2023-06-01',
    })
    expect(result.success).toBe(false)
  })

  it('rejects interest rate over 100', () => {
    const result = debtSchema.safeParse({
      name: 'Test',
      type: 'personal_loan',
      principal_amount: 5000,
      interest_rate: 101,
      current_balance: 4500,
      minimum_payment: 150,
      start_date: '2024-03-01',
    })
    expect(result.success).toBe(false)
  })
})

describe('debtPaymentSchema', () => {
  it('validates a valid payment', () => {
    const result = debtPaymentSchema.safeParse({
      amount_paid: 500,
      payment_date: '2026-03-01',
      notes: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects zero payment', () => {
    const result = debtPaymentSchema.safeParse({
      amount_paid: 0,
      payment_date: '2026-03-01',
    })
    expect(result.success).toBe(false)
  })
})

describe('toDebtPayload', () => {
  it('transforms form data to DB payload with defaults', () => {
    const payload = toDebtPayload({
      name: 'My Loan',
      type: 'personal_loan',
      principal_amount: 10000,
      interest_rate: 8.5,
      current_balance: 9000,
      minimum_payment: 250,
      start_date: '2024-06-01',
    })
    expect(payload).toEqual({
      name: 'My Loan',
      type: 'personal_loan',
      principal_amount: 10000,
      interest_rate: 8.5,
      current_balance: 9000,
      minimum_payment: 250,
      start_date: '2024-06-01',
      is_active: true,
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/validations/__tests__/debt.schema.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the validation schemas**

Create `src/lib/validations/debt.schema.ts`:

```typescript
import { z } from 'zod'

export const debtSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum([
    'credit_card',
    'personal_loan',
    'auto_loan',
    'student_loan',
    'mortgage',
  ]),
  principal_amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(10_000_000),
  interest_rate: z
    .number()
    .min(0, 'Rate cannot be negative')
    .max(100, 'Rate cannot exceed 100%'),
  current_balance: z
    .number()
    .min(0, 'Balance cannot be negative')
    .max(10_000_000),
  minimum_payment: z
    .number()
    .min(0, 'Payment cannot be negative')
    .max(1_000_000),
  start_date: z.string().min(1, 'Start date is required'),
})

export type DebtFormData = z.infer<typeof debtSchema>

export function toDebtPayload(data: DebtFormData) {
  return {
    ...data,
    is_active: true,
  }
}

export const debtPaymentSchema = z.object({
  amount_paid: z.number().min(0.01, 'Payment must be greater than 0'),
  payment_date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500).nullable().optional(),
})

export type DebtPaymentFormData = z.infer<typeof debtPaymentSchema>

export function toDebtPaymentPayload(
  data: DebtPaymentFormData,
  debtId: string,
  currentBalance: number,
  annualRate: number,
) {
  const monthlyInterest = currentBalance * (annualRate / 12 / 100)
  const interestPaid = Math.min(monthlyInterest, data.amount_paid)
  const principalPaid = data.amount_paid - interestPaid

  return {
    debt_id: debtId,
    amount_paid: data.amount_paid,
    principal_paid: Math.max(principalPaid, 0),
    interest_paid: Math.max(interestPaid, 0),
    payment_date: data.payment_date,
    notes: data.notes ?? null,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/validations/__tests__/debt.schema.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/validations/debt.schema.ts src/lib/validations/__tests__/debt.schema.test.ts
git commit -m "feat: add Zod validation schemas for debt and payment forms"
```

---

### Task 4: Create Debt Service

**Files:**

- Create: `src/services/debt.service.ts`

Reference pattern: `src/services/budget.service.ts`

- [ ] **Step 1: Write the debt service**

Create `src/services/debt.service.ts`:

```typescript
import type {
  CreateDebt,
  Debt,
  DebtPayment,
  UpdateDebt,
} from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const debtService = {
  getAll: async (supabase: SupabaseClient): Promise<Array<Debt>> => {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (error) throw new Error(`Failed to fetch debts: ${error.message}`)
    return data
  },

  create: async (debt: CreateDebt, supabase: SupabaseClient): Promise<Debt> => {
    const { data, error } = await supabase
      .from('debts')
      .insert(debt)
      .select()
      .single()
    if (error) throw new Error(`Failed to create debt: ${error.message}`)
    return data
  },

  update: async (
    id: string,
    debt: UpdateDebt,
    supabase: SupabaseClient,
  ): Promise<Debt> => {
    const { data, error } = await supabase
      .from('debts')
      .update(debt)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update debt: ${error.message}`)
    return data
  },

  delete: async (id: string, supabase: SupabaseClient): Promise<void> => {
    const { error } = await supabase.from('debts').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete debt: ${error.message}`)
  },

  recordPayment: async (
    params: {
      p_debt_id: string
      p_amount_paid: number
      p_principal_paid: number
      p_interest_paid: number
      p_payment_date: string
      p_notes: string | null
    },
    supabase: SupabaseClient,
  ): Promise<void> => {
    const { error } = await supabase.rpc('record_debt_payment', params)
    if (error) throw new Error(`Failed to record payment: ${error.message}`)
  },
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/services/debt.service.ts
git commit -m "feat: add debt service with CRUD and payment RPC"
```

---

### Task 5: Update Infrastructure (Docker + Navigation)

**Files:**

- Modify: `docker-compose.yml`
- Modify: `src/config/navigation.ts`

- [ ] **Step 1: Add ElectricSQL service to docker-compose.yml**

Add after the `app` service in `docker-compose.yml`:

```yaml
electric:
  image: electricsql/electric:latest
  ports:
    - '3001:3000'
  environment:
    DATABASE_URL: '${SUPABASE_DB_URL}'
  depends_on:
    - app
```

- [ ] **Step 2: Add Debt Calculator to navigation**

In `src/config/navigation.ts`, add `Calculator` to the lucide-react import and add a new entry before the AI Insights item:

```typescript
import {
  Brain,
  Calculator,
  ChartNoAxesCombined,
  ClipboardList,
  House,
} from 'lucide-react'
```

Add this entry after the Budgets item:

```typescript
  {
    title: 'Debt Calculator',
    url: '/debt-calculator',
    description: 'Track debts and plan payoff strategies',
    icon: Calculator,
  },
```

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml src/config/navigation.ts
git commit -m "feat: add ElectricSQL docker service and debt calculator navigation"
```

---

## Chunk 2: Payoff Calculation Logic (Pure Functions + Tests)

### Task 6: Write Payoff Strategy Functions

**Files:**

- Create: `src/routes/_app/debt-calculator/-lib/payoff-strategies.ts`
- Create: `src/routes/_app/debt-calculator/-lib/__tests__/payoff-strategies.test.ts`

- [ ] **Step 1: Write comprehensive tests for payoff strategies**

Create `src/routes/_app/debt-calculator/-lib/__tests__/payoff-strategies.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import {
  calculateSnowball,
  calculateAvalanche,
  type DebtInput,
  type PayoffResult,
} from '../payoff-strategies'

const twoDebts: Array<DebtInput> = [
  {
    debtId: 'card',
    name: 'Credit Card',
    balance: 5000,
    interestRate: 20,
    minimumPayment: 100,
  },
  {
    debtId: 'car',
    name: 'Car Loan',
    balance: 15000,
    interestRate: 5,
    minimumPayment: 300,
  },
]

describe('calculateSnowball', () => {
  it('returns a valid result with correct strategy label', () => {
    const result = calculateSnowball(twoDebts, 0)
    expect(result.strategy).toBe('snowball')
    expect(result.totalMonths).toBeGreaterThan(0)
    expect(result.totalInterestPaid).toBeGreaterThan(0)
    expect(result.totalPaid).toBeGreaterThan(result.totalInterestPaid)
    expect(result.debtPayoffOrder).toHaveLength(2)
  })

  it('pays smallest balance first (credit card before car)', () => {
    const result = calculateSnowball(twoDebts, 0)
    const cardOrder = result.debtPayoffOrder.find((d) => d.debtId === 'card')
    const carOrder = result.debtPayoffOrder.find((d) => d.debtId === 'car')
    expect(cardOrder!.payoffMonth).toBeLessThan(carOrder!.payoffMonth)
  })

  it('extra payment reduces total months and interest', () => {
    const withoutExtra = calculateSnowball(twoDebts, 0)
    const withExtra = calculateSnowball(twoDebts, 200)
    expect(withExtra.totalMonths).toBeLessThan(withoutExtra.totalMonths)
    expect(withExtra.totalInterestPaid).toBeLessThan(
      withoutExtra.totalInterestPaid,
    )
  })

  it('handles single debt', () => {
    const single: Array<DebtInput> = [
      {
        debtId: 'only',
        name: 'Only Debt',
        balance: 1000,
        interestRate: 10,
        minimumPayment: 100,
      },
    ]
    const result = calculateSnowball(single, 0)
    expect(result.debtPayoffOrder).toHaveLength(1)
    expect(result.totalMonths).toBeGreaterThan(0)
  })

  it('handles 0% interest rate', () => {
    const zeroRate: Array<DebtInput> = [
      {
        debtId: 'free',
        name: 'Interest Free',
        balance: 1200,
        interestRate: 0,
        minimumPayment: 100,
      },
    ]
    const result = calculateSnowball(zeroRate, 0)
    expect(result.totalMonths).toBe(12)
    expect(result.totalInterestPaid).toBe(0)
    expect(result.totalPaid).toBe(1200)
  })

  it('caps at 360 months', () => {
    const tiny: Array<DebtInput> = [
      {
        debtId: 'huge',
        name: 'Huge Debt',
        balance: 1_000_000,
        interestRate: 25,
        minimumPayment: 1,
      },
    ]
    const result = calculateSnowball(tiny, 0)
    expect(result.totalMonths).toBe(360)
  })

  it('handles minimum payment exceeding balance', () => {
    const small: Array<DebtInput> = [
      {
        debtId: 'tiny',
        name: 'Tiny Debt',
        balance: 50,
        interestRate: 15,
        minimumPayment: 100,
      },
    ]
    const result = calculateSnowball(small, 0)
    expect(result.totalMonths).toBe(1)
    expect(result.totalPaid).toBeLessThanOrEqual(50 + 10) // balance + at most one month interest
  })

  it('returns empty result for no debts', () => {
    const result = calculateSnowball([], 0)
    expect(result.totalMonths).toBe(0)
    expect(result.totalInterestPaid).toBe(0)
    expect(result.debtPayoffOrder).toHaveLength(0)
  })
})

describe('calculateAvalanche', () => {
  it('returns a valid result with correct strategy label', () => {
    const result = calculateAvalanche(twoDebts, 0)
    expect(result.strategy).toBe('avalanche')
    expect(result.totalMonths).toBeGreaterThan(0)
  })

  it('pays highest rate first (credit card before car)', () => {
    const result = calculateAvalanche(twoDebts, 0)
    const cardOrder = result.debtPayoffOrder.find((d) => d.debtId === 'card')
    const carOrder = result.debtPayoffOrder.find((d) => d.debtId === 'car')
    expect(cardOrder!.payoffMonth).toBeLessThan(carOrder!.payoffMonth)
  })

  it('avalanche pays less total interest than snowball for high-rate debts', () => {
    const debts: Array<DebtInput> = [
      {
        debtId: 'low-balance-high-rate',
        name: 'High Rate Card',
        balance: 8000,
        interestRate: 24,
        minimumPayment: 160,
      },
      {
        debtId: 'high-balance-low-rate',
        name: 'Low Rate Loan',
        balance: 3000,
        interestRate: 4,
        minimumPayment: 100,
      },
    ]
    const snowball = calculateSnowball(debts, 100)
    const avalanche = calculateAvalanche(debts, 100)
    expect(avalanche.totalInterestPaid).toBeLessThanOrEqual(
      snowball.totalInterestPaid,
    )
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/routes/_app/debt-calculator/-lib/__tests__/payoff-strategies.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement payoff strategy functions**

Create `src/routes/_app/debt-calculator/-lib/payoff-strategies.ts`:

```typescript
export interface DebtInput {
  debtId: string
  name: string
  balance: number
  interestRate: number
  minimumPayment: number
}

export interface PayoffResult {
  strategy: 'snowball' | 'avalanche'
  totalMonths: number
  totalInterestPaid: number
  totalPaid: number
  debtPayoffOrder: Array<{
    debtId: string
    name: string
    payoffMonth: number
    totalInterestForDebt: number
  }>
}

const MAX_MONTHS = 360

function simulatePayoff(
  debts: Array<DebtInput>,
  extraMonthly: number,
  sortFn: (a: DebtInput, b: DebtInput) => number,
  strategyLabel: 'snowball' | 'avalanche',
): PayoffResult {
  if (debts.length === 0) {
    return {
      strategy: strategyLabel,
      totalMonths: 0,
      totalInterestPaid: 0,
      totalPaid: 0,
      debtPayoffOrder: [],
    }
  }

  const sorted = [...debts].sort(sortFn)
  const balances = new Map(sorted.map((d) => [d.debtId, d.balance]))
  const interestAccum = new Map(sorted.map((d) => [d.debtId, 0]))
  const payoffOrder: PayoffResult['debtPayoffOrder'] = []
  let totalPaid = 0
  let month = 0

  while (month < MAX_MONTHS) {
    const activeDebts = sorted.filter((d) => (balances.get(d.debtId) ?? 0) > 0)
    if (activeDebts.length === 0) break

    month++
    let extraRemaining = extraMonthly

    // Apply interest to all active debts
    for (const debt of activeDebts) {
      const bal = balances.get(debt.debtId)!
      const monthlyInterest = bal * (debt.interestRate / 12 / 100)
      balances.set(debt.debtId, bal + monthlyInterest)
      interestAccum.set(
        debt.debtId,
        (interestAccum.get(debt.debtId) ?? 0) + monthlyInterest,
      )
    }

    // Pay minimums on all active debts
    for (const debt of activeDebts) {
      const bal = balances.get(debt.debtId)!
      const payment = Math.min(debt.minimumPayment, bal)
      balances.set(debt.debtId, bal - payment)
      totalPaid += payment

      if (balances.get(debt.debtId)! <= 0.01) {
        balances.set(debt.debtId, 0)
        payoffOrder.push({
          debtId: debt.debtId,
          name: debt.name,
          payoffMonth: month,
          totalInterestForDebt: interestAccum.get(debt.debtId) ?? 0,
        })
        // Roll freed minimum into extra
        extraRemaining += debt.minimumPayment - payment
      }
    }

    // Apply extra payment to the target debt (first active in sorted order)
    const target = sorted.find((d) => (balances.get(d.debtId) ?? 0) > 0)
    if (target && extraRemaining > 0) {
      const bal = balances.get(target.debtId)!
      const extraPayment = Math.min(extraRemaining, bal)
      balances.set(target.debtId, bal - extraPayment)
      totalPaid += extraPayment

      if (balances.get(target.debtId)! <= 0.01) {
        balances.set(target.debtId, 0)
        if (!payoffOrder.some((p) => p.debtId === target.debtId)) {
          payoffOrder.push({
            debtId: target.debtId,
            name: target.name,
            payoffMonth: month,
            totalInterestForDebt: interestAccum.get(target.debtId) ?? 0,
          })
        }
      }
    }
  }

  // Any debts still remaining after MAX_MONTHS
  for (const debt of sorted) {
    if (
      (balances.get(debt.debtId) ?? 0) > 0 &&
      !payoffOrder.some((p) => p.debtId === debt.debtId)
    ) {
      payoffOrder.push({
        debtId: debt.debtId,
        name: debt.name,
        payoffMonth: MAX_MONTHS,
        totalInterestForDebt: interestAccum.get(debt.debtId) ?? 0,
      })
    }
  }

  const totalInterestPaid = Array.from(interestAccum.values()).reduce(
    (sum, v) => sum + v,
    0,
  )

  return {
    strategy: strategyLabel,
    totalMonths: month,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    debtPayoffOrder: payoffOrder.map((p) => ({
      ...p,
      totalInterestForDebt: Math.round(p.totalInterestForDebt * 100) / 100,
    })),
  }
}

export function calculateSnowball(
  debts: Array<DebtInput>,
  extraMonthly: number,
): PayoffResult {
  return simulatePayoff(
    debts,
    extraMonthly,
    (a, b) => a.balance - b.balance,
    'snowball',
  )
}

export function calculateAvalanche(
  debts: Array<DebtInput>,
  extraMonthly: number,
): PayoffResult {
  return simulatePayoff(
    debts,
    extraMonthly,
    (a, b) => b.interestRate - a.interestRate,
    'avalanche',
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/routes/_app/debt-calculator/-lib/__tests__/payoff-strategies.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/routes/_app/debt-calculator/-lib/payoff-strategies.ts src/routes/_app/debt-calculator/-lib/__tests__/payoff-strategies.test.ts
git commit -m "feat: add snowball and avalanche payoff strategy calculations"
```

---

## Chunk 3: TanStack DB Integration Layer

### Task 7: Create TanStack DB Configuration

**Files:**

- Create: `src/lib/tanstack-db.ts`

- [ ] **Step 1: Write TanStack DB factory**

Create `src/lib/tanstack-db.ts`:

```typescript
import { TanStackDB, collection } from '@tanstack/db'
import { ShapeStream } from '@electric-sql/client'
import type { Debt, DebtPayment } from '@/types/database.types'

const debtsCollection = collection<Debt>({
  id: 'debts',
  primaryKey: 'id',
})

const debtPaymentsCollection = collection<DebtPayment>({
  id: 'debt_payments',
  primaryKey: 'id',
})

export function createDebtDB(electricUrl: string, userId: string) {
  return new TanStackDB({
    collections: {
      debts: debtsCollection,
      debtPayments: debtPaymentsCollection,
    },
    sync: {
      debts: () =>
        new ShapeStream({
          url: `${electricUrl}/v1/shape`,
          table: 'debts',
          where: `user_id = '${userId}'`,
        }),
      debtPayments: () =>
        new ShapeStream({
          url: `${electricUrl}/v1/shape`,
          table: 'debt_payments',
          where: `user_id = '${userId}'`,
        }),
    },
  })
}

export type DebtDB = ReturnType<typeof createDebtDB>
```

Note: The exact TanStack DB API may vary based on the installed version. Consult the `@tanstack/db` package docs if the API above doesn't match. The key pattern is: define collections with primary keys, attach ElectricSQL ShapeStream sync sources scoped by userId.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors (or only pre-existing ones)

- [ ] **Step 3: Commit**

```bash
git add src/lib/tanstack-db.ts
git commit -m "feat: add TanStack DB factory with ElectricSQL shape streams"
```

---

### Task 8: Create DebtDB Provider and Hooks

**Files:**

- Create: `src/routes/_app/debt-calculator/-hooks/use-debt-db.ts`
- Create: `src/routes/_app/debt-calculator/-hooks/use-debts.ts`
- Create: `src/routes/_app/debt-calculator/-hooks/use-debt-payments.ts`
- Create: `src/routes/_app/debt-calculator/-hooks/use-debt-dialog.ts`

- [ ] **Step 1: Create DebtDBProvider and context hook**

Create `src/routes/_app/debt-calculator/-hooks/use-debt-db.ts`:

```typescript
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { createDebtDB, type DebtDB } from '@/lib/tanstack-db'

const DebtDBContext = createContext<DebtDB | null>(null)

const ELECTRIC_URL = import.meta.env.VITE_ELECTRIC_URL ?? 'http://localhost:3001'

export function DebtDBProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth()

  const db = useMemo(() => {
    if (!userId) return null
    return createDebtDB(ELECTRIC_URL, userId)
  }, [userId])

  useEffect(() => {
    return () => {
      db?.close()
    }
  }, [db])

  if (!db) return null

  return (
    <DebtDBContext.Provider value={db}>{children}</DebtDBContext.Provider>
  )
}

export function useDebtDB(): DebtDB {
  const db = useContext(DebtDBContext)
  if (!db) throw new Error('useDebtDB must be used within DebtDBProvider')
  return db
}
```

- [ ] **Step 2: Create live query hooks**

Create `src/routes/_app/debt-calculator/-hooks/use-debts.ts`:

Note: TanStack DB's `useQuery` from `@tanstack/react-db` returns an array directly, NOT an object with `.data` like TanStack Query. Components should use the return value directly.

```typescript
import { useQuery } from '@tanstack/react-db'
import { useDebtDB } from './use-debt-db'

export function useDebts() {
  const db = useDebtDB()
  return useQuery({
    collection: db.collections.debts,
    filter: (debt) => debt.is_active,
  })
}
```

Create `src/routes/_app/debt-calculator/-hooks/use-debt-payments.ts`:

```typescript
import { useQuery } from '@tanstack/react-db'
import { useDebtDB } from './use-debt-db'

export function useDebtPayments(debtId?: string) {
  const db = useDebtDB()
  return useQuery({
    collection: db.collections.debtPayments,
    filter: debtId ? (payment) => payment.debt_id === debtId : undefined,
  })
}
```

- [ ] **Step 3: Create dialog state hook**

Create `src/routes/_app/debt-calculator/-hooks/use-debt-dialog.ts`:

```typescript
import { useState } from 'react'
import type { Debt } from '@/types/database.types'

export type DebtDialogMode = 'debt' | 'payment'

export function useDebtDialog() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<DebtDialogMode>('debt')
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)

  return {
    open,
    mode,
    selectedDebt,
    openDebtForm: (debt?: Debt) => {
      setMode('debt')
      setSelectedDebt(debt ?? null)
      setOpen(true)
    },
    openPaymentForm: (debt: Debt) => {
      setMode('payment')
      setSelectedDebt(debt)
      setOpen(true)
    },
    onOpenChange: (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        setSelectedDebt(null)
      }
    },
  }
}
```

- [ ] **Step 4: Verify compilation**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 5: Commit**

```bash
git add src/routes/_app/debt-calculator/-hooks/
git commit -m "feat: add DebtDB provider, live query hooks, and dialog state"
```

---

### Task 9: Create Debt Mutations Hook

**Files:**

- Create: `src/routes/_app/debt-calculator/-hooks/use-debt-mutations.ts`

- [ ] **Step 1: Write the mutations hook**

Note: This initial implementation uses simple async writes to Supabase. ElectricSQL handles syncing changes back to TanStack DB automatically. Full optimistic mutations (local TanStack DB inserts with rollback) can be added later once the basic flow is working end-to-end.

Create `src/routes/_app/debt-calculator/-hooks/use-debt-mutations.ts`:

```typescript
import { useState } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { debtService } from '@/services/debt.service'
import type {
  DebtFormData,
  DebtPaymentFormData,
} from '@/lib/validations/debt.schema'
import {
  toDebtPayload,
  toDebtPaymentPayload,
} from '@/lib/validations/debt.schema'
import { toast } from 'sonner'

export function useDebtMutations() {
  const supabase = useSupabase()
  const [isPending, setIsPending] = useState(false)

  const createDebt = async (data: DebtFormData) => {
    setIsPending(true)
    try {
      await debtService.create(toDebtPayload(data), supabase)
      // ElectricSQL will sync the new row back to TanStack DB
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create debt',
      )
    } finally {
      setIsPending(false)
    }
  }

  const updateDebt = async (id: string, data: Partial<DebtFormData>) => {
    setIsPending(true)
    try {
      await debtService.update(id, data, supabase)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update debt',
      )
    } finally {
      setIsPending(false)
    }
  }

  const deleteDebt = async (id: string) => {
    setIsPending(true)
    try {
      await debtService.delete(id, supabase)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete debt',
      )
    } finally {
      setIsPending(false)
    }
  }

  const recordPayment = async (
    debtId: string,
    currentBalance: number,
    annualRate: number,
    data: DebtPaymentFormData,
  ) => {
    setIsPending(true)
    try {
      const payload = toDebtPaymentPayload(
        data,
        debtId,
        currentBalance,
        annualRate,
      )
      await debtService.recordPayment(
        {
          p_debt_id: payload.debt_id,
          p_amount_paid: payload.amount_paid,
          p_principal_paid: payload.principal_paid,
          p_interest_paid: payload.interest_paid,
          p_payment_date: payload.payment_date,
          p_notes: payload.notes,
        },
        supabase,
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to record payment',
      )
    } finally {
      setIsPending(false)
    }
  }

  return { createDebt, updateDebt, deleteDebt, recordPayment, isPending }
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/debt-calculator/-hooks/use-debt-mutations.ts
git commit -m "feat: add debt mutations hook with Supabase writes"
```

---

### Task 10: Create Payoff Calculator Hook

**Files:**

- Create: `src/routes/_app/debt-calculator/-hooks/use-payoff-calculator.ts`

- [ ] **Step 1: Write the calculator hook**

Create `src/routes/_app/debt-calculator/-hooks/use-payoff-calculator.ts`:

```typescript
import { useMemo, useState } from 'react'
import type { Debt } from '@/types/database.types'
import {
  calculateSnowball,
  calculateAvalanche,
  type DebtInput,
  type PayoffResult,
} from '../-lib/payoff-strategies'

export function usePayoffCalculator(debts: Array<Debt>) {
  const [extraPayment, setExtraPayment] = useState(0)

  const debtInputs: Array<DebtInput> = useMemo(
    () =>
      debts.map((d) => ({
        debtId: d.id,
        name: d.name,
        balance: d.current_balance,
        interestRate: d.interest_rate,
        minimumPayment: d.minimum_payment,
      })),
    [debts],
  )

  const snowball: PayoffResult = useMemo(
    () => calculateSnowball(debtInputs, extraPayment),
    [debtInputs, extraPayment],
  )

  const avalanche: PayoffResult = useMemo(
    () => calculateAvalanche(debtInputs, extraPayment),
    [debtInputs, extraPayment],
  )

  const interestSaved = useMemo(
    () =>
      Math.round(
        (snowball.totalInterestPaid - avalanche.totalInterestPaid) * 100,
      ) / 100,
    [snowball, avalanche],
  )

  return { snowball, avalanche, extraPayment, setExtraPayment, interestSaved }
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/debt-calculator/-hooks/use-payoff-calculator.ts
git commit -m "feat: add payoff calculator hook with snowball/avalanche comparison"
```

---

## Chunk 4: UI Components and Route Assembly

### Task 11: Create DebtCard and DebtList Components

**Files:**

- Create: `src/routes/_app/debt-calculator/-components/DebtCard.tsx`
- Create: `src/routes/_app/debt-calculator/-components/DebtList.tsx`

- [ ] **Step 1: Create DebtCard component**

Create `src/routes/_app/debt-calculator/-components/DebtCard.tsx`:

```tsx
import type { Debt } from '@/types/database.types'
import { cn } from '@/lib/utils'
import {
  CreditCard,
  Car,
  GraduationCap,
  Home,
  Banknote,
  Pencil,
  Trash2,
  CircleDollarSign,
} from 'lucide-react'

const DEBT_TYPE_CONFIG = {
  credit_card: { icon: CreditCard, label: 'Credit Card' },
  personal_loan: { icon: Banknote, label: 'Personal Loan' },
  auto_loan: { icon: Car, label: 'Auto Loan' },
  student_loan: { icon: GraduationCap, label: 'Student Loan' },
  mortgage: { icon: Home, label: 'Mortgage' },
} as const

interface DebtCardProps {
  debt: Debt
  onEdit: (debt: Debt) => void
  onRecordPayment: (debt: Debt) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function DebtCard({
  debt,
  onEdit,
  onRecordPayment,
  onDelete,
  isDeleting,
}: DebtCardProps) {
  const config = DEBT_TYPE_CONFIG[debt.type]
  const Icon = config.icon
  const paidOffPercent =
    debt.principal_amount > 0
      ? Math.round(
          ((debt.principal_amount - debt.current_balance) /
            debt.principal_amount) *
            100,
        )
      : 0

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        'bg-card text-card-foreground',
        'flex flex-col gap-3',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{debt.name}</p>
            <p className="text-muted-foreground text-xs">{config.label}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">
            {formatter.format(debt.current_balance)}
          </p>
          <p className="text-muted-foreground text-xs">balance</p>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-muted-foreground text-xs">APR</p>
            <p className="text-sm font-semibold text-red-500">
              {debt.interest_rate}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Min Payment</p>
            <p className="text-sm font-semibold">
              {formatter.format(debt.minimum_payment)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Paid Off</p>
            <p className="text-sm font-semibold text-green-500">
              {paidOffPercent}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-1 border-t pt-2">
        <button
          onClick={() => onRecordPayment(debt)}
          className="text-muted-foreground hover:text-foreground rounded p-1.5 transition-colors"
          title="Record payment"
        >
          <CircleDollarSign className="h-4 w-4" />
        </button>
        <button
          onClick={() => onEdit(debt)}
          className="text-muted-foreground hover:text-foreground rounded p-1.5 transition-colors"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(debt.id)}
          disabled={isDeleting}
          className="text-muted-foreground hover:text-destructive rounded p-1.5 transition-colors"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create DebtList component**

Create `src/routes/_app/debt-calculator/-components/DebtList.tsx`:

```tsx
import type { Debt } from '@/types/database.types'
import { DebtCard } from './DebtCard'

interface DebtListProps {
  debts: Array<Debt>
  onEdit: (debt: Debt) => void
  onRecordPayment: (debt: Debt) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function DebtList({
  debts,
  onEdit,
  onRecordPayment,
  onDelete,
  isDeleting,
}: DebtListProps) {
  if (debts.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium">No debts tracked yet</p>
        <p className="text-sm">
          Add your first debt to start planning your payoff strategy.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {debts.map((debt) => (
        <DebtCard
          key={debt.id}
          debt={debt}
          onEdit={onEdit}
          onRecordPayment={onRecordPayment}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Verify compilation**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/routes/_app/debt-calculator/-components/DebtCard.tsx src/routes/_app/debt-calculator/-components/DebtList.tsx
git commit -m "feat: add DebtCard and DebtList components"
```

---

### Task 12: Create DebtSummary and PayoffComparison Components

**Files:**

- Create: `src/routes/_app/debt-calculator/-components/DebtSummary.tsx`
- Create: `src/routes/_app/debt-calculator/-components/PayoffComparison.tsx`

- [ ] **Step 1: Create DebtSummary component**

Create `src/routes/_app/debt-calculator/-components/DebtSummary.tsx`:

```tsx
import type { Debt } from '@/types/database.types'
import { cn } from '@/lib/utils'

interface DebtSummaryProps {
  debts: Array<Debt>
}

export function DebtSummary({ debts }: DebtSummaryProps) {
  const totalOwed = debts.reduce((sum, d) => sum + d.current_balance, 0)
  const totalMinimum = debts.reduce((sum, d) => sum + d.minimum_payment, 0)
  const weightedRate =
    totalOwed > 0
      ? debts.reduce(
          (sum, d) => sum + d.interest_rate * (d.current_balance / totalOwed),
          0,
        )
      : 0

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const stats = [
    { label: 'Total Owed', value: formatter.format(totalOwed) },
    { label: 'Avg Rate', value: `${weightedRate.toFixed(1)}%` },
    { label: 'Monthly Min', value: formatter.format(totalMinimum) },
    { label: 'Active Debts', value: String(debts.length) },
  ]

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-4',
        'bg-card text-card-foreground',
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-muted-foreground text-xs">{stat.label}</p>
          <p className="text-lg font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create PayoffComparison component**

Create `src/routes/_app/debt-calculator/-components/PayoffComparison.tsx`:

```tsx
import type { PayoffResult } from '../-lib/payoff-strategies'
import { cn } from '@/lib/utils'

interface PayoffComparisonProps {
  snowball: PayoffResult
  avalanche: PayoffResult
  extraPayment: number
  onExtraPaymentChange: (value: number) => void
  interestSaved: number
}

export function PayoffComparison({
  snowball,
  avalanche,
  extraPayment,
  onExtraPaymentChange,
  interestSaved,
}: PayoffComparisonProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const hasDebts = snowball.debtPayoffOrder.length > 0

  return (
    <div className="bg-card text-card-foreground sticky top-4 flex flex-col gap-4 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">Payoff Comparison</h3>

      <div>
        <label className="text-muted-foreground mb-1 block text-xs">
          Extra Monthly Payment
        </label>
        <input
          type="number"
          min={0}
          step={50}
          value={extraPayment}
          onChange={(e) => onExtraPaymentChange(Number(e.target.value) || 0)}
          className="border-input bg-background w-full rounded-md border px-3 py-1.5 text-sm"
          placeholder="$0"
        />
      </div>

      {!hasDebts ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          Add debts to see payoff strategies
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StrategyColumn
              title="Snowball"
              subtitle="Smallest balance first"
              result={snowball}
              formatter={formatter}
            />
            <StrategyColumn
              title="Avalanche"
              subtitle="Highest rate first"
              result={avalanche}
              formatter={formatter}
            />
          </div>

          {interestSaved > 0 && (
            <p className="bg-muted rounded-md p-2 text-center text-xs">
              Avalanche saves{' '}
              <span className="font-semibold text-green-500">
                {formatter.format(interestSaved)}
              </span>{' '}
              in interest
            </p>
          )}
        </>
      )}
    </div>
  )
}

function StrategyColumn({
  title,
  subtitle,
  result,
  formatter,
}: {
  title: string
  subtitle: string
  result: PayoffResult
  formatter: Intl.NumberFormat
}) {
  const isOverLimit = result.totalMonths >= 360

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Months</span>
          <span className={cn('font-medium', isOverLimit && 'text-red-500')}>
            {isOverLimit ? '30+ yrs' : result.totalMonths}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Interest</span>
          <span className="font-medium">
            {formatter.format(result.totalInterestPaid)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Paid</span>
          <span className="font-medium">
            {formatter.format(result.totalPaid)}
          </span>
        </div>
      </div>
      {result.debtPayoffOrder.length > 0 && (
        <div className="border-t pt-2">
          <p className="text-muted-foreground mb-1 text-xs font-medium">
            Payoff Order
          </p>
          <ol className="flex flex-col gap-0.5">
            {result.debtPayoffOrder.map((d, i) => (
              <li key={d.debtId} className="text-xs">
                {i + 1}. {d.name}{' '}
                <span className="text-muted-foreground">
                  (mo {d.payoffMonth})
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify compilation**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/routes/_app/debt-calculator/-components/DebtSummary.tsx src/routes/_app/debt-calculator/-components/PayoffComparison.tsx
git commit -m "feat: add DebtSummary and PayoffComparison components"
```

---

### Task 13: Create DebtForm and PaymentForm Components

**Files:**

- Create: `src/routes/_app/debt-calculator/-components/DebtForm.tsx`
- Create: `src/routes/_app/debt-calculator/-components/PaymentForm.tsx`

- [ ] **Step 1: Create DebtForm component**

Create `src/routes/_app/debt-calculator/-components/DebtForm.tsx`:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { debtSchema, type DebtFormData } from '@/lib/validations/debt.schema'
import type { Debt } from '@/types/database.types'

const DEBT_TYPE_OPTIONS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'auto_loan', label: 'Auto Loan' },
  { value: 'student_loan', label: 'Student Loan' },
  { value: 'mortgage', label: 'Mortgage' },
] as const

interface DebtFormProps {
  onSubmit: (data: DebtFormData) => void
  selectedDebt: Debt | null
  isPending: boolean
}

export function DebtForm({ onSubmit, selectedDebt, isPending }: DebtFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: selectedDebt
      ? {
          name: selectedDebt.name,
          type: selectedDebt.type,
          principal_amount: selectedDebt.principal_amount,
          interest_rate: selectedDebt.interest_rate,
          current_balance: selectedDebt.current_balance,
          minimum_payment: selectedDebt.minimum_payment,
          start_date: selectedDebt.start_date,
        }
      : {
          type: 'credit_card',
          start_date: new Date().toISOString().split('T')[0],
        },
  })

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{selectedDebt ? 'Edit Debt' : 'Add Debt'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            {...register('name')}
            className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="e.g., Chase Sapphire"
          />
          {errors.name && (
            <p className="text-destructive mt-1 text-xs">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Type</label>
          <select
            {...register('type')}
            className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            {DEBT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Original Amount</label>
            <input
              {...register('principal_amount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.principal_amount && (
              <p className="text-destructive mt-1 text-xs">
                {errors.principal_amount.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Current Balance</label>
            <input
              {...register('current_balance', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.current_balance && (
              <p className="text-destructive mt-1 text-xs">
                {errors.current_balance.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Interest Rate (%)</label>
            <input
              {...register('interest_rate', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.interest_rate && (
              <p className="text-destructive mt-1 text-xs">
                {errors.interest_rate.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Min Payment</label>
            <input
              {...register('minimum_payment', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.minimum_payment && (
              <p className="text-destructive mt-1 text-xs">
                {errors.minimum_payment.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Start Date</label>
          <input
            {...register('start_date')}
            type="date"
            className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          {errors.start_date && (
            <p className="text-destructive mt-1 text-xs">
              {errors.start_date.message}
            </p>
          )}
        </div>

        <DialogFooter>
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? 'Saving...' : selectedDebt ? 'Update' : 'Add Debt'}
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
```

- [ ] **Step 2: Create PaymentForm component**

Create `src/routes/_app/debt-calculator/-components/PaymentForm.tsx`:

```tsx
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  debtPaymentSchema,
  type DebtPaymentFormData,
} from '@/lib/validations/debt.schema'
import type { Debt } from '@/types/database.types'

interface PaymentFormProps {
  debt: Debt
  onSubmit: (data: DebtPaymentFormData) => void
  isPending: boolean
}

export function PaymentForm({ debt, onSubmit, isPending }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DebtPaymentFormData>({
    resolver: zodResolver(debtPaymentSchema),
    defaultValues: {
      amount_paid: debt.minimum_payment,
      payment_date: new Date().toISOString().split('T')[0],
      notes: null,
    },
  })

  const amountPaid = watch('amount_paid')

  const split = useMemo(() => {
    const monthlyInterest =
      debt.current_balance * (debt.interest_rate / 12 / 100)
    const interestPaid = Math.min(monthlyInterest, amountPaid || 0)
    const principalPaid = Math.max((amountPaid || 0) - interestPaid, 0)
    return { interestPaid, principalPaid }
  }, [amountPaid, debt.current_balance, debt.interest_rate])

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Record Payment — {debt.name}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium">Payment Amount</label>
          <input
            {...register('amount_paid', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          {errors.amount_paid && (
            <p className="text-destructive mt-1 text-xs">
              {errors.amount_paid.message}
            </p>
          )}
        </div>

        <div className="bg-muted rounded-md p-3">
          <p className="text-muted-foreground mb-2 text-xs font-medium">
            Estimated Split
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Principal</span>
              <p className="font-medium">
                {formatter.format(split.principalPaid)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Interest</span>
              <p className="font-medium text-red-500">
                {formatter.format(split.interestPaid)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Payment Date</label>
          <input
            {...register('payment_date')}
            type="date"
            className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          {errors.payment_date && (
            <p className="text-destructive mt-1 text-xs">
              {errors.payment_date.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Notes (optional)</label>
          <input
            {...register('notes')}
            className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Optional note"
          />
        </div>

        <DialogFooter>
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? 'Recording...' : 'Record Payment'}
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
```

- [ ] **Step 3: Verify compilation**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/routes/_app/debt-calculator/-components/DebtForm.tsx src/routes/_app/debt-calculator/-components/PaymentForm.tsx
git commit -m "feat: add DebtForm and PaymentForm dialog components"
```

---

### Task 14: Create Barrel Export and Route Entry

**Files:**

- Create: `src/routes/_app/debt-calculator/-components/index.ts`
- Create: `src/routes/_app/debt-calculator/index.tsx`

- [ ] **Step 1: Create barrel export**

Create `src/routes/_app/debt-calculator/-components/index.ts`:

```typescript
export { DebtCard } from './DebtCard'
export { DebtForm } from './DebtForm'
export { DebtList } from './DebtList'
export { DebtSummary } from './DebtSummary'
export { PaymentForm } from './PaymentForm'
export { PayoffComparison } from './PayoffComparison'
```

- [ ] **Step 2: Create the route entry point**

Create `src/routes/_app/debt-calculator/index.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Dialog } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DebtDBProvider } from './-hooks/use-debt-db'
import { useDebts } from './-hooks/use-debts'
import { useDebtMutations } from './-hooks/use-debt-mutations'
import { useDebtDialog } from './-hooks/use-debt-dialog'
import { usePayoffCalculator } from './-hooks/use-payoff-calculator'
import {
  DebtForm,
  DebtList,
  DebtSummary,
  PaymentForm,
  PayoffComparison,
} from './-components'
import type {
  DebtFormData,
  DebtPaymentFormData,
} from '@/lib/validations/debt.schema'

export const Route = createFileRoute('/_app/debt-calculator/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DebtDBProvider>
      <DebtCalculatorPage />
    </DebtDBProvider>
  )
}

function DebtCalculatorPage() {
  // TanStack DB's useQuery returns an array directly (not { data } like TanStack Query)
  const debtList = useDebts() ?? []
  const mutations = useDebtMutations()
  const dialog = useDebtDialog()
  const payoff = usePayoffCalculator(debtList)

  const handleDebtSubmit = (data: DebtFormData) => {
    if (dialog.selectedDebt) {
      mutations.updateDebt(dialog.selectedDebt.id, data)
    } else {
      mutations.createDebt(data)
    }
    dialog.onOpenChange(false)
  }

  const handlePaymentSubmit = (data: DebtPaymentFormData) => {
    if (dialog.selectedDebt) {
      mutations.recordPayment(
        dialog.selectedDebt.id,
        dialog.selectedDebt.current_balance,
        dialog.selectedDebt.interest_rate,
        data,
      )
    }
    dialog.onOpenChange(false)
  }

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Debt Calculator</h1>
        <button
          onClick={() => dialog.openDebtForm()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Debt
        </button>
      </header>

      <DebtSummary debts={debtList} />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <DebtList
            debts={debtList}
            onEdit={(debt) => dialog.openDebtForm(debt)}
            onRecordPayment={(debt) => dialog.openPaymentForm(debt)}
            onDelete={(id) => mutations.deleteDebt(id)}
            isDeleting={mutations.isPending}
          />
        </div>
        <div className="w-full md:w-80">
          <PayoffComparison
            snowball={payoff.snowball}
            avalanche={payoff.avalanche}
            extraPayment={payoff.extraPayment}
            onExtraPaymentChange={payoff.setExtraPayment}
            interestSaved={payoff.interestSaved}
          />
        </div>
      </div>

      <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
        {dialog.mode === 'debt' ? (
          <DebtForm
            onSubmit={handleDebtSubmit}
            selectedDebt={dialog.selectedDebt}
            isPending={mutations.isPending}
          />
        ) : dialog.selectedDebt ? (
          <PaymentForm
            debt={dialog.selectedDebt}
            onSubmit={handlePaymentSubmit}
            isPending={mutations.isPending}
          />
        ) : null}
      </Dialog>
    </section>
  )
}
```

- [ ] **Step 3: Verify compilation**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 4: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/routes/_app/debt-calculator/
git commit -m "feat: assemble debt calculator route with all components and hooks"
```

---

## Chunk 5: Database Migration and Verification

### Task 15: Create SQL Migration

**Files:**

- Create migration via: `npx supabase migration new create_debt_tables` (generates timestamped file in `supabase/migrations/`)
- Or run directly in the Supabase SQL editor

- [ ] **Step 1: Write the migration SQL**

Generate the migration file with `npx supabase migration new create_debt_tables`, then paste the SQL below. Alternatively, run it directly in the Supabase SQL editor:

```sql
-- Create debts table
CREATE TABLE debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit_card', 'personal_loan', 'auto_loan', 'student_loan', 'mortgage')),
  principal_amount NUMERIC(12,2) NOT NULL,
  interest_rate NUMERIC(5,3) NOT NULL,
  current_balance NUMERIC(12,2) NOT NULL CHECK (current_balance >= 0),
  minimum_payment NUMERIC(12,2) NOT NULL,
  start_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_debts_user ON debts(user_id);
CREATE INDEX idx_debts_active ON debts(user_id, is_active);

-- Create debt_payments table
CREATE TABLE debt_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
  amount_paid NUMERIC(12,2) NOT NULL,
  principal_paid NUMERIC(12,2) NOT NULL,
  interest_paid NUMERIC(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_debt_payments_debt ON debt_payments(debt_id);
CREATE INDEX idx_debt_payments_user ON debt_payments(user_id);

-- RLS policies
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own debts" ON debts
  FOR ALL USING ((auth.jwt()->>'sub') = user_id)
  WITH CHECK ((auth.jwt()->>'sub') = user_id);

ALTER TABLE debt_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own debt payments" ON debt_payments
  FOR ALL USING ((auth.jwt()->>'sub') = user_id)
  WITH CHECK ((auth.jwt()->>'sub') = user_id);

-- Atomic payment RPC
CREATE OR REPLACE FUNCTION record_debt_payment(
  p_debt_id UUID,
  p_amount_paid NUMERIC,
  p_principal_paid NUMERIC,
  p_interest_paid NUMERIC,
  p_payment_date DATE,
  p_notes TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO debt_payments (debt_id, user_id, amount_paid, principal_paid, interest_paid, payment_date, notes)
  VALUES (p_debt_id, (auth.jwt()->>'sub'), p_amount_paid, p_principal_paid, p_interest_paid, p_payment_date, p_notes);

  UPDATE debts SET current_balance = GREATEST(current_balance - p_principal_paid, 0), updated_at = now()
  WHERE id = p_debt_id AND user_id = (auth.jwt()->>'sub');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_debt_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER debts_updated_at
  BEFORE UPDATE ON debts
  FOR EACH ROW EXECUTE FUNCTION update_debt_updated_at();

-- Logical replication publication for ElectricSQL
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'electric_debt_pub') THEN
    CREATE PUBLICATION electric_debt_pub FOR TABLE debts, debt_payments;
  END IF;
END $$;
```

- [ ] **Step 2: Run the migration in Supabase**

Run the SQL above in the Supabase SQL editor or via CLI.

- [ ] **Step 3: Commit the migration file**

```bash
git add supabase/migrations/ || true
git commit -m "feat: add database migration for debts and debt_payments tables" || echo "No migration file to commit"
```

---

### Task 16: End-to-End Verification

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (schema validation + payoff strategies)

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run lint/format**

Run: `npm run check`
Expected: No errors

- [ ] **Step 4: Start dev server and verify**

Run: `npm run dev`

Verify in browser:

1. Navigate to `/debt-calculator` — page renders with empty state
2. Click "Add Debt" — form dialog opens
3. Fill in a test debt (e.g., Chase Sapphire, Credit Card, $12000 original, $8240 balance, 19.99% rate, $165 min)
4. Debt appears in the grid with correct stats
5. PayoffComparison shows strategy results
6. Enter extra payment amount — projections update
7. Click record payment icon on a card — payment form opens with split preview
8. Edit and delete work

- [ ] **Step 5: Final commit**

```bash
git add src/ docker-compose.yml
git commit -m "feat: complete debt calculator module with TanStack DB + ElectricSQL"
```
