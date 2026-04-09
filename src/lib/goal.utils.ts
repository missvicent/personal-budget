import { addMonths, differenceInMonths, format } from 'date-fns'
import type { GoalWithProgress } from '@/types/goal.types'

export type GoalStatus = 'in_progress' | 'achieved' | 'overflowed'

export function getGoalStatus(goal: GoalWithProgress): GoalStatus {
  if (!goal.is_achieved) return 'in_progress'
  return goal.current_amount > goal.target_amount ? 'overflowed' : 'achieved'
}

export function getGoalProgressPercent(goal: GoalWithProgress): number {
  if (goal.target_amount === 0) return 0
  return Math.min((goal.current_amount / goal.target_amount) * 100, 999)
}

export function getOverflowAmount(goal: GoalWithProgress): number {
  return Math.max(0, goal.current_amount - goal.target_amount)
}

export function getProjectedCompletionDate(
  goal: GoalWithProgress,
): string | null {
  if (goal.is_achieved) return null
  if (goal.current_amount === 0) return null

  const createdAt = new Date(goal.created_at ?? new Date())
  const now = new Date()
  const monthsElapsed = Math.max(1, differenceInMonths(now, createdAt))
  const monthlyRate = goal.current_amount / monthsElapsed
  const remaining = goal.target_amount - goal.current_amount

  if (monthlyRate <= 0) return null

  const monthsToGo = Math.ceil(remaining / monthlyRate)
  const projectedDate = addMonths(now, monthsToGo)
  return format(projectedDate, 'MMM yyyy')
}
