import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Debt } from '@/types/database.types'
import type { DebtFormData } from '@/lib/validations/debt.schema'
import {
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/shared/ResponsiveDialog'
import { debtSchema } from '@/lib/validations/debt.schema'

const DEBT_TYPE_OPTIONS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'auto_loan', label: 'Auto Loan' },
  { value: 'student_loan', label: 'Student Loan' },
  { value: 'mortgage', label: 'Mortgage' },
] as const

interface DebtFormProps {
  onSubmit: (data: DebtFormData) => void
  selectedDebt: Debt | null
  isPending: boolean
}

export function DebtForm({ onSubmit, selectedDebt, isPending }: DebtFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: selectedDebt
      ? {
          name: selectedDebt.name,
          type: selectedDebt.type,
          principal_amount: selectedDebt.principal_amount,
          interest_rate: selectedDebt.interest_rate,
          current_balance: selectedDebt.current_balance,
          minimum_payment: selectedDebt.minimum_payment,
          start_date: selectedDebt.start_date,
        }
      : {
          type: 'credit_card',
          start_date: new Date().toISOString().split('T')[0],
        },
  })

  return (
    <ResponsiveDialogContent className="sm:max-w-md">
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>
          {selectedDebt ? 'Edit Debt' : 'Add Debt'}
        </ResponsiveDialogTitle>
      </ResponsiveDialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="debt-name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="debt-name"
            {...register('name')}
            className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
            placeholder="e.g., Chase Sapphire"
          />
          {errors.name && (
            <p className="text-destructive mt-1 text-xs">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="debt-type" className="text-sm font-medium">
            Type
          </label>
          <select
            id="debt-type"
            {...register('type')}
            className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
          >
            {DEBT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="debt-principal-amount"
              className="text-sm font-medium"
            >
              Original Amount
            </label>
            <input
              id="debt-principal-amount"
              {...register('principal_amount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
            />
            {errors.principal_amount && (
              <p className="text-destructive mt-1 text-xs">
                {errors.principal_amount.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="debt-current-balance"
              className="text-sm font-medium"
            >
              Current Balance
            </label>
            <input
              id="debt-current-balance"
              {...register('current_balance', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
            />
            {errors.current_balance && (
              <p className="text-destructive mt-1 text-xs">
                {errors.current_balance.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="debt-interest-rate" className="text-sm font-medium">
              Interest Rate (%)
            </label>
            <input
              id="debt-interest-rate"
              {...register('interest_rate', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
            />
            {errors.interest_rate && (
              <p className="text-destructive mt-1 text-xs">
                {errors.interest_rate.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="debt-minimum-payment"
              className="text-sm font-medium"
            >
              Min Payment
            </label>
            <input
              id="debt-minimum-payment"
              {...register('minimum_payment', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
            />
            {errors.minimum_payment && (
              <p className="text-destructive mt-1 text-xs">
                {errors.minimum_payment.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="debt-start-date" className="text-sm font-medium">
            Start Date
          </label>
          <input
            id="debt-start-date"
            {...register('start_date')}
            type="date"
            className="border-input dark:bg-input/30 mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
          />
          {errors.start_date && (
            <p className="text-destructive mt-1 text-xs">
              {errors.start_date.message}
            </p>
          )}
        </div>

        <ResponsiveDialogFooter>
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? 'Saving...' : selectedDebt ? 'Update' : 'Add Debt'}
          </button>
        </ResponsiveDialogFooter>
      </form>
    </ResponsiveDialogContent>
  )
}
