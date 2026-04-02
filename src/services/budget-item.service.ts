import type { BudgetItem } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const budgetItemService = {
  create: async (
    budgetItem: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>,
    supabase: SupabaseClient,
  ): Promise<BudgetItem> => {
    const { data, error } = await supabase
      .from('budget_items')
      .insert(budgetItem)
      .select()
      .single()
    if (error) throw new Error(`Failed to create budget item: ${error.message}`)
    return data
  },
  delete: async (id: string, supabase: SupabaseClient): Promise<void> => {
    const { error } = await supabase.from('budget_items').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete budget item: ${error.message}`)
  },
  update: async (
    id: string,
    budgetItem: Partial<BudgetItem>,
    supabase: SupabaseClient,
  ): Promise<BudgetItem> => {
    const { data, error } = await supabase
      .from('budget_items')
      .update(budgetItem)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update budget item: ${error.message}`)
    return data
  },
}
