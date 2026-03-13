import type { Debt } from '@/types/database.types'
import { cn } from '@/lib/utils'

interface DebtSummaryProps {
  debts: Array<Debt>
}

export function DebtSummary({ debts }: DebtSummaryProps) {
  const totalOwed = debts.reduce((sum, d) => sum + d.current_balance, 0)
  const totalMinimum = debts.reduce((sum, d) => sum + d.minimum_payment, 0)
  const weightedRate =
    totalOwed > 0
      ? debts.reduce(
          (sum, d) => sum + d.interest_rate * (d.current_balance / totalOwed),
          0,
        )
      : 0

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const stats = [
    { label: 'Total Owed', value: formatter.format(totalOwed) },
    { label: 'Avg Rate', value: `${weightedRate.toFixed(1)}%` },
    { label: 'Monthly Min', value: formatter.format(totalMinimum) },
    { label: 'Active Debts', value: String(debts.length) },
  ]

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-4',
        'bg-card text-card-foreground',
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-muted-foreground text-xs">{stat.label}</p>
          <p className="text-lg font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
