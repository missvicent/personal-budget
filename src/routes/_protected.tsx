import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

function ProtectedComponent() {
  return <Outlet />
}

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isLoaded) return
    if (!context.auth.isSignedIn)
      throw redirect({ to: '/auth/sign-in', search: location.search })
  },
  component: ProtectedComponent,
})
