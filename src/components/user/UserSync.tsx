import { useSyncUser } from '@/hooks/useSyncUser'

export function UserSync({ children }: { children: React.ReactNode }) {
  // Run sync in background - never blocks rendering
  // Hook only runs when user is signed in (query is disabled otherwise)
  useSyncUser()
  return <>{children}</>
}
