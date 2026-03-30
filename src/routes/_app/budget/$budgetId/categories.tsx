import { createFileRoute } from '@tanstack/react-router'
import { BudgetOverview } from '../-components/budget-item/BudgetOverview'

export const Route = createFileRoute('/_app/budget/$budgetId/categories')({
  component: CategoriesPage,
})

function CategoriesPage() {
  return <BudgetOverview />
}
