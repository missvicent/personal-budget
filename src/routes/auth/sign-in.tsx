import { SignIn } from '@clerk/clerk-react'
import { createFileRoute, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-in')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || '/',
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect } = useSearch({ from: '/auth/sign-in' })

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        routing="path"
        path="/auth/sign-in"
        signUpUrl="/auth/sign-up"
        fallbackRedirectUrl={redirect}
      />
    </div>
  )
}
