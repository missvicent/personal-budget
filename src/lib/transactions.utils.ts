import type { TransactionWithCategory } from '@/types/database.types'
import type { ExpenseRecord } from '@/routes/_app/expenses/-components/ExpenseList'

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const formatted = formatter.format(date)

  if (date.getTime() === today.getTime()) {
    return `Today, ${formatted}`
  }
  if (date.getTime() === yesterday.getTime()) {
    return `Yesterday, ${formatted}`
  }
  return formatted
}

export function groupTransactionsByDate(
  transactions: Array<TransactionWithCategory>,
): Array<ExpenseRecord> {
  const groups = new Map<string, Array<TransactionWithCategory>>()

  for (const tx of transactions) {
    const key = tx.transaction_date
    const group = groups.get(key)
    if (group) {
      group.push(tx)
    } else {
      groups.set(key, [tx])
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateStr, txs]) => ({
      id: dateStr,
      date: formatDateLabel(dateStr),
      totalAmount: txs.reduce((sum, tx) => sum + tx.amount, 0),
      transactions: txs.map((tx) => ({
        amount: tx.amount,
        category_id: tx.category_id,
        color: tx.color,
        description: tx.description,
        icon: tx.icon,
        id: tx.id,
        is_recurring: tx.is_recurring ?? false,
        name: tx.name,
        transaction_date: tx.transaction_date,
      })),
    }))
}
