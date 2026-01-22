import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Calendar1Icon, MoonIcon, SunIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/common/AppSidebar'
import { useTheme } from '@/hooks/use-theme'
import { Switch } from '@/components/ui/switch'

function AppLayout() {
  const { toggleTheme, isDarkMode } = useTheme()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen flex-col">
        <header className="bg-sidebar border-sidebar-border flex h-[72px] shrink-0 items-center border-b-2 p-4">
          <div className="flex w-full items-center justify-end gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>
        <main className="bg-sidebar flex-1 overflow-auto">
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
