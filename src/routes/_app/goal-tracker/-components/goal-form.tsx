import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { GoalFormData } from '@/lib/schemas/goal/goal.schema'
import type { GoalWithProgress } from '@/types/goal.types'
import { goalFormDefaults, goalSchema } from '@/lib/schemas/goal/goal.schema'
import {
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/shared/ResponsiveDialog'
import { FieldGroup } from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { DatePickerInput } from '@/components/shared/DatepickerInput'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface GoalFormProps {
  isPending: boolean
  onSubmit: (data: GoalFormData) => void
  selectedGoal: GoalWithProgress | null
}

export const GoalForm = ({
  isPending,
  onSubmit,
  selectedGoal,
}: GoalFormProps) => {
  const defaultValues = useMemo(() => {
    if (selectedGoal) {
      return {
        id: selectedGoal.id,
        name: selectedGoal.name,
        target_amount: selectedGoal.target_amount,
        target_date: selectedGoal.target_date
          ? new Date(selectedGoal.target_date)
          : null,
        category: selectedGoal.category ?? null,
        notes: selectedGoal.notes ?? null,
      }
    }
    return goalFormDefaults
  }, [selectedGoal])

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues,
    mode: 'onChange',
  })

  const formTitle = selectedGoal ? 'Edit Goal' : 'Create a Savings Goal'
  const formDescription = selectedGoal
    ? 'Update your savings goal details'
    : 'Set a target and start saving toward it'

  return (
    <Form {...form}>
      <ResponsiveDialogContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle className="mb-3">
              {formTitle}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="sr-only">
              {formDescription}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <FieldGroup>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are you saving for?:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Vacation, Emergency Fund"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target amount:</FormLabel>
                  <FormControl>
                    <CurrencyInput
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
              name="target_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target date (optional):</FormLabel>
                  <FormControl>
                    <DatePickerInput
                      ref={field.ref}
                      id="target_date"
                      placeholder="Select target date"
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value ?? undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional):</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Any details about this goal"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </ResponsiveDialogClose>
            <Button type="submit" disabled={isPending}>
              {selectedGoal ? 'Update' : 'Create Goal'}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </Form>
  )
}
