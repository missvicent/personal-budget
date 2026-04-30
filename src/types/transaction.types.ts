import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/types'

// type is stored as text + CHECK; narrow back to the union for ergonomics.
export type TransactionType = 'income' | 'expense'

export type Transaction = Tables<'transactions'> & { type: TransactionType }
export type CreateTransaction = TablesInsert<'transactions'>
export type UpdateTransaction = TablesUpdate<'transactions'>

// Domain projection — output of joined fetch with categories.
export interface TransactionWithCategory {
  amount: number
  budget_id?: string
  category_id: string
  category_type: TransactionType
  color: string
  description: string
  icon: string
  id: string
  is_recurring?: boolean
  name: string
  transaction_date: string
}

// UI filter shape — not a row.
export interface TransactionFilters {
  accountId?: string
  categoryId?: string
  endDate?: string
  page?: number
  pageSize?: number
  startDate?: string
  type?: TransactionType
}

// Generic pagination wrapper — not a row.
export interface PaginatedResponse<T> {
  data: Array<T>
  hasMore: boolean
  total: number
}
