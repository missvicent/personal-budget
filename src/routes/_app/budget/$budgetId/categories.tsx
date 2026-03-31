import { createFileRoute } from '@tanstack/react-router'
import { CategoryAllocationsGrid } from '../-components'

export const Route = createFileRoute('/_app/budget/$budgetId/categories')({
  component: CategoriesPage,
})

function CategoriesPage() {
  return <CategoryAllocationsGrid />
}
