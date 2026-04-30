import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export type Goal = Tables<'goals'>
export type CreateGoal = TablesInsert<'goals'>
export type UpdateGoal = TablesUpdate<'goals'>

// Domain projection — output of get_goals_with_progress RPC, not a raw row.
export interface GoalWithProgress extends Goal {
  current_amount: number
  budget_contributions: number
  direct_contributions: number
}
