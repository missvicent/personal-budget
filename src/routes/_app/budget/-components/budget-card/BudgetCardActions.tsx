import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BudgetCardActionsProps {
  onEdit: () => void
  onDelete: () => void
}

export const BudgetCardActions = ({
  onEdit,
  onDelete,
}: BudgetCardActionsProps) => (
  <div className="flex w-1/2 items-end justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-primary/20 hover:text-primary/70 z-10"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onEdit()
      }}
    >
      <PencilIcon className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-destructive/20 hover:text-destructive/70 z-10"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onDelete()
      }}
    >
      <Trash2Icon className="h-4 w-4" />
    </Button>
  </div>
)
