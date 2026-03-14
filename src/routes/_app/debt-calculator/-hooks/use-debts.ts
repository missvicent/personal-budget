import { useLiveQuery, eq } from '@tanstack/react-db'
import { useDebtDB } from './use-debt-db'

export function useDebts() {
  const { debts } = useDebtDB()
  return useLiveQuery((q) =>
    q.from({ debts }).where(({ debts }) => eq(debts.is_active, true)),
  )
}
