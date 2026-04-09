export interface Budget {
  amount: number
  created_at?: string
  end_date?: string | null
  id?: string
  is_active: boolean
  name: string
  period: 'monthly' | 'yearly' | undefined
  start_date: string
  updated_at?: string
}

export interface BudgetWithProgress {
  budget_id: string
  budget_name: string
  budget_amount: number
  period: 'monthly' | 'yearly'
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

export interface BudgetOverview {
  budget_id: string
  budget_name: string
  budget_amount: number
  period: 'monthly' | 'yearly'
  start_date: string
  end_date: string | null
  is_active: boolean
  total_spent: number
}

export interface Allocation {
  id?: string
  budget_id: string
  category_id?: string | null
  goal_id?: string | null
  amount: number
  alert_enabled?: boolean
  alert_threshold?: number
  created_at?: string
  updated_at?: string
}
