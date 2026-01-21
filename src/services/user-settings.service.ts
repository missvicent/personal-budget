import type { UserSettings } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const userSettingsService = {
  get: async (supabase: SupabaseClient): Promise<UserSettings> => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .single()
    if (error) throw error
    return data
  },
  upsert: async (
    settings: any,
    supabase: SupabaseClient,
  ): Promise<UserSettings> => {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(settings)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
