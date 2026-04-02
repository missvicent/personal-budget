import { useContext } from 'react'
import { ExpenseItemContext } from '@/components/shared/ExpenseItem'

export const useExpenseItem = () => {
  const context = useContext(ExpenseItemContext)
  if (!context)
    throw new Error('useExpenseItem must be used within a <ExpenseItem />')
  return context
}
