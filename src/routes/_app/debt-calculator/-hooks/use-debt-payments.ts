import { useQuery } from '@tanstack/react-db'
import { useDebtDB } from './use-debt-db'

export function useDebtPayments(debtId?: string) {
  const db = useDebtDB()
  return useQuery({
    collection: db.collections.debtPayments,
    filter: debtId ? (payment) => payment.debt_id === debtId : undefined,
  })
}
