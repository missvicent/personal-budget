import { createCollection } from '@tanstack/react-db'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { z } from 'zod'

const debtSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  type: z.enum([
    'credit_card',
    'personal_loan',
    'auto_loan',
    'student_loan',
    'mortgage',
  ]),
  principal_amount: z.coerce.number(),
  interest_rate: z.coerce.number(),
  current_balance: z.coerce.number(),
  minimum_payment: z.coerce.number(),
  start_date: z.string(),
  is_active: z.coerce.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

const debtPaymentSchema = z.object({
  id: z.string(),
  debt_id: z.string(),
  user_id: z.string(),
  amount_paid: z.coerce.number(),
  principal_paid: z.coerce.number(),
  interest_paid: z.coerce.number(),
  payment_date: z.string(),
  notes: z.string().nullable(),
  created_at: z.string(),
})

export function createDebtCollections(electricUrl: string, userId: string) {
  const debts = createCollection(
    electricCollectionOptions({
      id: 'debts',
      schema: debtSchema,
      getKey: (item) => item.id,
      shapeOptions: {
        url: `${electricUrl}/v1/shape`,
        params: { table: 'debts', where: `"user_id" = '${userId}'` },
      },
    }),
  )

  const debtPayments = createCollection(
    electricCollectionOptions({
      id: 'debt_payments',
      schema: debtPaymentSchema,
      getKey: (item) => item.id,
      shapeOptions: {
        url: `${electricUrl}/v1/shape`,
        params: { table: 'debt_payments', where: `"user_id" = '${userId}'` },
      },
    }),
  )

  return { debts, debtPayments }
}

export type DebtCollections = ReturnType<typeof createDebtCollections>
