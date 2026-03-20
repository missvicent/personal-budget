import { eq, useLiveQuery } from '@tanstack/react-db'
import { useDebtDB } from './use-debt-db'

export function useDebts() {
  const { debts } = useDebtDB()
  return useLiveQuery((q) =>
    q.from({ debts }).where((row) => eq(row.debts.is_active, true)),
  )
}
