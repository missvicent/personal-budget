import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export function createSupabaseClient(getToken: () => Promise<string | null>) {
  return createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      async accessToken() {
        return await getToken()
      },
    },
  )
}
