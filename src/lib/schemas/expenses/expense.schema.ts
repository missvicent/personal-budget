import { z } from 'zod'

export const expenseSchema = z.object({
  amount: z
    .number('Amount is required')
    .positive('Amount must be greater than 0')
    .min(0.01, 'Amount must be greater than 0')
    .max(1000000, 'Amount exceeds maximum'),
  category_id: z.string('').optional(),
  description: z
    .string('Description is required')
    .min(1, 'Description is required')
    .max(255, 'Description too long'),
  transaction_date: z
    .date('Date is required')
    .refine((date) => date <= new Date(), 'Date cannot be in the future'),
  is_recurring: z.boolean().optional(),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>

export function toTransactionPayload(
  data: ExpenseFormData,
  budgetId?: string,
  fallbackCategoryId?: string,
) {
  const { amount, category_id, description, transaction_date, is_recurring } =
    data
  return {
    amount,
    budget_id: budgetId ?? null,
    category_id: (category_id || fallbackCategoryId) ?? null,
    description,
    is_recurring: is_recurring ?? false,
    transaction_date: transaction_date.toISOString().split('T')[0],
    type: 'expense' as const,
  }
}
