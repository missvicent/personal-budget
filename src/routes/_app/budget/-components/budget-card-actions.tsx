import { CardActions } from '@/components/shared/CardActions'

interface BudgetCardActionsProps {
  onEdit: () => void
  onDelete: () => void
}

export const BudgetCardActions = ({
  onEdit,
  onDelete,
}: BudgetCardActionsProps) => (
  <CardActions
    onEdit={onEdit}
    onDelete={onDelete}
    stopPropagation
    className="w-1/2 items-end justify-end"
  />
)
