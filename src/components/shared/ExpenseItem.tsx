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
  title: string
}

export const ExpenseItemContext = createContext<ExpenseItemProps | null>(null)

export const ExpenseItemRoot = ({
  amount,
  category,
  children,
  color,
  icon,
  title,
}: ExpenseItemProps) => {
  return (
    <ExpenseItemContext.Provider
      value={{ amount, category, color, icon, title }}
    >
      <div className="flex w-full items-center justify-between py-3">
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
