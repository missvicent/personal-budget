import type { Profile } from '@/types/database.types'
import type { TablesInsert } from '@/lib/supabase/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const profilesService = {
  get: async (
    userId: string,
    supabase: SupabaseClient,
  ): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },
  create: async (
    profile: TablesInsert<'profiles'>,
    supabase: SupabaseClient,
  ): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'clerk_user_id' })
      .select()
      .single()
    if (error) throw error
    return data
  },
}
