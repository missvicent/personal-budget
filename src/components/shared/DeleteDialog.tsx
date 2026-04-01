import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/shared/ResponsiveDialog'
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
    <ResponsiveDialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState) onCancel()
      }}
    >
      <ResponsiveDialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>{children}</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
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
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
