import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useSupabase } from '@/contexts/SupabaseContext'

export const useAuthMutation = <TData, TVariables, TError, TContext>(
  apiFunction: (
    variables: TVariables,
    supabase: SupabaseClient,
  ) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  >,
) => {
  const supabase = useSupabase()

  return useMutation({
    mutationFn: (variables) => apiFunction(variables, supabase),
    ...options,
  })
}
