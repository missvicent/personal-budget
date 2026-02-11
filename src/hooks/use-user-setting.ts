import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UserSettings } from '@/types/database.types'
import { userSettingsService } from '@/services/user-settings.service'
import { useSupabase } from '@/contexts/SupabaseContext'

const queryKeys = {
  userSettings: () => ['user_settings'],
  userSetting: (userId: string) => ['user_settings', userId],
}
export const useUserSetting = () => {
  const supabase = useSupabase()
  return useQuery<UserSettings>({
    queryKey: queryKeys.userSettings(),
    queryFn: () => userSettingsService.get(supabase),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
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
