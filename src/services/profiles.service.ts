import type { Profile } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const profilesService = {
  get: async (userId: string, supabase: SupabaseClient): Promise<any> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },
  create: async (profile: Profile, supabase: SupabaseClient): Promise<any> => {
    const { userId, email, fullName, avatarUrl } = profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          clerk_user_id: userId,
          email: email,
          full_name: fullName,
          avatar_url: avatarUrl,
        },
        { onConflict: 'clerk_user_id' },
      )
      .select()
      .single()
    if (error) throw error
    return data
  },
}
