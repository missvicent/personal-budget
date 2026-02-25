import { Fragment, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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
  const maxValue = useMemo(
    () =>
      Math.max(
        ...data.map((item) => (item.title === 'Budget' ? item.value : 0)),
      ),
    [data],
  )

  const getColor = (value: number, title: string) => {
    if (title !== 'Remaining') return 'text-muted-foreground'
    return value <= maxValue ? 'text-green-500' : 'text-red-500'
  }

  return (
    <Card className="w-full gap-2 p-3 md:w-1/3 xl:w-1/4">
      <CardContent>
        <div className="flex flex-row items-center">
          {data.length > 0 &&
            data.map((item, index) => (
              <Fragment key={item.id}>
                {index > 0 && (
                  <Separator orientation="vertical" className="mx-4 h-12" />
                )}
                <div className="flex flex-1 flex-col items-center justify-center">
                  <p className="text-muted-foreground text-base uppercase">
                    {item.title}
                  </p>
                  <p
                    className={cn(
                      'text-3xl font-bold',
                      getColor(item.value, item.title),
                    )}
                  >
                    ${item.value}
                  </p>
                </div>
              </Fragment>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
