import { TanStackDB, collection } from '@tanstack/db'
import { ShapeStream } from '@electric-sql/client'
import type { Debt, DebtPayment } from '@/types/database.types'

const debtsCollection = collection<Debt>({
  id: 'debts',
  primaryKey: 'id',
})

const debtPaymentsCollection = collection<DebtPayment>({
  id: 'debt_payments',
  primaryKey: 'id',
})

export function createDebtDB(electricUrl: string, userId: string) {
  return new TanStackDB({
    collections: {
      debts: debtsCollection,
      debtPayments: debtPaymentsCollection,
    },
    sync: {
      debts: () =>
        new ShapeStream({
          url: `${electricUrl}/v1/shape`,
          table: 'debts',
          where: `user_id = '${userId}'`,
        }),
      debtPayments: () =>
        new ShapeStream({
          url: `${electricUrl}/v1/shape`,
          table: 'debt_payments',
          where: `user_id = '${userId}'`,
        }),
    },
  })
}

export type DebtDB = ReturnType<typeof createDebtDB>
