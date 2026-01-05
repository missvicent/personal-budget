import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/ia-insights/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello AI Insights!</div>
}
