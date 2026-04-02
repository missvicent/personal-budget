import { createFileRoute } from '@tanstack/react-router'
import { AllocationsGrid } from '../-components'

export const Route = createFileRoute('/_app/budget/$budgetId/allocations')({
  component: AllocationsPage,
})

function AllocationsPage() {
  return <AllocationsGrid />
}
