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
  category_type: 'income' | 'expense'
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
  amount: number
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

export interface UserSettings {
  user_id: string
  dark_mode: boolean
  created_at: string
  updated_at: string
}

export type DebtType =
  | 'credit_card'
  | 'personal_loan'
  | 'auto_loan'
  | 'student_loan'
  | 'mortgage'

export interface Debt {
  id: string
  user_id: string
  name: string
  type: DebtType
  principal_amount: number
  interest_rate: number
  current_balance: number
  minimum_payment: number
  start_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DebtPayment {
  id: string
  debt_id: string
  user_id: string
  amount_paid: number
  principal_paid: number
  interest_paid: number
  payment_date: string
  notes: string | null
  created_at: string
}

export type CreateDebt = Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type UpdateDebt = Partial<Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
