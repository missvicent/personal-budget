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
  item_id: string
  category_id: string
  amount: number
  alert_enabled: boolean
  alert_threshold: number
  category_name: string
  category_type: string
  category_color: string
  category_icon: string
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

export interface BudgetItem {
  id: string
  budget_id: string
  budget_name: string
  budget_amount: number
  amount: number
  category_name: string
  category_icon: string
  category_color: string
  created_at: string
  updated_at: string
  alert_enabled: boolean
  alert_threshold: number
}
