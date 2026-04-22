import { Progress } from '@/components/ui/progress'
import { currencyFormatter, percentFormatter } from '@/lib/format'
import { cn } from '@/lib/utils'

export type CategorySpendingLegendItem = {
  name: string
  value: string
  color: string
  amount: number
  icon: string
  budget: number
}

type Props = {
  items: Array<CategorySpendingLegendItem>
  className?: string
}

export const CategorySpendingLegend = ({ items, className }: Props) => {
  return (
    <div
      className={cn(
        'flex-1 flex-col items-start justify-center xl:max-h-72 xl:overflow-y-auto',
        className,
      )}
    >
      {items.map((item) => {
        const hasBudget = item.budget > 0
        const ratio = hasBudget ? item.amount / item.budget : 0
        const isOverBudget = hasBudget && item.amount > item.budget
        const progressValue = hasBudget ? Math.min(ratio * 100, 100) : 0

        return (
          <div key={item.value} className="flex w-full flex-col items-start">
            <div className="flex w-full items-center gap-2 py-3">
              <div
                className="h-4 w-4 rounded-sm"
                style={{ background: item.color }}
              />
              <div className="flex w-full justify-between gap-2">
                <span className="text-sm font-medium">{item.name}</span>
                <span
                  className={cn(
                    'text-sm tabular-nums',
                    isOverBudget ? 'text-destructive' : 'text-muted-foreground',
                  )}
                >
                  {hasBudget ? (
                    <>
                      {currencyFormatter.format(item.amount)} /{' '}
                      {currencyFormatter.format(item.budget)}{' '}
                      <span className="font-medium">
                        ({percentFormatter.format(ratio)})
                      </span>
                    </>
                  ) : (
                    <>{currencyFormatter.format(item.amount)} spent</>
                  )}
                </span>
              </div>
            </div>
            <Progress
              value={progressValue}
              className={cn(
                isOverBudget && '[&>div]:bg-destructive',
                !hasBudget && 'opacity-50',
              )}
            />
          </div>
        )
      })}
    </div>
  )
}
