import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import Header from '@/components/ui/layout/Header'

interface RouterContext {
  auth: {
    isLoaded: boolean
    isSignedIn: boolean
    userId: string | null | undefined
  }
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-purple-950 to-purple-925">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </div>
  ),
})
