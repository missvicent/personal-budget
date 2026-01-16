export interface Profile {
  id: string
  userId: string
  email: string
  fullName: string
  avatarUrl: string
  createdAt: string
  updatedAt: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'cash'
  balance: number
  initial_balance: number
  currency: string
  color: string
  icon: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
  parent_id: string | null
  is_system: boolean
  display_order: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  category_id: string
  type: 'income' | 'expense' | 'transfer'
  amount: number
  description: string
  merchant: string
  transaction_date: string
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  name: string
  category_id: string
  amount: number
  period: 'weekly' | 'monthly' | 'yearly'
  start_date: string
  end_date: string | null
  alert_enabled: boolean
  alert_threshold: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Helper types for create/update operations
export type CreateAccount = Omit<Account, 'id' | 'created_at' | 'updated_at'>
export type UpdateAccount = Partial<
  Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

export interface TransactionFilters {
  accountId?: string
  categoryId?: string
  type?: 'income' | 'expense'
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

export interface PaginatedResponse<T> {
  data: Array<T>
  hasMore: boolean
  total: number
}
