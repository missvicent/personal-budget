# Debt Calculator Module — Design Spec

## Context

The personal budget app needs a debt calculator module for tracking debts and planning payoff strategies. This module introduces TanStack DB + ElectricSQL as the data layer — scoped only to this module — while the rest of the app remains on TanStack Query + Supabase.

The goal is twofold: (1) give users a tool to track consumer debts and compare payoff strategies (snowball vs avalanche), and (2) prove out TanStack DB + ElectricSQL as a reactive sync alternative that could be adopted by other modules later.

## Architecture: Route-Scoped TanStack DB

### Approach

TanStack DB + ElectricSQL is scoped only to the debt calculator route. A `DebtDBProvider` wraps the route content — sync starts on mount, stops on unmount.

- **Reads**: ElectricSQL streams changes from Postgres WAL → TanStack DB collections → `useLiveQuery` → React
- **Writes**: React → `debtService` → Supabase client (with Clerk JWT + RLS) → Postgres
- **Sync loop**: Writes hit Postgres via Supabase; ElectricSQL picks up changes from WAL and streams them back to TanStack DB

### Coexistence with TanStack Query

The two systems are fully independent:

| Concern    | TanStack Query (existing)           | TanStack DB (debt module)               |
| ---------- | ----------------------------------- | --------------------------------------- |
| Data       | Budgets, expenses, transactions     | Debts, debt payments                    |
| Read path  | Supabase REST via `useAuthQuery`    | ElectricSQL HTTP shape stream           |
| Write path | Supabase REST via `useAuthMutation` | Supabase REST via `useSupabase()`       |
| Reactivity | `queryClient.invalidateQueries()`   | Automatic via ElectricSQL WAL streaming |
| Provider   | Global `QueryClientProvider`        | Route-scoped `DebtDBProvider`           |

No shared tables, no conflicts.

## Infrastructure

### ElectricSQL Docker Service

New service in `docker-compose.yml`:

```yaml
electric:
  image: electricsql/electric:latest
  ports:
    - '3001:3000'
  environment:
    DATABASE_URL: '${SUPABASE_DB_URL}'
```

Requires:

- `SUPABASE_DB_URL` env var: direct Postgres connection string from Supabase dashboard
- `VITE_ELECTRIC_URL=http://localhost:3001` env var for the client
- Postgres logical replication publication for debt tables

### Security: User-Scoped Shape Streams

ElectricSQL connects to Postgres via `DATABASE_URL` (service role), which bypasses RLS. Data isolation is enforced client-side via the `where` clause on shape streams:

```typescript
new ShapeStream({
  url: `${electricUrl}/v1/shape`,
  table: 'debts',
  where: `user_id = '${userId}'`, // Scoped to authenticated user
})
```

This ensures each client only receives rows belonging to the authenticated Clerk user. The `userId` comes from Clerk's `useAuth()` hook. While this is not as robust as server-side RLS enforcement, it is the standard ElectricSQL pattern for user-scoped data. For additional hardening in production, an Electric proxy middleware could validate Clerk JWTs and inject the `where` clause server-side.

### Database Tables

**`debts`**

| Column           | Type          | Notes                                                         |
| ---------------- | ------------- | ------------------------------------------------------------- |
| id               | UUID (PK)     | `gen_random_uuid()`                                           |
| user_id          | TEXT          | Clerk user ID                                                 |
| name             | TEXT          | e.g., "Chase Sapphire"                                        |
| type             | TEXT          | credit_card, personal_loan, auto_loan, student_loan, mortgage |
| principal_amount | NUMERIC(12,2) | Original amount                                               |
| interest_rate    | NUMERIC(5,3)  | Annual rate                                                   |
| current_balance  | NUMERIC(12,2) | Current balance                                               |
| minimum_payment  | NUMERIC(12,2) | Required monthly minimum                                      |
| start_date       | DATE          | When debt began                                               |
| is_active        | BOOLEAN       | Default true                                                  |
| created_at       | TIMESTAMPTZ   | Auto                                                          |
| updated_at       | TIMESTAMPTZ   | Auto                                                          |

**`debt_payments`**

| Column         | Type          | Notes                        |
| -------------- | ------------- | ---------------------------- |
| id             | UUID (PK)     | `gen_random_uuid()`          |
| debt_id        | UUID (FK)     | References debts.id, CASCADE |
| user_id        | TEXT          | Clerk user ID                |
| amount_paid    | NUMERIC(12,2) | Total payment                |
| principal_paid | NUMERIC(12,2) | Portion to principal         |
| interest_paid  | NUMERIC(12,2) | Portion to interest          |
| payment_date   | DATE          | When payment was made        |
| notes          | TEXT          | Optional                     |
| created_at     | TIMESTAMPTZ   | Auto                         |

RLS on both tables: `(auth.jwt()->>'sub') = user_id` for all operations.

Logical replication publication:

```sql
CREATE PUBLICATION electric_debt_pub FOR TABLE debts, debt_payments;
```

## Data Model (TypeScript)

Added to `src/types/database.types.ts`:

```typescript
type DebtType =
  | 'credit_card'
  | 'personal_loan'
  | 'auto_loan'
  | 'student_loan'
  | 'mortgage'

interface Debt {
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

interface DebtPayment {
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
```

## Module Structure

```
src/
  lib/
    tanstack-db.ts                              # TanStack DB instance factory
    validations/debt.schema.ts                  # Zod schemas + payload transforms (see Validation section)
  services/
    debt.service.ts                             # Supabase write operations (CRUD)
  routes/_app/debt-calculator/
    index.tsx                                   # Route entry, wraps with DebtDBProvider
    -components/
      DebtForm.tsx                              # Create/edit debt dialog
      DebtCard.tsx                              # Individual debt (icon + stats grid)
      DebtList.tsx                              # Grid of DebtCards
      DebtSummary.tsx                           # Aggregate stats bar
      PayoffComparison.tsx                      # Snowball vs avalanche side-by-side
      PaymentForm.tsx                           # Record payment dialog
      index.ts                                  # Barrel export
    -hooks/
      use-debt-db.ts                            # DebtDBProvider + useDebtDB context hook
      use-debts.ts                              # Live query for debts collection
      use-debt-payments.ts                      # Live query for payments collection
      use-debt-mutations.ts                     # Optimistic writes via Supabase
      use-debt-dialog.ts                        # Dialog state management
      use-payoff-calculator.ts                  # Wraps pure calc functions in useMemo
    -lib/
      payoff-strategies.ts                      # Pure snowball/avalanche/projection functions
```

Key differences from existing modules:

- No domain hooks in `src/hooks/` — TanStack DB logic is route-scoped
- No query keys — TanStack DB uses live queries
- New `-lib/` folder for pure calculation functions

## Validation Schemas (`debt.schema.ts`)

```typescript
const debtSchema = z.object({
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

// debt_id is injected by the mutation hook from the card context, not part of the form
const debtPaymentSchema = z.object({
  amount_paid: z.number().min(0.01, 'Payment must be greater than 0'),
  payment_date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500).nullable().optional(),
})
```

Each schema includes a `toPayload()` transform function following the pattern in `budget.schema.ts`.

## TanStack DB Configuration (`tanstack-db.ts`)

Factory function that creates a scoped TanStack DB instance:

```typescript
function createDebtDB(electricUrl: string, userId: string): TanStackDB {
  // Creates two collections: debts and debtPayments
  // Each collection has:
  //   - primaryKey: 'id'
  //   - sync: ShapeStream from ElectricSQL scoped by userId
  // Returns the DB instance with .collections.debts and .collections.debtPayments
}
```

**Lifecycle** (managed by `DebtDBProvider`):

- On mount: create instance via `createDebtDB(electricUrl, userId)`, starts shape streams
- On unmount: call `db.close()` to stop shape streams and clean up
- On userId change (logout/login): recreate instance with new userId scope

## UI Layout

**Side-by-side layout:**

- Top: `DebtSummary` bar (total owed, weighted avg rate, total monthly minimums)
- Left: `DebtList` grid of `DebtCard` components
- Right: `PayoffComparison` panel (sticky, always visible)

**Responsive behavior:** On mobile viewports (< 768px), the layout stacks vertically: summary → debt cards (single column) → payoff comparison. Follows the same responsive patterns used by existing route modules.

**DebtCard design** — Icon + Stats Grid:

- Header: debt type icon + name on left, balance on right
- Footer: 3-column stat grid (APR, min payment, % paid off)
- Actions: edit, record payment, delete

## Payoff Calculator

### Pure Functions (`payoff-strategies.ts`)

**Inputs:**

- Array of debts (balance, interest rate, minimum payment)
- Extra monthly payment amount (default $0)

**Snowball:** Sort by balance ascending → pay minimums on all → apply extra to smallest balance → roll freed payments into next smallest.

**Avalanche:** Sort by interest rate descending → pay minimums on all → apply extra to highest rate → roll freed payments into next highest rate.

**Edge cases:**

- 0% interest rate debts: treated normally, just no interest accumulation
- Minimum payment exceeds current balance: cap payment at current balance
- Extra payment of $0: equivalent to minimum-only payoff timeline
- Single debt: both strategies produce identical results (no ordering difference)
- Loop termination: cap at 360 months (30 years). If payoff exceeds this, show "payoff exceeds 30 years" message

**Output per strategy:**

```typescript
interface PayoffResult {
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
```

### PayoffComparison Component

- Extra monthly payment input at the top
- Two columns: Snowball result vs Avalanche result
- Each shows: total months, total interest, total paid, payoff order
- Highlights savings difference between strategies

## Payment Recording

**Flow:**

1. User clicks "Record Payment" on a debt card
2. `PaymentForm` opens, pre-filled with minimum payment
3. User enters: amount, date, optional notes
4. Auto-calculated split shown before submit (simplified monthly interest approximation):
   - `interest_paid = current_balance * (annual_rate / 12 / 100)`
   - `principal_paid = amount_paid - interest_paid`
   - Note: this is a simplified calculation. It does not account for daily compounding (credit cards) or amortization schedules (installment loans). This is acceptable for a budgeting tool — the goal is approximate tracking, not accounting-grade precision.
5. On submit: optimistic insert into `debtPayments` + update `current_balance` on the debt
6. Payoff comparison recalculates automatically via live queries

## Optimistic Mutations

The `use-debt-mutations.ts` hook exposes:

```typescript
interface DebtMutations {
  createDebt: (data: DebtFormData) => Promise<void>
  updateDebt: (id: string, data: Partial<DebtFormData>) => Promise<void>
  deleteDebt: (id: string) => Promise<void>
  recordPayment: (debtId: string, data: PaymentFormData) => Promise<void>
}
```

Each mutation follows this pattern:

1. Generate a temp ID (for creates) and apply change to the TanStack DB collection via its local mutation API
2. Send write to Supabase via `debtService`
3. ElectricSQL syncs the confirmed row back from Postgres WAL, replacing the optimistic entry
4. On error: rollback the local change (remove optimistic insert or restore previous value) and show toast via the existing global error handler

### Atomic Payment + Balance Update

`recordPayment` requires two writes: insert into `debt_payments` and update `current_balance` on `debts`. This is handled via a Supabase RPC (database function) to ensure atomicity:

```sql
CREATE FUNCTION record_debt_payment(
  p_debt_id UUID, p_amount_paid NUMERIC, p_principal_paid NUMERIC,
  p_interest_paid NUMERIC, p_payment_date DATE, p_notes TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO debt_payments (debt_id, user_id, amount_paid, principal_paid, interest_paid, payment_date, notes)
  VALUES (p_debt_id, (auth.jwt()->>'sub'), p_amount_paid, p_principal_paid, p_interest_paid, p_payment_date, p_notes);

  UPDATE debts SET current_balance = GREATEST(current_balance - p_principal_paid, 0), updated_at = now()
  WHERE id = p_debt_id AND user_id = (auth.jwt()->>'sub');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Navigation

Add to `src/config/navigation.ts`:

```typescript
{
  title: 'Debt Calculator',
  url: '/debt-calculator',
  description: 'Track debts and plan payoff strategies',
  icon: Calculator,  // from lucide-react
}
```

## New Dependencies

```
@tanstack/db
@tanstack/react-db
@electric-sql/client
```
