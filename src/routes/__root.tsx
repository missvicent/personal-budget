import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

interface RouterContext {
  auth: {
    isLoaded: boolean
    isSignedIn: boolean
    userId: string | null | undefined
  }
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="to-purple-925 flex min-h-screen flex-col bg-gradient-to-br from-black via-purple-950">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
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
