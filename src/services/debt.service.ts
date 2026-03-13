import type { CreateDebt, Debt, UpdateDebt } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const debtService = {
  getAll: async (supabase: SupabaseClient): Promise<Array<Debt>> => {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (error) throw new Error(`Failed to fetch debts: ${error.message}`)
    return data
  },

  create: async (
    debt: CreateDebt,
    supabase: SupabaseClient,
  ): Promise<Debt> => {
    const { data, error } = await supabase
      .from('debts')
      .insert(debt)
      .select()
      .single()
    if (error) throw new Error(`Failed to create debt: ${error.message}`)
    return data
  },

  update: async (
    id: string,
    debt: UpdateDebt,
    supabase: SupabaseClient,
  ): Promise<Debt> => {
    const { data, error } = await supabase
      .from('debts')
      .update(debt)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update debt: ${error.message}`)
    return data
  },

  delete: async (id: string, supabase: SupabaseClient): Promise<void> => {
    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', id)
    if (error) throw new Error(`Failed to delete debt: ${error.message}`)
  },

  recordPayment: async (
    params: {
      p_debt_id: string
      p_amount_paid: number
      p_principal_paid: number
      p_interest_paid: number
      p_payment_date: string
      p_notes: string | null
    },
    supabase: SupabaseClient,
  ): Promise<void> => {
    const { error } = await supabase.rpc('record_debt_payment', params)
    if (error)
      throw new Error(`Failed to record payment: ${error.message}`)
  },
}
