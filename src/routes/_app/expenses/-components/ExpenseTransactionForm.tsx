import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ExpenseFormData } from '@/lib/schemas/expenses/expense.schema'
import type { SelectOptionGroup } from '@/components/shared/GroupedSelectField'
import type { ExpenseTransaction } from './ExpenseList'
import { Checkbox } from '@/components/ui/checkbox'
import { expenseSchema } from '@/lib/schemas/expenses/expense.schema'
import { GroupedSelectField } from '@/components/shared/GroupedSelectField'
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
      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>
              {selectedTransaction ? 'Edit Expense' : 'Log an Expense'}
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
                      aria-label="Description"
                      aria-required="true"
                      aria-describedby="description-description"
                      aria-autocomplete="list"
                      aria-controls="description-list"
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
                      aria-label="Select date"
                      aria-describedby="select-date-description"
                      aria-required="true"
                      aria-invalid="false"
                      aria-autocomplete="list"
                      aria-controls="select-date-list"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-activedescendant="select-date-item-0"
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
                    aria-label="Is Recurring"
                    aria-describedby="is-recurring-description"
                    aria-required="false"
                    aria-invalid="false"
                    aria-autocomplete="list"
                    aria-controls="is-recurring-list"
                    aria-expanded="false"
                    aria-haspopup="true"
                    aria-activedescendant="is-recurring-item-0"
                  />
                  <FormLabel>Repeats regularly</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>
          <DialogFooter className="flex flex-row gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full"
                aria-label="Cancel"
                aria-describedby="cancel-description"
                aria-required="false"
                aria-invalid="false"
                aria-autocomplete="list"
                aria-controls="cancel-list"
                aria-expanded="false"
                aria-haspopup="true"
                aria-activedescendant="cancel-item-0"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              aria-label="Submit"
              aria-describedby="submit-description"
              aria-required="true"
              aria-invalid="false"
              aria-autocomplete="list"
              aria-controls="submit-list"
              aria-expanded="false"
              aria-haspopup="true"
              aria-activedescendant="submit-item-0"
            >
              {selectedTransaction ? 'Edit Expense' : 'Save Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Form>
  )
}
