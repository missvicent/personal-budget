import { useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function RouteErrorFallback({ error, reset }: ErrorComponentProps) {
  const router = useRouter()

  if (import.meta.env.PROD) {
    // TODO: replace with Sentry.captureException(error) once wired
    console.error('Route error:', error)
  }

  const handleRetry = () => {
    reset()
    router.invalidate()
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <div className="flex gap-2">
        <Button onClick={handleRetry}>Try again</Button>
        <Button variant="outline" onClick={() => router.navigate({ to: '/' })}>
          Go home
        </Button>
      </div>
    </div>
  )
}
