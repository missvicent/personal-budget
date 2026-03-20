import { createContext, useContext, useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { DebtCollections } from '@/lib/tanstack-db'
import { createDebtCollections } from '@/lib/tanstack-db'

const DebtDBContext = createContext<DebtCollections | null>(null)

const ELECTRIC_URL =
  import.meta.env.VITE_ELECTRIC_URL ?? 'http://localhost:3001'

export function DebtDBProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth()

  const collections = useMemo(() => {
    if (!userId) return null
    return createDebtCollections(ELECTRIC_URL, userId)
  }, [userId])

  if (!collections) return null

  return (
    <DebtDBContext.Provider value={collections}>
      {children}
    </DebtDBContext.Provider>
  )
}

export function useDebtDB(): DebtCollections {
  const collections = useContext(DebtDBContext)
  if (!collections)
    throw new Error('useDebtDB must be used within DebtDBProvider')
  return collections
}
