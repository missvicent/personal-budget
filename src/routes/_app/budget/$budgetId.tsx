import { parseISO } from 'date-fns'
import { createFileRoute, redirect } from '@tanstack/react-router'
import type { ToolbarMeta } from '@/routes/__root'
import { budgetService } from '@/services/budget.service'
import { formatDateRange } from '@/lib/dates/formatDate'

export const Route = createFileRoute('/_app/budget/$budgetId')({
  beforeLoad: async ({ context, params }) => {
    const overviews = await context.queryClient.ensureQueryData({
      queryKey: ['budgets', 'overview'],
      queryFn: () => budgetService.getOverview(context.supabase),
    })
    const budget = overviews.find((b) => b.budget_id === params.budgetId)
    if (!budget) throw redirect({ to: '/budget' })

    const toolbarMeta: ToolbarMeta = {
      title: budget.budget_name,
      description: budget.end_date
        ? formatDateRange(
            parseISO(budget.start_date),
            parseISO(budget.end_date),
          )
        : undefined,
      balance: {
        label: 'Spent',
        value: `$${budget.total_spent.toFixed(2)} of $${budget.budget_amount.toFixed(2)}`,
      },
    }

    return { toolbarMeta }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>BudgetPage</div>
}
