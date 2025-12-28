import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import AppHeader from '@/components/common/AppHeader'

function AppLayout() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </>
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
