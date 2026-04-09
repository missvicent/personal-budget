export interface Goal {
  id?: string
  user_id?: string
  name: string
  target_amount: number
  current_amount?: number
  target_date?: string | null
  category?: string | null
  notes?: string | null
  is_achieved?: boolean
  achieved_date?: string | null
  created_at?: string
  updated_at?: string
}

export interface GoalWithProgress extends Goal {
  id: string
  current_amount: number
  budget_contributions: number
  direct_contributions: number
}
