import { z } from 'zod'

export const debtSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum([
    'credit_card',
    'personal_loan',
    'auto_loan',
    'student_loan',
    'mortgage',
  ]),
  principal_amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(10_000_000),
  interest_rate: z
    .number()
    .min(0, 'Rate cannot be negative')
    .max(100, 'Rate cannot exceed 100%'),
  current_balance: z
    .number()
    .min(0, 'Balance cannot be negative')
    .max(10_000_000),
  minimum_payment: z
    .number()
    .min(0, 'Payment cannot be negative')
    .max(1_000_000),
  start_date: z.string().min(1, 'Start date is required'),
})

export type DebtFormData = z.infer<typeof debtSchema>

export function toDebtPayload(data: DebtFormData) {
  return {
    ...data,
    is_active: true,
  }
}

export const debtPaymentSchema = z.object({
  amount_paid: z.number().min(0.01, 'Payment must be greater than 0'),
  payment_date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500).nullable().optional(),
})

export type DebtPaymentFormData = z.infer<typeof debtPaymentSchema>

export function toDebtPaymentPayload(
  data: DebtPaymentFormData,
  debtId: string,
  currentBalance: number,
  annualRate: number,
) {
  const monthlyInterest = currentBalance * (annualRate / 12 / 100)
  const interestPaid = Math.min(monthlyInterest, data.amount_paid)
  const principalPaid = data.amount_paid - interestPaid

  return {
    debt_id: debtId,
    amount_paid: data.amount_paid,
    principal_paid: Math.max(principalPaid, 0),
    interest_paid: Math.max(interestPaid, 0),
    payment_date: data.payment_date,
    notes: data.notes ?? null,
  }
}
