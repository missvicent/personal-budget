import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useSupabase } from '@/contexts/SupabaseContext'

export const useAuthMutation = <TData, TVariables, TError>(
  mutationFn: (
    variables: TVariables,
    supabase: SupabaseClient,
  ) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>,
) => {
  const supabase = useSupabase()
  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables) => mutationFn(variables, supabase),
    ...options,
  })
}
