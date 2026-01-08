import type {
  Account,
  CreateAccount,
  UpdateAccount,
} from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const accountService = {
  getAll: async (supabase: SupabaseClient): Promise<Array<Account>> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
  getById: async (id: string, supabase: SupabaseClient): Promise<Account> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },
  create: async (
    account: CreateAccount,
    supabase: SupabaseClient,
  ): Promise<Account> => {
    const { data, error } = await supabase
      .from('accounts')
      .insert(account)
      .select()
      .single()
    if (error) throw error
    return data
  },
  update: async (
    id: string,
    account: UpdateAccount,
    supabase: SupabaseClient,
  ): Promise<Account> => {
    const { data, error } = await supabase
      .from('accounts')
      .update(account)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
  delete: async (id: string, supabase: SupabaseClient): Promise<void> => {
    const { error } = await supabase.from('accounts').delete().eq('id', id)
    if (error) throw error
  },
}
