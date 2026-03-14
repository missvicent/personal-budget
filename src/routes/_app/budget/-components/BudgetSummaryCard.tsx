import { forwardRef } from 'react'
import { PlusIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface BudgetSummaryCardItem {
  id: string
  title: string
  value: number
}

export interface BudgetSummaryCardProps {
  data: Array<BudgetSummaryCardItem>
}

export const BudgetSummaryCard = forwardRef<
  HTMLDivElement,
  BudgetSummaryCardProps
>(({ data, ...props }: BudgetSummaryCardProps, ref) => {
  if (data.length < 2) return null
  const [, remaining] = data
  const getColor = (val: string) => {
    if (val.toLowerCase() === 'budget') return 'text-foreground'
    return remaining.value > 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <div ref={ref} {...props} className="flex flex-col gap-2">
      <div
        role="group"
        className={cn(
          'flex items-center justify-center',
          '[&>*:first-child]:rounded-l-xl [&>*:first-child]:rounded-r-none',
          '[&>*:last-child]:rounded-l-none [&>*:last-child]:rounded-r-xl',
          '[&>*:not(:first-child):not(:last-child)]:rounded-none',
          '[&>*:not(:first-child)]:-ml-px',
          'bg-background rounded-xl',
        )}
      >
        {data.map((item) => (
          <div
            key={item.id}
            aria-label={item.title}
            className="border-input inline-flex h-8 min-w-8 items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-10 text-sm font-medium shadow-sm"
          >
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground text-base uppercase">
                {item.title}
              </p>
              <p className={cn('text-xl font-bold', getColor(item.title))}>
                $
                {item.value.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        ))}
        <button
          type="button"
          aria-label="Set a Budget"
          className="group border-input inline-flex h-8 min-w-8 cursor-pointer items-center justify-center gap-2 rounded-md border bg-transparent px-4 py-10 text-sm font-medium shadow-sm hover:bg-transparent"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="border-input group-hover:border-primary inline-flex items-center justify-center rounded-md border-2 p-4">
                <PlusIcon className="group-hover:text-primary h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Set a Budget</TooltipContent>
          </Tooltip>
        </button>
      </div>
    </div>
  )
})
BudgetSummaryCard.displayName = 'BudgetSummaryCard'
