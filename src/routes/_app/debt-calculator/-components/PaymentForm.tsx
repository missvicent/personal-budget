import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Debt } from '@/types/database.types'
import type { DebtPaymentFormData } from '@/lib/validations/debt.schema'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { debtPaymentSchema } from '@/lib/validations/debt.schema'

interface PaymentFormProps {
  debt: Debt
  onSubmit: (data: DebtPaymentFormData) => void
  isPending: boolean
}

export function PaymentForm({ debt, onSubmit, isPending }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DebtPaymentFormData>({
    resolver: zodResolver(debtPaymentSchema),
    defaultValues: {
      amount_paid: debt.minimum_payment,
      payment_date: new Date().toISOString().split('T')[0],
      notes: null,
    },
  })

  const amountPaid = watch('amount_paid')

  const split = useMemo(() => {
    const monthlyInterest =
      debt.current_balance * (debt.interest_rate / 12 / 100)
    const interestPaid = Math.min(monthlyInterest, amountPaid || 0)
    const principalPaid = Math.max((amountPaid || 0) - interestPaid, 0)
    return { interestPaid, principalPaid }
  }, [amountPaid, debt.current_balance, debt.interest_rate])

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Record Payment — {debt.name}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="payment-amount" className="text-sm font-medium">
            Payment Amount
          </label>
          <input
            id="payment-amount"
            {...register('amount_paid', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
          />
          {errors.amount_paid && (
            <p className="text-destructive mt-1 text-xs">
              {errors.amount_paid.message}
            </p>
          )}
        </div>

        <div className="bg-muted rounded-md p-3">
          <p className="text-muted-foreground mb-2 text-xs font-medium">
            Estimated Split
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Principal</span>
              <p className="font-medium">
                {formatter.format(split.principalPaid)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Interest</span>
              <p className="font-medium text-red-500">
                {formatter.format(split.interestPaid)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="payment-date" className="text-sm font-medium">
            Payment Date
          </label>
          <input
            id="payment-date"
            {...register('payment_date')}
            type="date"
            className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
          />
          {errors.payment_date && (
            <p className="text-destructive mt-1 text-xs">
              {errors.payment_date.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="payment-notes" className="text-sm font-medium">
            Notes (optional)
          </label>
          <input
            id="payment-notes"
            {...register('notes')}
            className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
            placeholder="Optional note"
          />
        </div>

        <DialogFooter>
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? 'Recording...' : 'Record Payment'}
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
