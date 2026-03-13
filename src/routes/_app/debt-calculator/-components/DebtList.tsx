import type { Debt } from '@/types/database.types'
import { DebtCard } from './DebtCard'

interface DebtListProps {
  debts: Array<Debt>
  onEdit: (debt: Debt) => void
  onRecordPayment: (debt: Debt) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function DebtList({
  debts,
  onEdit,
  onRecordPayment,
  onDelete,
  isDeleting,
}: DebtListProps) {
  if (debts.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium">No debts tracked yet</p>
        <p className="text-sm">Add your first debt to start planning your payoff strategy.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {debts.map((debt) => (
        <DebtCard
          key={debt.id}
          debt={debt}
          onEdit={onEdit}
          onRecordPayment={onRecordPayment}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}
