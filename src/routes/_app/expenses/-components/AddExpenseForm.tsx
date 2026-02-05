import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Category } from '@/types/database.types'
import type { ExpenseFormData } from '@/lib/validations/expense.schema'
import { expenseSchema } from '@/lib/validations/expense.schema'
import { SelectField } from '@/components/shared/SelectField'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface AddExpenseFormProps {
  categories: Array<Category>
  onSubmit: (data: ExpenseFormData) => void
}
export const AddExpenseForm = ({
  categories,
  onSubmit,
}: AddExpenseFormProps) => {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category_id: '',
      description: '',
      transaction_date: undefined,
    },
  })

  const categoryOptions =
    categories.length > 0
      ? toSelectOptions(
          { label: 'Select Category', value: 'all' },
          categories,
          (c) => `${c.icon} ${c.name}`,
          (c) => c.id,
        )
      : []

  return (
    <Form {...form}>
      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
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
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
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
                      placeholder="Select Category"
                      value={field.value}
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
                    <Input
                      id="description"
                      name="description"
                      placeholder="What did you spend on?"
                      value={field.value}
                      onChange={field.onChange}
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
                      id="date"
                      placeholder="Select Date"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
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
            <Button type="submit" className="w-full">
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Form>
  )
}
