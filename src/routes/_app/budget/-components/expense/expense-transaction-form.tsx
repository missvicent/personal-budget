import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ExpenseFormData } from '@/lib/schemas/expenses/expense.schema'
import type { SelectOptionGroup } from '@/components/shared/GroupedSelectField'
import type { ExpenseTransaction } from './expense-list'
import { Checkbox } from '@/components/ui/checkbox'
import { expenseSchema } from '@/lib/schemas/expenses/expense.schema'
import { GroupedSelectField } from '@/components/shared/GroupedSelectField'
import { Button } from '@/components/ui/button'
import {
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/shared/ResponsiveDialog'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { DatePickerInput } from '@/components/shared/DatepickerInput'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface ExpenseTransactionFormProps {
  groups: Array<SelectOptionGroup>
  isPending: boolean
  open: boolean
  onSubmit: (data: ExpenseFormData) => void
  selectedTransaction: ExpenseTransaction | null
}
export const ExpenseTransactionForm = ({
  groups,
  isPending,
  onSubmit,
  open,
  selectedTransaction,
}: ExpenseTransactionFormProps) => {
  const defaultValues = useMemo(() => {
    return {
      amount: 0,
      category_id: '',
      description: '',
      is_recurring: false,
      transaction_date: new Date(),
    }
  }, [])

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (data: ExpenseFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (selectedTransaction) {
      form.reset({
        amount: selectedTransaction.amount,
        category_id: selectedTransaction.category_id,
        description: selectedTransaction.description,
        is_recurring: selectedTransaction.is_recurring,
        transaction_date: new Date(selectedTransaction.transaction_date),
      })
    } else {
      form.reset(defaultValues)
    }
  }, [selectedTransaction, form, open, defaultValues])

  return (
    <Form {...form}>
      <ResponsiveDialogContent className="sm:max-w-sm">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {selectedTransaction ? 'Edit Expense' : 'Log an Expense'}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="sr-only">
              Fill in the details to {selectedTransaction ? 'edit' : 'add'} a
              new expense
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <FieldGroup>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How much did you spend?: </FormLabel>
                  <FormControl>
                    <CurrencyInput
                      id="amount"
                      min={0}
                      placeholder="0.00"
                      step={0.01}
                      type="number"
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What was it for?: </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="What did you spend on?"
                      autoComplete="off"
                      className="rounded-md"
                    />
                  </FormControl>
                  <FormDescription>
                    Describe it and we&apos;ll suggest a category automatically
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pick a category (optional):</FormLabel>
                  <FormControl>
                    <GroupedSelectField
                      groups={groups}
                      onChange={(selected) => field.onChange(selected.value)}
                      placeholder="Select Category (Optional)"
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transaction_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>When did you spend it?:</FormLabel>
                  <FormControl>
                    <DatePickerInput
                      ref={field.ref}
                      id="date"
                      placeholder="Select Date"
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <Checkbox
                    ref={field.ref}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel>Repeats regularly</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>
          <ResponsiveDialogFooter className="flex flex-row gap-2">
            <ResponsiveDialogClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </ResponsiveDialogClose>
            <Button type="submit" className="w-full" disabled={isPending}>
              {selectedTransaction ? 'Edit Expense' : 'Save Expense'}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </Form>
  )
}
