import { createContext, useContext, useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase-client'

const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth()

  const supabase = useMemo(() => {
    return createSupabaseClient(async () => getToken({ template: 'supabase' }))
  }, [getToken])

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase(): SupabaseClient {
  const supabase = useContext(SupabaseContext)
  if (!supabase)
    throw new Error('useSupabase must be used within a SupabaseProvider')
  return supabase
}
