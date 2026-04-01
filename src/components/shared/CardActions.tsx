import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CardActionsProps {
  onEdit: () => void
  onDelete: () => void
  stopPropagation?: boolean
  showOnHover?: boolean
  className?: string
}

export const CardActions = ({
  onEdit,
  onDelete,
  stopPropagation = false,
  showOnHover = true,
  className,
}: CardActionsProps) => {
  const handleClick =
    (callback: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
      if (stopPropagation) {
        e.preventDefault()
        e.stopPropagation()
      }
      callback()
    }

  return (
    <div
      className={cn(
        'flex items-center gap-2 transition-opacity duration-200',
        showOnHover && 'opacity-0 group-hover:opacity-100',
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/20 hover:text-primary/70 z-10"
        onClick={handleClick(onEdit)}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-destructive/20 hover:text-destructive/70 z-10"
        onClick={handleClick(onDelete)}
      >
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </div>
  )
}
