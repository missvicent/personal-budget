import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthQuery } from './auth/use-auth-query'
import type { UserSettings } from '@/types/database.types'
import { userSettingsService } from '@/services/user-settings.service'
import { useSupabase } from '@/contexts/SupabaseContext'

const queryKeys = {
  userSettings: (enabled: boolean) => ['user_settings', enabled],
  userSetting: (userId: string) => ['user_settings', userId],
}
export const useUserSetting = (enabled: boolean) => {
  return useAuthQuery<UserSettings>(
    queryKeys.userSettings(enabled),
    (supabase) => userSettingsService.get(supabase),
    {
      retry: false,
      enabled,
    },
  )
}

export const useUpdateUserSetting = () => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  return useMutation<
    UserSettings,
    Error,
    Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>
  >({
    mutationFn: (
      settings: Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>,
    ) => userSettingsService.upsert(settings, supabase),
    onSuccess: (_, settings) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userSettings(true) })
      queryClient.setQueryData(
        queryKeys.userSettings(true),
        (old: UserSettings) => ({
          ...old,
          ...settings,
        }),
      )
    },
  })
}
