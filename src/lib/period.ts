import {
  differenceInCalendarDays,
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
} from 'date-fns'
import type { BudgetPeriod } from '@/types/budget.types'

export type Cycle = {
  start: Date
  end: Date
  daysInCycle: number
  daysElapsed: number
  daysLeft: number
}

export const getCurrentCycle = (period: BudgetPeriod, today: Date): Cycle => {
  const start = period === 'yearly' ? startOfYear(today) : startOfMonth(today)
  const end = period === 'yearly' ? endOfYear(today) : endOfMonth(today)

  const daysInCycle = differenceInCalendarDays(end, start) + 1
  const rawElapsed = differenceInCalendarDays(today, start) + 1
  const daysElapsed = Math.min(Math.max(rawElapsed, 1), daysInCycle)
  const daysLeft = Math.max(daysInCycle - daysElapsed, 0)

  return { start, end, daysInCycle, daysElapsed, daysLeft }
}
