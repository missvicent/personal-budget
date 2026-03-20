import type { PayoffResult } from '../-lib/payoff-strategies'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PayoffComparisonProps {
  snowball: PayoffResult
  avalanche: PayoffResult
  extraPayment: number
  onExtraPaymentChange: (value: number) => void
  interestSaved: number
}

export function PayoffComparison({
  snowball,
  avalanche,
  extraPayment,
  onExtraPaymentChange,
  interestSaved,
}: PayoffComparisonProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const hasDebts = snowball.debtPayoffOrder.length > 0

  return (
    <Card className="sticky top-4 gap-4 p-4">
      <h3 className="text-sm font-semibold">Payoff Comparison</h3>

      <div>
        <label
          htmlFor="extra-monthly-payment"
          className="text-muted-foreground mb-1 block text-xs"
        >
          Extra Monthly Payment
        </label>
        <input
          id="extra-monthly-payment"
          type="number"
          min={0}
          step={50}
          value={extraPayment}
          onChange={(e) => onExtraPaymentChange(Number(e.target.value) || 0)}
          className="border-input bg-background w-full rounded-md border px-3 py-1.5 text-sm"
          placeholder="$0"
        />
      </div>

      {!hasDebts ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          Add debts to see payoff strategies
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StrategyColumn
              title="Snowball"
              subtitle="Smallest balance first"
              result={snowball}
              formatter={formatter}
            />
            <StrategyColumn
              title="Avalanche"
              subtitle="Highest rate first"
              result={avalanche}
              formatter={formatter}
            />
          </div>

          {interestSaved > 0 && (
            <p className="bg-muted rounded-md p-2 text-center text-xs">
              Avalanche saves{' '}
              <span className="font-semibold text-green-500">
                {formatter.format(interestSaved)}
              </span>{' '}
              in interest
            </p>
          )}
        </>
      )}
    </Card>
  )
}

function StrategyColumn({
  title,
  subtitle,
  result,
  formatter,
}: {
  title: string
  subtitle: string
  result: PayoffResult
  formatter: Intl.NumberFormat
}) {
  const isOverLimit = result.totalMonths >= 360

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Months</span>
          <span className={cn('font-medium', isOverLimit && 'text-red-500')}>
            {isOverLimit ? '30+ yrs' : result.totalMonths}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Interest</span>
          <span className="font-medium">
            {formatter.format(result.totalInterestPaid)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Paid</span>
          <span className="font-medium">
            {formatter.format(result.totalPaid)}
          </span>
        </div>
      </div>
      {result.debtPayoffOrder.length > 0 && (
        <div className="border-t pt-2">
          <p className="text-muted-foreground mb-1 text-xs font-medium">
            Payoff Order
          </p>
          <ol className="flex flex-col gap-0.5">
            {result.debtPayoffOrder.map((d, i) => (
              <li key={d.debtId} className="text-xs">
                {i + 1}. {d.name}{' '}
                <span className="text-muted-foreground">
                  (mo {d.payoffMonth})
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
