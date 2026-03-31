import { createContext } from 'react'
import { ExpenseItemIcon } from './ExpenseItemIcon'
import { ExpenseItemAmount } from './ExpenseItemAmount'
import { ExpenseItemDetails } from './ExpenseItemDetails'
import { ExpenseItemActions } from './ExpenseItemActions'
import { ExpenseItemMeta } from './ExpenseItemMeta'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ExpenseItemProps {
  amount: number
  category: string
  children?: ReactNode
  color: string
  icon: string
  isOverBudget?: boolean
  title: string
}

export const ExpenseItemContext = createContext<ExpenseItemProps | null>(null)

export const ExpenseItemRoot = ({
  amount,
  category,
  children,
  color,
  icon,
  isOverBudget = false,
  title,
}: ExpenseItemProps) => {
  return (
    <ExpenseItemContext.Provider
      value={{ amount, category, color, icon, isOverBudget, title }}
    >
      <div
        className={cn(
          'group bg-sidebar hover:border-primary/50 mt-3 flex w-full items-center justify-between rounded-lg border p-6 transition-colors',
          isOverBudget && 'border-destructive',
        )}
      >
        {children}
      </div>
    </ExpenseItemContext.Provider>
  )
}

export const ExpenseItem = Object.assign(ExpenseItemRoot, {
  Icon: ExpenseItemIcon,
  Amount: ExpenseItemAmount,
  Details: ExpenseItemDetails,
  Actions: ExpenseItemActions,
  Meta: ExpenseItemMeta,
})
