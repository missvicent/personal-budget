import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserSettings } from '@/types/database.types'
import { userSettingsService } from '@/services/user-settings.service'

const queryKeys = {
  userSettings: () => ['user_settings'],
  userSetting: (userId: string) => ['user_settings', userId],
}
export const useUserSetting = (userId: string, supabase: SupabaseClient) => {
  return useQuery<UserSettings>({
    queryKey: queryKeys.userSettings(),
    queryFn: () => userSettingsService.get(userId, supabase),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const useUpdateUserSetting = (
  userId: string,
  settings: Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>,
  supabase: SupabaseClient,
) => {
  const queryClient = useQueryClient()
  return useMutation<
    UserSettings,
    Error,
    Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>
  >({
    mutationFn: () => userSettingsService.upsert(userId, settings, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userSettings() })
      queryClient.setQueryData(
        queryKeys.userSettings(),
        (old: UserSettings) => ({
          ...old,
          ...settings,
        }),
      )
    },
  })
}
