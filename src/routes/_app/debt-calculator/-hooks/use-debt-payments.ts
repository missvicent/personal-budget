import { eq, useLiveQuery } from '@tanstack/react-db'
import { useDebtDB } from './use-debt-db'

export function useDebtPayments(debtId?: string) {
  const { debtPayments } = useDebtDB()
  return useLiveQuery(
    (q) => {
      const base = q.from({ debtPayments })
      if (debtId) {
        return base.where(({ debtPayments }) =>
          eq(debtPayments.debt_id, debtId),
        )
      }
      return base
    },
    [debtId],
  )
}
