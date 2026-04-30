import type {
  Allocation,
  CreateAllocation,
  UpdateAllocation,
} from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const allocationService = {
  create: async (
    allocation: CreateAllocation,
    supabase: SupabaseClient,
  ): Promise<Allocation> => {
    const { data, error } = await supabase
      .from('allocations')
      .insert(allocation)
      .select()
      .single()
    if (error) throw new Error(`Failed to create allocation: ${error.message}`)
    return data
  },
  delete: async (
    budgetId: string,
    id: string,
    supabase: SupabaseClient,
  ): Promise<void> => {
    const { error } = await supabase
      .from('allocations')
      .delete()
      .eq('budget_id', budgetId)
      .eq('id', id)
    if (error) throw new Error(`Failed to delete allocation: ${error.message}`)
  },
  update: async (
    id: string,
    allocation: UpdateAllocation,
    supabase: SupabaseClient,
  ): Promise<Allocation> => {
    const { data, error } = await supabase
      .from('allocations')
      .update(allocation)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update allocation: ${error.message}`)
    return data
  },
}
