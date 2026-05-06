import { useMemo } from 'react'
import { useGetTransactionsWithCategories } from '../transactions/use-transaction-with-categories'
import type { TransactionWithCategory } from '@/types/transaction.types'

export type InsightsTotals = {
  total_spending: number
  total_income: number
  total_expenses: number
  net: number
  has_transactions: boolean
  isLoading: boolean
}

const EMPTY_TOTALS: Omit<InsightsTotals, 'isLoading'> = {
  total_spending: 0,
  total_income: 0,
  total_expenses: 0,
  net: 0,
  has_transactions: false,
}

const subDays = (d: Date, days: number) => {
  const out = new Date(d)
  out.setDate(out.getDate() - days)
  return out
}

const subMonths = (d: Date, months: number) => {
  const out = new Date(d)
  out.setMonth(out.getMonth() - months)
  return out
}

const subYears = (d: Date, years: number) => {
  const out = new Date(d)
  out.setFullYear(out.getFullYear() - years)
  return out
}

const WINDOW_OFFSETS = new Map<string, (now: Date) => Date>([
  ['7d', (now) => subDays(now, 7)],
  ['15d', (now) => subDays(now, 15)],
  ['30d', (now) => subDays(now, 30)],
  ['1m', (now) => subMonths(now, 1)],
  ['3m', (now) => subMonths(now, 3)],
  ['6m', (now) => subMonths(now, 6)],
  ['1y', (now) => subYears(now, 1)],
])

const cutoffFor = (window: string, now: Date): Date | null => {
  const fn = WINDOW_OFFSETS.get(window)
  return fn ? fn(now) : null
}

const filterByWindow = (
  rows: Array<TransactionWithCategory>,
  window: string,
): Array<TransactionWithCategory> => {
  const cutoff = cutoffFor(window, new Date())
  if (!cutoff) return rows
  return rows.filter((t) => new Date(t.transaction_date) >= cutoff)
}

const sumByType = (
  rows: Array<TransactionWithCategory>,
): { income: number; expenses: number } => {
  let income = 0
  let expenses = 0
  for (const t of rows) {
    if (t.category_type === 'income') income += t.amount
    else expenses += t.amount
  }
  return { income, expenses }
}

export const useInsightsTotals = (
  budgetId: string,
  window: string,
): InsightsTotals => {
  const { data, isLoading } = useGetTransactionsWithCategories(budgetId)

  return useMemo(() => {
    if (!budgetId || !window || !data) {
      return { ...EMPTY_TOTALS, isLoading }
    }

    const inWindow = filterByWindow(data, window)
    if (inWindow.length === 0) {
      return { ...EMPTY_TOTALS, isLoading }
    }

    const { income, expenses } = sumByType(inWindow)
    return {
      total_spending: expenses,
      total_income: income,
      total_expenses: expenses,
      net: income - expenses,
      has_transactions: true,
      isLoading,
    }
  }, [budgetId, window, data, isLoading])
}
