import type { ReactElement } from 'react'
import { DialogTrigger } from '@/components/ui/dialog'

interface DialogTooltipTriggerProps {
  children: ReactElement
  dialogOpen: boolean
  tooltipContent: string
}

export const DialogTooltipTrigger = ({
  children,
}: DialogTooltipTriggerProps) => (
  <DialogTrigger asChild>{children}</DialogTrigger>
)
