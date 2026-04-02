import type { BudgetWithProgress } from '@/types/budget.types'
import { CardActions } from '@/components/shared/CardActions'
import { Card, CardContent } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/circular-progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AllocationCardProps {
  allocation: BudgetWithProgress
  isOverBudget: boolean
  onDelete: () => void
  onEdit: () => void
}

export const AllocationCard = ({
  allocation,
  isOverBudget,
  onDelete,
  onEdit,
}: AllocationCardProps) => {
  const { category_name, amount, progress, category_icon, category_color } =
    allocation
  const progressValue = amount > 0 ? (progress / amount) * 100 : 0
  const deleteDisabledReason =
    'Remove or reassign expenses before deleting this category'
  const isDeleteDisabled = progressValue > 0
  const isUnset = amount === 0
  const maxPercentage = progressValue > 999 ? 999 : progressValue

  return (
    <Card
      className="rounded-2xl border-l-4"
      style={{
        borderLeftColor: isOverBudget ? 'var(--destructive)' : category_color,
      }}
    >
      <CardContent className="flex items-center justify-between gap-4 px-6">
        <div className="flex flex-col gap-3">
          <CircularProgress
            value={progressValue}
            size={64}
            strokeWidth={5}
            color={isOverBudget ? 'var(--destructive)' : category_color}
          >
            <span className="text-xl">{category_icon}</span>
          </CircularProgress>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{category_name}</p>
              {isUnset && (
                <Badge variant="secondary">Created from expenses</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              <span
                className={cn(
                  'text-foreground font-semibold',
                  isOverBudget && 'text-destructive',
                )}
              >
                ${progress}
              </span>{' '}
              of ${amount}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          {isOverBudget && (
            <div className="-mt-3 flex justify-end">
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 border px-1.5 text-xs capitalize">
                Over budget
              </Badge>
            </div>
          )}
          <p
            className={cn(
              'flex justify-end text-2xl font-bold',
              isOverBudget && 'text-destructive',
            )}
          >
            <span className="text-destructive font-mono">
              {isOverBudget && '>'}
            </span>
            {Math.round(maxPercentage)}%
          </p>
          <p className="text-muted-foreground flex justify-end text-xs">
            spent
          </p>
          <div className="flex h-14 items-end justify-end">
            <CardActions
              className="flex items-end justify-end"
              {...(isDeleteDisabled
                ? { deleteDisabled: true, deleteDisabledReason }
                : { deleteDisabled: false })}
              onEdit={onEdit}
              onDelete={onDelete}
              showOnHover={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
