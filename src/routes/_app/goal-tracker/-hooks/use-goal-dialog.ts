import { useState } from 'react'
import type { GoalWithProgress } from '@/types/goal.types'

export const useGoalDialog = () => {
  const [open, setOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<GoalWithProgress | null>(
    null,
  )

  const openCreate = () => {
    setSelectedGoal(null)
    setOpen(true)
  }

  const openEdit = (goal: GoalWithProgress) => {
    setSelectedGoal(goal)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    setSelectedGoal(null)
  }

  return { open, selectedGoal, openCreate, openEdit, close, setOpen }
}
