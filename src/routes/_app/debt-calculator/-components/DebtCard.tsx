import {
  Banknote,
  Car,
  CircleDollarSign,
  CreditCard,
  GraduationCap,
  Home,
} from 'lucide-react'
import type { Debt } from '@/types/database.types'
import { Card } from '@/components/ui/card'
import { CardActions } from '@/components/shared/card-actions'

const DEBT_TYPE_CONFIG = {
  credit_card: { icon: CreditCard, label: 'Credit Card' },
  personal_loan: { icon: Banknote, label: 'Personal Loan' },
  auto_loan: { icon: Car, label: 'Auto Loan' },
  student_loan: { icon: GraduationCap, label: 'Student Loan' },
  mortgage: { icon: Home, label: 'Mortgage' },
} as const

interface DebtCardProps {
  debt: Debt
  onEdit: (debt: Debt) => void
  onRecordPayment: (debt: Debt) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function DebtCard({
  debt,
  onEdit,
  onRecordPayment,
  onDelete,
}: DebtCardProps) {
  const config = DEBT_TYPE_CONFIG[debt.type]
  const Icon = config.icon
  const paidOffPercent =
    debt.principal_amount > 0
      ? Math.round(
          ((debt.principal_amount - debt.current_balance) /
            debt.principal_amount) *
            100,
        )
      : 0

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <Card className="gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{debt.name}</p>
            <p className="text-muted-foreground text-xs">{config.label}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">
            {formatter.format(debt.current_balance)}
          </p>
          <p className="text-muted-foreground text-xs">balance</p>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-muted-foreground text-xs">APR</p>
            <p className="text-sm font-semibold text-red-500">
              {debt.interest_rate}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Min Payment</p>
            <p className="text-sm font-semibold">
              {formatter.format(debt.minimum_payment)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Paid Off</p>
            <p className="text-sm font-semibold text-green-500">
              {paidOffPercent}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-1 border-t pt-2">
        <button
          onClick={() => onRecordPayment(debt)}
          className="text-muted-foreground hover:text-foreground rounded p-1.5 transition-colors"
          title="Record payment"
        >
          <CircleDollarSign className="h-4 w-4" />
        </button>
        <CardActions
          onEdit={() => onEdit(debt)}
          onDelete={() => onDelete(debt.id)}
          showOnHover={false}
        />
      </div>
    </Card>
  )
}
