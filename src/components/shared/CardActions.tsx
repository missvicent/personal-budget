import { PencilIcon, Trash2Icon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CardActionsProps = {
  className?: string
  onDelete: () => void
  onEdit: () => void
  showOnHover?: boolean
  stopPropagation?: boolean
  preventDefault?: boolean
} & (
  | { deleteDisabled: true; deleteDisabledReason: string }
  | { deleteDisabled?: false; deleteDisabledReason?: never }
)

export const CardActions = ({
  className,
  deleteDisabled = false,
  deleteDisabledReason,
  onDelete,
  onEdit,
  showOnHover = true,
  stopPropagation = false,
  preventDefault = false,
}: CardActionsProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) e.stopPropagation()
    if (preventDefault) e.preventDefault()
    if (!deleteDisabled) onDelete()
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 transition-opacity duration-200',
        showOnHover && 'opacity-0 group-hover:opacity-100',
        className,
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/20 hover:text-primary/70 z-10"
            onClick={(e) => {
              if (stopPropagation) e.stopPropagation()
              if (preventDefault) e.preventDefault()
              onEdit()
            }}
          >
            <PencilIcon />
            <span className="sr-only">Edit</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-disabled={deleteDisabled}
            className={cn(
              'hover:bg-destructive/20 hover:text-destructive/70 z-10',
              deleteDisabled && 'cursor-not-allowed opacity-50',
            )}
            onClick={handleClick}
          >
            <Trash2Icon />
            <span className="sr-only">Delete</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {deleteDisabled ? deleteDisabledReason : 'Delete'}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
