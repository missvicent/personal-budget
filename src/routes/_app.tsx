import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppToolbar } from './_app/-components/AppToolbar'
import { AppSidebar } from './_app/-components/AppSidebar'
import { NAVIGATION_ITEMS } from '@/config/navigation'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function AppLayout() {
  const items = NAVIGATION_ITEMS

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar items={items} />
      <SidebarInset className="h-screen flex-col">
        <AppToolbar />
        <main className="bg-app-bg flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        to: '/auth/sign-in',
        search: { redirect: location.href },
      })
    }
  },
  component: AppLayout,
})
