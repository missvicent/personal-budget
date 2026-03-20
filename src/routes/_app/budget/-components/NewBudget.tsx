import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNewBudgetActions } from '../-hooks/use-new-budget-actions'
import { PeriodSelector } from './PeriodSelector'
import type { NewBudgetFormData } from '@/lib/schemas/budget/new-budget.schema'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { newBudgetSchema } from '@/lib/schemas/budget/new-budget.schema'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DatePickerInput } from '@/components/shared/DatepickerInput'

export const NewBudgetDialog = ({
  onSubmit,
}: {
  onSubmit: (data: NewBudgetFormData) => void
}) => {
  const form = useForm<NewBudgetFormData>({
    resolver: zodResolver(newBudgetSchema),
    defaultValues: {
      period: 'monthly',
      start_date: '',
    },
  })

  const { handlePeriodChange, selectedPeriod } = useNewBudgetActions()

  return (
    <Form {...form}>
      <DialogContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
            name="period"
            render={() => (
              <FormItem>
                <FormLabel>Billing Period:</FormLabel>
                <PeriodSelector
                  value={selectedPeriod ?? 'monthly'}
                  onValueChange={handlePeriodChange(form)}
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
            <Button type="submit" className="w-2/3 p-5">
              Create Budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Form>
  )
}
