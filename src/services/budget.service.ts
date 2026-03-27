import type { Budget, BudgetItem, BudgetOverview } from '@/types/database.types'
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
  getBudgetItemsByBudgetId: async (
    budgetId: string,
    supabase: SupabaseClient,
  ): Promise<Array<BudgetItem>> => {
    const { data, error } = await supabase
      .from('budget_items')
      .select('*, categories(name, icon, color), budgets(name, amount)')
      .eq('budget_id', budgetId)
    if (error) throw new Error(`Failed to fetch budget items: ${error.message}`)
    return data.map((item) => ({
      id: item.id,
      budget_id: item.budget_id,
      budget_name: item.budgets.name,
      budget_amount: item.budgets.amount,
      amount: item.amount,
      category_name: item.categories.name,
      category_icon: item.categories.icon,
      category_color: item.categories.color,
      created_at: item.created_at,
      updated_at: item.updated_at,
      alert_enabled: item.alert_enabled,
      alert_threshold: item.alert_threshold,
    }))
  },
  getAllWithProgress: async (
    supabase: SupabaseClient,
  ): Promise<Array<Budget & { progress: number }>> => {
    const { data, error } = await supabase.rpc('get_budgets_with_progress')
    if (error) throw new Error(`Failed to fetch budgets: ${error.message}`)
    return data
  },
  create: async (
    budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>,
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
    budget: Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at'>>,
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
