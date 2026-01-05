import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/goal-tracker/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Goal Tracker</div>
}
