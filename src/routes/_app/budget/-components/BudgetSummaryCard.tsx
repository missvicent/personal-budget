import { Fragment } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export interface BudgetSummaryCardItem {
  id: string
  title: string
  value: number
}

export interface BudgetSummaryCardProps {
  data: Array<BudgetSummaryCardItem>
}

export const BudgetSummaryCard = ({ data }: BudgetSummaryCardProps) => {
  if (data.length < 2) return null
  const [budget, remaining] = data
  const totalBudgetSpent =
    budget.value === 0
      ? 0
      : ((budget.value - remaining.value) / budget.value) * 100
  const clampedTotalBudgetSpent = Math.min(Math.max(totalBudgetSpent, 0), 100)

  const getColor = (val: string) => {
    if (val.toLowerCase() === 'budget') return 'text-foreground'
    return remaining.value >= 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <Card className="w-full gap-2 p-3 lg:w-1/5">
      <CardContent className="p-0">
        <div className="flex flex-row justify-between">
          {data.map((item, index) => (
            <Fragment key={item.id}>
              <div>
                <div className="flex flex-1 flex-col items-center justify-center">
                  <p className="text-muted-foreground text-base uppercase">
                    {item.title}
                  </p>
                  <p className={cn('text-3xl font-bold', getColor(item.title))}>
                    $
                    {item.value.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              {index < data.length - 1 && (
                <Separator orientation="vertical" className="mx-4 h-12" />
              )}
            </Fragment>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center py-2">
          <Progress value={clampedTotalBudgetSpent} className="h-[6px]" />
          <p className="text-muted-foreground mt-2 flex w-full justify-end font-mono text-xs">
            {clampedTotalBudgetSpent}%
            <span className="text-muted-foreground ml-2 font-sans text-xs">
              of the total budget spent
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
