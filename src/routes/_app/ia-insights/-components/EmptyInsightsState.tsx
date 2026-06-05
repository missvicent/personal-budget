import { Link } from '@tanstack/react-router'
import {
  AlertCircle,
  Gauge,
  Lightbulb,
  LineChart,
  ListChecks,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Reason = 'no_budgets' | 'no_transactions'

interface EmptyInsightsStateProps {
  reason: Reason
  budgetId?: string
}

const INSIGHT_FEATURES: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    icon: Gauge,
    title: 'Spending pacing',
    description: 'See if you’re ahead, on track, or about to blow your budget',
  },
  {
    icon: AlertCircle,
    title: 'Anomaly detection',
    description: 'Spot unusual transactions before they become a trend',
  },
  {
    icon: LineChart,
    title: 'Trend insights',
    description: 'Catch shifts in your top categories week over week',
  },
  {
    icon: Lightbulb,
    title: 'Personalized advice',
    description: 'Bite-sized recommendations tuned to your habits',
  },
]

const CenteredMessage = ({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon
  title: string
  body: string
  action?: ReactNode
}) => (
  <div className="flex flex-1 items-center justify-center p-4 md:p-8">
    <div className="flex max-w-md flex-col items-center gap-4 text-center">
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          'bg-primary/10 text-primary',
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-foreground text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
      </div>
      {action}
    </div>
  </div>
)

const NoBudgetsState = () => (
  <div className="flex flex-1 items-center justify-center p-4 md:p-8">
    <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            'bg-primary/10 text-primary',
          )}
        >
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-foreground text-xl font-bold md:text-2xl">
          No insights yet
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          Create a budget and log a few transactions — your AI assistant will
          surface patterns, anomalies, and recommendations from there.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {INSIGHT_FEATURES.map((feature) => {
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
        asChild
        size="lg"
        className="bg-primary hover:bg-primary/90 rounded-full px-8"
      >
        <Link to="/budget">Create a budget</Link>
      </Button>
    </div>
  </div>
)

const NoDataState = ({ budgetId }: { budgetId?: string }) => (
  <CenteredMessage
    icon={Sparkles}
    title="No data yet"
    body="Add a few transactions to this budget — or pick a longer window — and your AI assistant will start surfacing insights."
    action={
      budgetId ? (
        <Button asChild size="sm" variant="outline" className="rounded-full">
          <Link to="/budget/$budgetId/expenses" params={{ budgetId }}>
            Add a transaction
          </Link>
        </Button>
      ) : undefined
    }
  />
)

export const EmptyInsightsState = ({
  reason,
  budgetId,
}: EmptyInsightsStateProps) =>
  reason === 'no_budgets' ? (
    <NoBudgetsState />
  ) : (
    <NoDataState budgetId={budgetId} />
  )

export const SelectBudgetPrompt = () => (
  <CenteredMessage
    icon={ListChecks}
    title="Select a budget"
    body="Pick one of your budgets above to see AI insights for it."
  />
)

export const InsightsSkeleton = () => (
  <div className="flex w-full flex-col gap-3 px-5">
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
    <Skeleton className="h-64 rounded-xl" />
  </div>
)
