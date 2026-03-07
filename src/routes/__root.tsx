import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

interface RouterContext {
  auth: {
    isLoaded: boolean
    isSignedIn: boolean
    userId: string | null | undefined
  }
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
