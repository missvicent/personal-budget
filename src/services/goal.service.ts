import type { Goal, GoalWithProgress } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const goalService = {
  getAllWithProgress: async (
    supabase: SupabaseClient,
  ): Promise<Array<GoalWithProgress>> => {
    const { data, error } = await supabase.rpc('get_goals_with_progress')
    if (error) throw new Error(`Failed to fetch goals: ${error.message}`)
    return data
  },

  create: async (
    goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>,
    supabase: SupabaseClient,
  ): Promise<Goal> => {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single()
    if (error) throw new Error(`Failed to create goal: ${error.message}`)
    return data
  },

  update: async (
    id: string,
    goal: Partial<Goal>,
    supabase: SupabaseClient,
  ): Promise<Goal> => {
    const { data, error } = await supabase
      .from('goals')
      .update(goal)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update goal: ${error.message}`)
    return data
  },

  delete: async (id: string, supabase: SupabaseClient): Promise<void> => {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete goal: ${error.message}`)
  },
}
