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

export type CreateAccount = Omit<Account, 'id' | 'created_at' | 'updated_at'>
export type UpdateAccount = Partial<
  Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>
