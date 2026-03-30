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
}
