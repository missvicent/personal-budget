import { z } from 'zod'

export const contributionSchema = z.object({
  amount: z
    .number()
    .min(0.01, 'Amount must be at least $0.01')
    .max(1_000_000, 'Amount too large'),
  description: z.string().min(1, 'Description is required').max(255),
  transaction_date: z.date().refine((date) => date <= new Date(), {
    message: 'Date cannot be in the future',
  }),
  goal_id: z.string().min(1),
})

export type ContributionFormData = z.infer<typeof contributionSchema>

export function toContributionPayload(data: ContributionFormData) {
  return {
    amount: data.amount,
    description: data.description,
    transaction_date:
      data.transaction_date instanceof Date
        ? data.transaction_date.toISOString().split('T')[0]
        : data.transaction_date,
    goal_id: data.goal_id,
    category_id: null,
    type: 'income' as const,
  }
}
