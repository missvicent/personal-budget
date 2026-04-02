interface TransactionForOverspend {
  id: string
  category_id: string
  amount: number
  transaction_date: string
}

interface OverspendingResult {
  transactionIds: Set<string>
  categoryIds: Set<string>
}

export function getOverspendingTransactionIds(
  transactions: Array<TransactionForOverspend>,
  totalBudgetAmount: number,
): OverspendingResult {
  const transactionIds = new Set<string>()
  const categoryIds = new Set<string>()

  const sorted = [...transactions].sort(
    (a, b) =>
      new Date(a.transaction_date).getTime() -
      new Date(b.transaction_date).getTime(),
  )

  let runningTotal = 0
  for (const tx of sorted) {
    runningTotal += tx.amount
    if (runningTotal > totalBudgetAmount) {
      transactionIds.add(tx.id)
      categoryIds.add(tx.category_id)
    }
  }

  return { transactionIds, categoryIds }
}
