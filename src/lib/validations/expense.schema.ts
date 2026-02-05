import { z } from 'zod'

export const expenseSchema = z.object({
  amount: z
    .number('Amount is required')
    .positive('Amount must be greater than 0')
    .min(0.01, 'Amount must be greater than 0')
    .max(1000000, 'Amount exceeds maximum'),
  category_id: z
    .string('Category is required')
    .min(1, 'Category is required')
    .refine((val) => val !== 'all', 'Category is required'),
  description: z
    .string('Description is required')
    .min(1, 'Description is required')
    .max(255, 'Description too long'),
  transaction_date: z
    .date('Date is required')
    .refine((date) => date <= new Date(), 'Date cannot be in the future'),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>

export function toTransactionPayload(data: ExpenseFormData) {
  return {
    amount: data.amount,
    category_id: data.category_id,
    description: data.description,
    transaction_date: data.transaction_date.toISOString().split('T')[0],
    type: 'expense' as const,
  }
}
