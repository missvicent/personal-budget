import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/types'

// Period is stored as text + CHECK constraint, not a Postgres enum.
// Generated types type it as `string`; we narrow back to the union.
export type BudgetPeriod = 'monthly' | 'yearly'

export type Budget = Tables<'budgets'> & { period: BudgetPeriod }
export type CreateBudget = TablesInsert<'budgets'>
export type UpdateBudget = TablesUpdate<'budgets'>

export type Allocation = Tables<'allocations'>
export type CreateAllocation = TablesInsert<'allocations'>
export type UpdateAllocation = TablesUpdate<'allocations'>

// Domain projection — output of get_budgets_with_progress RPC, joins
// budgets + allocations + categories + goals.
export interface BudgetWithProgress {
  budget_id: string
  budget_name: string
  budget_amount: number
  period: BudgetPeriod
  start_date: string
  end_date: string | null
  is_active: boolean
  allocation_id: string
  category_id: string | null
  goal_id: string | null
  amount: number
  alert_enabled: boolean
  alert_threshold: number
  category_name: string | null
  category_type: string | null
  category_color: string | null
  category_icon: string | null
  goal_name: string | null
  progress: number
}

// Domain projection — output of get_budgets_overview RPC.
export interface BudgetOverview {
  budget_id: string
  budget_name: string
  budget_amount: number
  period: BudgetPeriod
  start_date: string
  end_date: string | null
  is_active: boolean
  total_spent: number
}
