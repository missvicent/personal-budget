import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/budget/$budgetId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>BudgetPage</div>
}
