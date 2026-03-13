import { createContext, useContext, useEffect, useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { createDebtDB, type DebtDB } from '@/lib/tanstack-db'

const DebtDBContext = createContext<DebtDB | null>(null)

const ELECTRIC_URL = import.meta.env.VITE_ELECTRIC_URL ?? 'http://localhost:3001'

export function DebtDBProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth()

  const db = useMemo(() => {
    if (!userId) return null
    return createDebtDB(ELECTRIC_URL, userId)
  }, [userId])

  useEffect(() => {
    return () => {
      db?.close()
    }
  }, [db])

  if (!db) return null

  return (
    <DebtDBContext.Provider value={db}>{children}</DebtDBContext.Provider>
  )
}

export function useDebtDB(): DebtDB {
  const db = useContext(DebtDBContext)
  if (!db) throw new Error('useDebtDB must be used within DebtDBProvider')
  return db
}
