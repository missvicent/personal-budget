interface TransactionForOverspend {
  id: string
  category_id: string
  amount: number
  transaction_date: string
}

interface BudgetItemForOverspend {
  category_id: string
  amount: number
}

export function getOverspendingTransactionIds(
  transactions: Array<TransactionForOverspend>,
  budgetItems: Array<BudgetItemForOverspend>,
): Set<string> {
  const budgetByCategory = new Map(
    budgetItems.map((bi) => [bi.category_id, bi.amount]),
  )

  const overspendingIds = new Set<string>()

  const byCategory = new Map<string, Array<TransactionForOverspend>>()
  for (const tx of transactions) {
    if (!tx.category_id) continue
    const group = byCategory.get(tx.category_id) ?? []
    group.push(tx)
    byCategory.set(tx.category_id, group)
  }

  for (const [categoryId, txs] of byCategory) {
    const budgetAmount = budgetByCategory.get(categoryId)
    if (budgetAmount === undefined) continue

    const sorted = [...txs].sort(
      (a, b) =>
        new Date(a.transaction_date).getTime() -
        new Date(b.transaction_date).getTime(),
    )

    let runningTotal = 0
    for (const tx of sorted) {
      runningTotal += tx.amount
      if (runningTotal > budgetAmount) {
        overspendingIds.add(tx.id)
      }
    }
  }

  return overspendingIds
}
