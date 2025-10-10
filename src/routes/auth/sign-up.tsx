import { SignUp } from '@clerk/clerk-react'
import { createFileRoute, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || '/',
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect } = useSearch({ from: '/auth/sign-up' })

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        routing="path"
        path="/auth/sign-up"
        signInUrl="/auth/sign-in"
        fallbackRedirectUrl={redirect}
      />
    </div>
  )
}
