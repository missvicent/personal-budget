import { createContext } from 'react'
import { ExpenseItemIcon } from './ExpenseItemIcon'
import { ExpenseItemAmount } from './ExpenseItemAmount'
import { ExpenseItemDetails } from './ExpenseItemDetails'
import { ExpenseItemActions } from './ExpenseItemActions'
import { ExpenseItemMeta } from './ExpenseItemMeta'
import type { ReactNode } from 'react'

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
        className="group bg-sidebar hover:border-primary/50 flex w-full items-center justify-between rounded-lg border border-l-4 p-3.5 px-4 transition-colors"
        style={{
          borderLeftColor: isOverBudget ? 'var(--destructive)' : color,
        }}
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
