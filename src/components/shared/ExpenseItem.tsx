import { createContext } from 'react'
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

export const ExpenseItem = ({
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
      <div className="w-full space-y-2 py-3">{children}</div>
    </ExpenseItemContext.Provider>
  )
}
