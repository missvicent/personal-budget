import { useMemo } from 'react'
import { format, isWithinInterval } from 'date-fns'
import type { TransactionWithCategory } from '@/types/transaction.types'
import type { Cycle } from '@/lib/period'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { useGetTransactionsWithCategories } from '@/hooks/transactions/use-transaction-with-categories'
import { getCurrentCycle } from '@/lib/period'

export type DailyPoint = { date: string; amount: number }

export type PeriodKpis = {
  cycle: Cycle
  spent: {
    actual: number
    budget: number
    deltaPct: number
    daily: Array<DailyPoint>
  }
  pacing: { utilizationPct: number; diff: number; isOver: boolean }
  avgDay: {
    actual: number
    target: number
    diff: number
    daily: Array<DailyPoint>
  }
  isLoading: boolean
}

const safeDivide = (n: number, d: number): number => (d > 0 ? n / d : 0)

const buildDailySeries = (
  transactions: ReadonlyArray<TransactionWithCategory>,
  cycle: Cycle,
): Array<DailyPoint> => {
  const byDate = new Map<string, number>()
  for (const t of transactions) {
    if (t.category_type === 'income') continue
    const txDate = new Date(t.transaction_date)
    if (!isWithinInterval(txDate, { start: cycle.start, end: cycle.end }))
      continue
    const key = format(txDate, 'yyyy-MM-dd')
    byDate.set(key, (byDate.get(key) ?? 0) + t.amount)
  }

  const out: Array<DailyPoint> = []
  for (let i = 0; i < cycle.daysInCycle; i += 1) {
    const day = new Date(cycle.start)
    day.setDate(day.getDate() + i)
    const key = format(day, 'yyyy-MM-dd')
    out.push({ date: key, amount: byDate.get(key) ?? 0 })
  }
  return out
}

const EMPTY_CYCLE: Cycle = {
  start: new Date(0),
  end: new Date(0),
  daysInCycle: 0,
  daysElapsed: 0,
  daysLeft: 0,
}

const EMPTY: Omit<PeriodKpis, 'isLoading'> = {
  cycle: EMPTY_CYCLE,
  spent: { actual: 0, budget: 0, deltaPct: 0, daily: [] },
  pacing: { utilizationPct: 0, diff: 0, isOver: false },
  avgDay: { actual: 0, target: 0, diff: 0, daily: [] },
}

export const usePeriodKpis = (
  budgetId: string,
  today: Date = new Date(),
): PeriodKpis => {
  const { data: budgets, isLoading: budgetsLoading } = useBudgetOverview()
  const { data: transactions, isLoading: txLoading } =
    useGetTransactionsWithCategories(budgetId)

  const isLoading = budgetsLoading || txLoading

  return useMemo(() => {
    if (!budgetId || !budgets || !transactions) {
      return { ...EMPTY, isLoading }
    }
    const budget = budgets.find((b) => b.budget_id === budgetId)
    if (!budget) {
      return { ...EMPTY, isLoading }
    }

    const cycle = getCurrentCycle(budget.period, today)
    const daily = buildDailySeries(transactions, cycle)
    const actual = daily.reduce((sum, d) => sum + d.amount, 0)
    const budgetAmount = budget.budget_amount > 0 ? budget.budget_amount : 0

    const utilizationPct = safeDivide(actual, budgetAmount) * 100
    const isOver = budgetAmount > 0 && actual > budgetAmount
    const diff = Math.abs(actual - budgetAmount)
    const deltaPct = safeDivide(actual - budgetAmount, budgetAmount) * 100

    const target = safeDivide(budgetAmount, cycle.daysInCycle)
    const avgActual = safeDivide(actual, cycle.daysElapsed)
    const avgDiff = avgActual - target

    return {
      cycle,
      spent: { actual, budget: budgetAmount, deltaPct, daily },
      pacing: { utilizationPct, diff, isOver },
      avgDay: { actual: avgActual, target, diff: avgDiff, daily },
      isLoading,
    }
  }, [budgetId, budgets, transactions, isLoading, today])
}
