import { useAuth } from '@clerk/clerk-react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { useSupabase } from '@/contexts/SupabaseContext'
import { queryClient } from '@/lib/query-client'

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    supabase: undefined!,
    queryClient: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function AppRouter() {
  const auth = useAuth()
  const supabase = useSupabase()

  if (!auth.isLoaded) {
    return
  }

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isLoaded: auth.isLoaded,
          isSignedIn: !!auth.isSignedIn,
          userId: auth.userId,
        },
        supabase,
        queryClient,
      }}
    />
  )
}
