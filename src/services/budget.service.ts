import type {
  Budget,
  BudgetOverview,
  BudgetWithProgress,
  CreateBudget,
  UpdateBudget,
} from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const budgetService = {
  getOverview: async (
    supabase: SupabaseClient,
  ): Promise<Array<BudgetOverview>> => {
    const { data, error } = await supabase.rpc('get_budgets_overview')
    if (error)
      throw new Error(`Failed to fetch budget overview: ${error.message}`)
    return data
  },
  getAllWithProgress: async (
    supabase: SupabaseClient,
  ): Promise<Array<BudgetWithProgress>> => {
    const { data, error } = await supabase.rpc('get_budgets_with_progress')
    if (error) throw new Error(`Failed to fetch budgets: ${error.message}`)
    return data
  },
  create: async (
    budget: CreateBudget,
    supabase: SupabaseClient,
  ): Promise<Budget> => {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select()
      .single()
    if (error) throw new Error(`Failed to create budget: ${error.message}`)
    return data
  },
  delete: async (id: string, supabase: SupabaseClient): Promise<void> => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete budget: ${error.message}`)
  },
  update: async (
    id: string,
    budget: UpdateBudget,
    supabase: SupabaseClient,
  ): Promise<Budget> => {
    const { data, error } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update budget: ${error.message}`)
    return data
  },
}
