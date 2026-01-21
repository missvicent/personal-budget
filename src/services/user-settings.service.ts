import type { UserSettings } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const userSettingsService = {
  get: async (
    userId: string,
    supabase: SupabaseClient,
  ): Promise<UserSettings> => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error) throw error
    return data
  },
  upsert: async (
    userId: string,
    settings: any,
    supabase: SupabaseClient,
  ): Promise<UserSettings> => {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(settings)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
