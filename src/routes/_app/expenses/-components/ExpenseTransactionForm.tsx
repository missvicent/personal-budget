import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Category } from '@/types/database.types'
import type { ExpenseFormData } from '@/lib/validations/expense.schema'
import type { ExpenseTransaction } from './ExpenseList'
import { Checkbox } from '@/components/ui/checkbox'
import { expenseSchema } from '@/lib/validations/expense.schema'
import { SelectField } from '@/components/shared/SelectField'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toSelectOptions } from '@/lib/utils'
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
  categories: Array<Category>
  isPending: boolean
  onSubmit: (data: ExpenseFormData) => void
  selectedTransaction: ExpenseTransaction | null
}
export const ExpenseTransactionForm = ({
  categories,
  isPending,
  onSubmit,
  selectedTransaction,
}: ExpenseTransactionFormProps) => {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category_id: '',
      description: '',
      is_recurring: false,
      transaction_date: undefined,
    },
  })

  const handleSubmit = (data: ExpenseFormData) => {
    onSubmit(data)
  }

  const categoryOptions = useMemo(
    () =>
      categories.length > 0
        ? toSelectOptions(
            { label: 'Select Category', value: 'all' },
            categories.filter((c) => c.category_type === 'expense'),
            (c) => `${c.icon} ${c.name}`,
            (c) => c.id,
          )
        : [],
    [categories],
  )

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
      form.reset({
        amount: 0,
        category_id: '',
        description: '',
        is_recurring: false,
        transaction_date: undefined,
      })
    }
  }, [selectedTransaction, form])

  return (
    <Form {...form}>
      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>
              {selectedTransaction ? 'Edit Expense' : 'Add Expense'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the details to {selectedTransaction ? 'edit' : 'add'} a
              new expense
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="What did you spend on?" />
                  </FormControl>
                  <FormDescription>
                    Type a description and we&apos;ll guess the category for
                    you.
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
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <SelectField
                      items={categoryOptions}
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
                  <FormLabel>Date</FormLabel>
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
                  <FormLabel>Is Recurring</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>
          <DialogFooter className="flex flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full" disabled={isPending}>
              {selectedTransaction ? 'Edit Expense' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Form>
  )
}
