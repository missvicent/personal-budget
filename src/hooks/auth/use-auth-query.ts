import { useQuery } from '@tanstack/react-query'
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useSupabase } from '@/contexts/SupabaseContext'

/**
 * Create a generic useQuery hook that uses the supabase client to fetch data
 * and the auth context to get the user.
 * Define the queryKey and queryFn as generic parameters.
 * Return the useQuery hook.
 */

export const useAuthQuery = <T>(
  queryKey: QueryKey | Array<string>,
  queryFn: (supabase: SupabaseClient) => Promise<T>,
  queryOptions: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) => {
  const supabase = useSupabase()

  return useQuery({
    queryKey: queryKey,
    queryFn: () => queryFn(supabase),
    ...queryOptions,
    enabled: queryOptions.enabled ?? true,
  })
}
