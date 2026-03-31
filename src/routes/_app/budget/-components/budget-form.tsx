import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PeriodSelector } from './period-selector'
import type { Budget } from '@/types/database.types'
import type { BudgetFormData } from '@/lib/schemas/budget/budget.schema'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  budgetFormDefaults,
  budgetSchema,
} from '@/lib/schemas/budget/budget.schema'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { DatePickerInput } from '@/components/shared/DatepickerInput'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const BudgetForm = ({
  isPending,
  onSubmit,
  open,
  selectedBudget,
}: {
  open: boolean
  isPending: boolean
  onSubmit: (
    data: BudgetFormData,
    dirtyFields: Partial<Record<keyof BudgetFormData, boolean>>,
  ) => void
  selectedBudget: Budget | null
}) => {
  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: budgetFormDefaults,
  })

  const submitButtonText = selectedBudget ? 'Update Budget' : 'Create Budget'

  useEffect(() => {
    if (!open) return

    if (selectedBudget) {
      form.reset({
        id: selectedBudget.id,
        name: selectedBudget.name,
        amount: selectedBudget.amount,
        period: selectedBudget.period,
        start_date: selectedBudget.start_date,
      })
    } else {
      form.reset(budgetFormDefaults)
    }
  }, [open, form, selectedBudget])

  return (
    <Form {...form}>
      <DialogContent>
        <form
          onSubmit={form.handleSubmit((data) =>
            onSubmit(data, form.formState.dirtyFields),
          )}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Set Up Your Budget</DialogTitle>
            <DialogDescription className="sr-only">
              Set Up Your Budget for a new period
            </DialogDescription>
          </DialogHeader>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Name:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Amount:</FormLabel>
                <FormControl>
                  <CurrencyInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Period:</FormLabel>
                <PeriodSelector
                  value={field.value ?? 'monthly'}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose a date:</FormLabel>
                <FormControl>
                  <DatePickerInput
                    id="start_date"
                    placeholder="Choose a date"
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date.toISOString())}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  The backend calculates the end date automatically from this
                  start date.
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="flex w-full gap-2">
            <DialogClose asChild className="w-1/3">
              <Button variant="outline" className="p-5">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="w-2/3 p-5" disabled={isPending}>
              {isPending ? 'Saving...' : submitButtonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Form>
  )
}
