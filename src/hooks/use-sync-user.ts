import { useEffect, useRef } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSupabase } from './use-supabase'
import type { Profile } from '@/types/database.types'
import { profilesService } from '@/services/profiles.service'

export function useSyncUser() {
  const { user, isLoaded } = useUser()
  const queryClient = useQueryClient()
  const hasAttemptedCreate = useRef(false)
  const supabase = useSupabase()
  const shouldSyncProfile = isLoaded && !!user

  const {
    data: profile,
    isFetching: profileFetching,
    isFetched,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null
      return profilesService.get(user.id, supabase)
    },
    enabled: shouldSyncProfile,
    retry: false,
  })

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User or session not found')
      return profilesService.create(
        {
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          fullName: user.fullName || '',
          avatarUrl: user.imageUrl,
        } as Profile,
        supabase,
      )
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', user?.id], data)
    },
    retry: false,
  })

  useEffect(() => {
    if (
      isFetched &&
      !profile &&
      !createProfileMutation.isPending &&
      !createProfileMutation.isError &&
      !hasAttemptedCreate.current
    ) {
      hasAttemptedCreate.current = true
      createProfileMutation.mutate()
    }
  }, [
    isFetched,
    profile,
    createProfileMutation.isPending,
    createProfileMutation.isError,
  ])

  // Reset the flag when user changes
  useEffect(() => {
    hasAttemptedCreate.current = false
  }, [user?.id])

  return {
    profile,
    isLoading: !isLoaded || (shouldSyncProfile && profileFetching),
    isCreating: createProfileMutation.isPending,
    error: createProfileMutation.error,
  }
}
