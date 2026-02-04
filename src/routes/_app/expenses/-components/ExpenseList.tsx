export interface Transaction {
  amount: number
  category: string
  date: string
  description: string
  id: string
}

export interface ExpenseRecord {
  date: string
  totalAmount: number
  transactions: Array<Transaction>
}

export const ExpenseList = () => {
  return (
    <div>
      <h1>Expense List</h1>
    </div>
  )
}
