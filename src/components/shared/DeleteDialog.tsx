import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteDialogProps {
  children: React.ReactNode
  isDeleting?: boolean
  onCancel: () => void
  onConfirm: () => void
  open: boolean
  title: string
}
export const DeleteDialog = ({
  children,
  onConfirm,
  onCancel,
  isDeleting,
  open,
  title,
}: DeleteDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState) onCancel()
      }}
    >
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{children}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
