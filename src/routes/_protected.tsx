import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

function ProtectedComponent() {
  return <Outlet />
}

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        to: '/auth/sign-in',
        search: { redirect: location.href },
      })
    }
  },
  component: ProtectedComponent,
})
