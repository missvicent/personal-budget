import { SignUp } from '@clerk/clerk-react'
import { createFileRoute, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect:
        typeof search.redirect === 'string' ? search.redirect : undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect } = useSearch({ from: '/auth/sign-up' })

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        routing="path"
        path="/auth/sign-up"
        signInUrl="/auth/sign-in"
        {...(redirect ? { fallbackRedirectUrl: redirect } : {})}
      />
    </div>
  )
}
