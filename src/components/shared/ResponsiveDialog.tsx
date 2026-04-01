import type { ComponentProps } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

const ResponsiveDialog = (props: ComponentProps<typeof Dialog>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <Sheet {...props} />
  }

  return <Dialog {...props} />
}

const ResponsiveDialogContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogContent>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetContent
        side="bottom"
        className={cn('max-h-[85vh] overflow-y-auto rounded-t-xl', className)}
        {...props}
      >
        {children}
      </SheetContent>
    )
  }

  return (
    <DialogContent className={className} {...props}>
      {children}
    </DialogContent>
  )
}

const ResponsiveDialogHeader = ({
  className,
  ...props
}: ComponentProps<typeof DialogHeader>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetHeader className={className} {...props} />
  }

  return <DialogHeader className={className} {...props} />
}

const ResponsiveDialogFooter = ({
  className,
  ...props
}: ComponentProps<typeof DialogFooter>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetFooter className={className} {...props} />
  }

  return <DialogFooter className={className} {...props} />
}

const ResponsiveDialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof DialogTitle>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetTitle className={className} {...props} />
  }

  return <DialogTitle className={className} {...props} />
}

const ResponsiveDialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof DialogDescription>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetDescription className={className} {...props} />
  }

  return <DialogDescription className={className} {...props} />
}

const ResponsiveDialogClose = (props: ComponentProps<typeof DialogClose>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetClose {...props} />
  }

  return <DialogClose {...props} />
}

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
}
