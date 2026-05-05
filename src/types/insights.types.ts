export type AnomalyType =
  | 'spike'
  | 'new_category'
  | 'category_removed'
  | 'budget_exceeded'
  | 'large_single'
  | 'large_multiple'
  | 'large_average'
  | 'large_total'
  | 'large_count'
  | 'large_percentage'
  | 'large_average_percentage'
  | 'large_total_percentage'
  | 'large_count_percentage'

export type AnomalySeverity = 'low' | 'medium' | 'high'

export type PatternType =
  | 'weekend_spend'
  | 'recurring_charge'
  | 'category_shift'
  | 'streak'

export interface CategoryBreakdown {
  category_id: string
  category_name: string
  icon: string | null
  color: string | null
  total: number
  transaction_count: number
  pct_of_total: number
  budget_limit: number | null
  budget_used_pct: number | null
}

export interface Anomaly {
  id: string
  type: AnomalyType
  category_name: string | null
  icon: string | null
  color: string | null
  message: string
  severity: AnomalySeverity
  amount: number | null
}

export interface Pattern {
  id: string
  type: PatternType
  category_name: string | null
  message: string
  data: Record<string, unknown>
}

export interface GoalProgress {
  goal_id: string
  name: string
  target_amount: number
  current_amount: number
  progress_pct: number
  days_remaining: number
  on_track: boolean
}

export interface DebtSummary {
  total_debt: number
  monthly_obligations: number
  highest_rate: number
  debt_names: Array<string>
}

export interface InsightSummary {
  budget_id: string
  budget_name: string

  period_label: string
  total_income: number
  total_expenses: number
  net: number
  savings_rate?: number | null

  expenses_change_pct?: number | null
  income_change_pct?: number | null

  category_breakdown: Array<CategoryBreakdown>
  anomalies: Array<Anomaly>
  patterns: Array<Pattern>
  goals: Array<GoalProgress>
  debt?: DebtSummary | null

  transaction_count: number
  recurring_count: number
  next_action_horizon_days?: number | null
}

export interface InsightsResponse {
  summary: InsightSummary
}

export interface AIRecommendation {
  insights: string
  problems: string
  recommendations: string
  one_action: string
}

export interface AIInsightsResponse {
  summary: InsightSummary
  ai: AIRecommendation
}
