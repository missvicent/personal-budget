import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/types'

// DebtType is a TS union here because the DB stores it as text with a CHECK
// constraint, not a Postgres enum. Generated types type the column as
// `string`; we narrow back to the union for consumer ergonomics.
export type DebtType =
  | 'credit_card'
  | 'personal_loan'
  | 'auto_loan'
  | 'student_loan'
  | 'mortgage'

export type Debt = Tables<'debts'> & { type: DebtType }
export type DebtPayment = Tables<'debt_payments'>
export type CreateDebt = TablesInsert<'debts'>
export type UpdateDebt = TablesUpdate<'debts'>
