import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { GoalWithProgress } from '@/types/goal.types'
import type { ContributionFormData } from '@/lib/schemas/goal/contribution.schema'
import { contributionSchema } from '@/lib/schemas/goal/contribution.schema'
import {
  ResponsiveDialog,
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
import { currencyFormatter } from '@/lib/format'

interface AddFundsDialogProps {
  goal: GoalWithProgress | null
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ContributionFormData) => void
  open: boolean
}

export const AddFundsDialog = ({
  goal,
  isPending,
  onOpenChange,
  onSubmit,
  open,
}: AddFundsDialogProps) => {
  const defaultValues = useMemo(
    () => ({
      amount: 0,
      description: '',
      transaction_date: new Date(),
      goal_id: goal?.id ?? '',
    }),
    [goal],
  )

  const form = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
    defaultValues,
    mode: 'onChange',
  })

  const remaining = goal
    ? Math.max(0, goal.target_amount - goal.current_amount)
    : 0

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>
                Add Funds to {goal?.name}
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription className="text-muted-foreground text-sm">
                {remaining > 0
                  ? `${currencyFormatter.format(remaining)} remaining to reach your goal`
                  : 'Goal reached! Adding funds will overflow the target.'}
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
            <FieldGroup>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount:</FormLabel>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Freelance payment, Birthday money"
                        autoComplete="off"
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
                    <FormLabel>Date:</FormLabel>
                    <FormControl>
                      <DatePickerInput
                        ref={field.ref}
                        id="contribution_date"
                        placeholder="Select date"
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        value={field.value}
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
                Add Funds
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
