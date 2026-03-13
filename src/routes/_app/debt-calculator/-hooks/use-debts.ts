import { useQuery } from '@tanstack/react-db'
import { useDebtDB } from './use-debt-db'

export function useDebts() {
  const db = useDebtDB()
  return useQuery({
    collection: db.collections.debts,
    filter: (debt) => debt.is_active,
  })
}
