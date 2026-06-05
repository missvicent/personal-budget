import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { FolderTree, LayoutDashboard, Receipt, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BudgetForm, OverviewSkeleton } from '@/components/budget'
import { useBudgetHandlers } from '@/hooks/budget/use-budget-handlers'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'
import { Button } from '@/components/ui/button'
import { budgetService } from '@/services/budget.service'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/overview/')({
  beforeLoad: async ({ context }) => {
    const overviews = await context.queryClient.ensureQueryData({
      queryKey: ['budgets', 'overview'],
      queryFn: () => budgetService.getOverview(context.supabase),
    })

    if (overviews.length > 0) {
      const mostRecent = [...overviews].sort((a, b) =>
        b.start_date.localeCompare(a.start_date),
      )[0]
      throw redirect({
        to: '/budget/$budgetId',
        params: { budgetId: mostRecent.budget_id },
      })
    }

    return {
      toolbarMeta: {
        title: 'Overview',
        description: 'Welcome to Personal Budget',
      },
    }
  },
  component: OverviewPage,
})

const FEATURES: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    icon: LayoutDashboard,
    title: 'Per-budget dashboard',
    description: 'KPIs and charts scoped to exactly one budget at a time',
  },
  {
    icon: Receipt,
    title: 'Scoped expenses',
    description: 'Expenses live inside their budget — no global list',
  },
  {
    icon: FolderTree,
    title: 'Custom categories',
    description: 'Each budget has its own category list and spend limits',
  },
  {
    icon: Sparkles,
    title: 'AI insights',
    description: 'Smart alerts before you overspend any category',
  },
]

function OverviewPage() {
  const [open, setOpen] = useState(false)
  const { handleSubmit, isPending } = useBudgetHandlers(null, () =>
    setOpen(false),
  )
  const { data: budgets, isLoading } = useBudgetOverview()
  const hasBudgets = (budgets ?? []).length > 0

  if (isLoading) return <OverviewSkeleton />

  return (
    <div className="flex flex-1 items-center justify-center p-4 md:p-8">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              'bg-primary/10 text-primary',
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-foreground text-xl font-bold md:text-2xl">
            One place for every budget
          </h1>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            Create monthly budgets, yearly goals, savings targets, travel funds
            — each gets its own dashboard, expense list, and categories.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-xl border p-4 text-left',
                  'border-border bg-card',
                )}
              >
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-foreground text-sm font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 rounded-full px-8"
          onClick={() => setOpen(true)}
        >
          {hasBudgets ? 'Create budget' : 'Create your first budget'}
        </Button>

        <ResponsiveDialog open={open} onOpenChange={setOpen}>
          <BudgetForm
            open={open}
            selectedBudget={null}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </ResponsiveDialog>
      </div>
    </div>
  )
}
