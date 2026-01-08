import { useAuth } from '@clerk/clerk-react'
import { useMemo } from 'react'
import { createSupabaseClient } from '@/lib/supabaseClient'

export const useSupabase = () => {
  const { getToken } = useAuth()

  const supabase = useMemo(() => {
    return createSupabaseClient(async () => getToken({ template: 'supabase' }))
  }, [getToken])
  return supabase
}
