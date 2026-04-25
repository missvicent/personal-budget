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
// Placeholder — refine when backend schema is defined
export interface CategoryBreakdown {}

// Placeholder — refine when backend schema is defined
export interface Anomaly {
  amount: number | null
  category_name: string | null
  color: string | null
  icon: string | null
  id: string
  message: string
  severity: AnomalySeverity
  type: AnomalyType
}

// Placeholder — refine when backend schema is defined
export interface Pattern {}

// Placeholder — refine when backend schema is defined
export interface GoalProgress {}

// Placeholder — refine when backend schema is defined
export interface DebtSummary {}

export interface InsightSummary {
  budgetId: string
  budgetName: string

  periodLabel: string
  totalIncome: number
  totalExpenses: number
  net: number
  savingsRate?: number | null

  expensesChangePct?: number | null
  incomeChangePct?: number | null

  categoryBreakdown: Array<CategoryBreakdown>
  anomalies: Array<Anomaly>
  patterns: Array<Pattern>
  goals: Array<GoalProgress>
  debt?: DebtSummary | null

  transactionCount: number
  recurringCount: number
}

export interface InsightsResponse {
  summary: InsightSummary
}

export interface AIRecommendation {
  insights: string
  problems: string
  recommendations: string
  oneAction: string
}

export interface AIInsightsResponse {
  summary: InsightSummary
  ai: AIRecommendation
}
