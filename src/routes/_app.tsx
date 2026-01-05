import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Calendar1Icon } from 'lucide-react'
import dayjs from 'dayjs'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/common/AppSidebar'

function AppLayout() {
  const currentDate = dayjs().format('MMMM D, YYYY')
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen flex-col">
        <header className="bg-sidebar border-sidebar-border flex h-[72px] shrink-0 items-center border-b-2 p-4">
          <div className="flex items-center gap-2">
            <Calendar1Icon className="h-4 w-4" />
            <p>{currentDate}</p>
            <p>Welcome back</p>
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
