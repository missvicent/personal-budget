export interface Profile {
  avatarUrl: string
  createdAt: string
  email: string
  fullName: string
  id: string
  updatedAt: string
  userId: string
}

export interface Account {
  balance: number
  color: string
  created_at: string
  currency: string
  icon: string
  id: string
  initial_balance: number
  is_active: boolean
  name: string
  type: 'checking' | 'savings' | 'credit' | 'cash'
  updated_at: string
  user_id: string
}

export interface Category {
  color: string
  created_at: string
  display_order: number
  icon: string
  id: string
  is_system: boolean
  name: string
  parent_id: string | null
  type: 'income' | 'expense'
  updated_at: string
  user_id: string
}

export interface Transaction {
  account_id?: string
  amount: number
  category_id: string
  created_at: string
  description: string
  id: string
  merchant?: string
  transaction_date: string
  type: 'income' | 'expense' | 'transfer'
  updated_at: string
  user_id: string
}

export interface Budget {
  alert_enabled: boolean
  alert_threshold: number
  amount: number
  category_id: string
  created_at: string
  end_date: string | null
  id: string
  is_active: boolean
  name: string
  period: 'weekly' | 'monthly' | 'yearly'
  start_date: string
  updated_at: string
  user_id: string
}

// Helper types for create/update operations
export type CreateAccount = Omit<Account, 'id' | 'created_at' | 'updated_at'>
export type UpdateAccount = Partial<
  Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

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
