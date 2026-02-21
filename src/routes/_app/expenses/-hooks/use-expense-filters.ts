import { useMemo, useState } from 'react'

import type { Category, TransactionWithCategory } from '@/types/database.types'

import { groupTransactionsByDate } from '@/lib/transactions.utils'
import { toSelectOptions } from '@/lib/utils'

export const useExpenseFilters = (
  transactions: Array<TransactionWithCategory>,
  categories: Array<Category>,
) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categoryOptions = useMemo(
    () =>
      toSelectOptions(
        { label: 'All Categories', value: 'all' },
        categories,
        (c) => `${c.icon} ${c.name}`,
        (c) => c.id,
      ),
    [categories],
  )

  const filteredTransactions = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    return transactions.filter((tx) => {
      if (selectedCategory !== 'all' && tx.category_id !== selectedCategory)
        return false
      if (query && !tx.description.toLowerCase().includes(query)) return false
      return true
    })
  }, [transactions, searchValue, selectedCategory])

  const groupedExpenses = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions],
  )

  return {
    categoryOptions,
    filteredTransactions,
    groupedExpenses,
    searchValue,
    selectedCategory,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter')
        setSearchValue((e.target as HTMLInputElement).value)
    },
    onCategoryChange: (value: { label: string; value: string }) => {
      setSelectedCategory(value.value)
    },
  }
}
