import { useEffect, useRef } from 'react'
import { useSession, useUser } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSupabaseClient } from '@/lib/supabaseClient'

export function useSyncUser() {
  const { user, isLoaded } = useUser()
  const { session } = useSession()
  const queryClient = useQueryClient()
  const hasAttemptedCreate = useRef(false)

  const getToken = async (): Promise<string | null> =>
    session?.getToken() || null

  const shouldSyncProfile = isLoaded && !!user && !!session

  const {
    data: profile,
    isFetching: profileFetching,
    isFetched,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user || !session) return null

      console.log('Fetching profile for user:', user.id)
      const supabase = createSupabaseClient(getToken)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single()

      console.log('Profile fetch result:', { data, error })
      if (error && error.code !== 'PGRST116') throw error
      return data
    },
    enabled: shouldSyncProfile,
    retry: false,
  })

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user || !session) throw new Error('User or session not found')

      console.log('Creating profile for user:', user.id)
      const supabase = createSupabaseClient(getToken)
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          clerk_user_id: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          avatar_url: user.imageUrl,
        })
        .select()
        .single()
      if (error) {
        console.error('Error creating profile:', error)
        throw error
      }
      console.log('Profile created:', data)
      return data
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
