export interface Transaction {
  account_id?: string | null
  amount: number
  budget_id?: string | null
  category_id: string | null
  created_at?: string | null
  description: string | null
  goal_id?: string | null
  id?: string
  is_recurring?: boolean | null
  merchant?: string | null
  note?: string | null
  recurring_id?: string | null
  tags?: Array<string> | null
  transaction_date: Date | string
  type: 'income' | 'expense'
  updated_at?: string | null
  user_id?: string
}

export interface TransactionWithCategory {
  amount: number
  budget_id?: string
  category_id: string
  category_type: 'income' | 'expense'
  color: string
  description: string
  icon: string
  id: string
  is_recurring?: boolean
  name: string
  transaction_date: string
}

export interface TransactionFilters {
  accountId?: string
  categoryId?: string
  endDate?: string
  page?: number
  pageSize?: number
  startDate?: string
  type?: 'income' | 'expense'
}

export interface PaginatedResponse<T> {
  data: Array<T>
  hasMore: boolean
  total: number
}
