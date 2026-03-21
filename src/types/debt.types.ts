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

export type CreateDebt = Omit<
  Debt,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>
export type UpdateDebt = Partial<
  Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>
