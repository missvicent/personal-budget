import type { ReactNode } from 'react'

export const ExpenseItemMeta = ({ children }: { children: ReactNode }) => (
  <p className="text-muted-foreground text-sm capitalize">{children}</p>
)
