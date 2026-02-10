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
  id?: string
  user_id?: string
  account_id?: string | null
  category_id: string | null
  type: 'income' | 'expense'
  amount: number
  description: string | null
  merchant?: string | null
  transaction_date: Date | string
  created_at?: string | null
  updated_at?: string | null
  recurring_id?: string | null
  note?: string | null
  is_recurring?: boolean | null
  tags?: Array<string> | null
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

export interface TransactionWithCategory {
  id: string
  amount: number
  category_name: string
  category_type: 'income' | 'expense'
  icon: string
  color: string
  description: string
  transaction_date: string
}

export interface UserSettings {
  user_id: string
  dark_mode: boolean
  created_at: string
  updated_at: string
}
