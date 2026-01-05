import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/recurring-expenses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Recurring Expenses</div>
}
