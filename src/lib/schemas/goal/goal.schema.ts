import { z } from 'zod'

export const goalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(100),
  target_amount: z.number().min(1, 'Target amount must be at least $1'),
  target_date: z.date().nullable().optional(),
  category: z.string().max(50).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
})

export type GoalFormData = z.infer<typeof goalSchema>

export const goalFormDefaults: GoalFormData = {
  name: '',
  target_amount: 0,
  target_date: null,
  category: null,
  notes: null,
}

export function toGoalPayload(data: GoalFormData) {
  return {
    name: data.name,
    target_amount: data.target_amount,
    target_date: data.target_date?.toISOString().split('T')[0] ?? null,
    category: data.category || null,
    notes: data.notes || null,
  }
}
