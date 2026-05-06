import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { QueryClient } from '@tanstack/react-query'

export type ToolbarMeta = {
  title: string
  description?: string
  balance?: {
    label: string
    value: string
  }
}

interface RouterContext {
  auth: {
    isLoaded: boolean
    isSignedIn: boolean
    userId: string | null | undefined
  }
  supabase: SupabaseClient
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  ),
})
