import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'
import type { AllocationFormData } from '@/lib/schemas/budget/allocation.schema'
import type { BudgetWithProgress } from '@/types/budget.types'
import {
  createAllocationSchema,
  updateAllocationSchema,
} from '@/lib/schemas/budget/allocation.schema'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SelectField } from '@/components/shared/SelectField'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/hooks/categories/use-categories'
import { useGoals } from '@/hooks/goal/use-goals'
import { toSelectOptions } from '@/lib/utils'

interface AllocationFormProps {
  budgetId: string
  isPending: boolean
  onSubmit: (data: AllocationFormData) => void
  remainingBudget: number
  selectedAllocation: BudgetWithProgress | null
  usedCategoryIds: Array<string>
}

export const AllocationForm = ({
  budgetId,
  isPending,
  onSubmit,
  remainingBudget,
  selectedAllocation,
  usedCategoryIds,
}: AllocationFormProps) => {
  const { data: categories } = useCategories()
  const { data: goals } = useGoals()

  const categoryOptions = useMemo(
    () =>
      toSelectOptions(
        { label: 'Select a category', value: 'select' },
        (categories ?? []).filter((c) => c.category_type === 'expense'),
        (c) => `${c.icon} ${c.name}`,
        (c) => c.id,
      ).map((option) => ({
        ...option,
        disabled: usedCategoryIds.includes(option.value),
      })),
    [categories, usedCategoryIds],
  )

  const goalOptions = useMemo(
    () =>
      toSelectOptions(
        { label: 'Select a goal', value: 'select' },
        (goals ?? []).filter((g) => !g.is_achieved),
        (g) => `🎯 ${g.name}`,
        (g) => g.id,
      ),
    [goals],
  )

  const schema = useMemo(
    () =>
      selectedAllocation
        ? updateAllocationSchema(remainingBudget, selectedAllocation.amount)
        : createAllocationSchema(remainingBudget),
    [remainingBudget, selectedAllocation],
  )

  const defaultValues = useMemo(() => {
    if (selectedAllocation) {
      return {
        budget_id: selectedAllocation.budget_id,
        category_id: selectedAllocation.category_id ?? '',
        goal_id: selectedAllocation.goal_id ?? '',
        amount: selectedAllocation.amount,
        alert_enabled: selectedAllocation.alert_enabled,
        id: selectedAllocation.allocation_id,
        mode: (selectedAllocation.goal_id
          ? 'savings'
          : 'expense') satisfies AllocationFormData['mode'],
      }
    }
    return {
      budget_id: budgetId,
      category_id: '',
      goal_id: '',
      amount: 0,
      alert_enabled: false,
      mode: 'expense' as const,
    }
  }, [budgetId, selectedAllocation])

  const form = useForm<AllocationFormData>({
    resolver: zodResolver(schema) as Resolver<AllocationFormData>,
    defaultValues: defaultValues as AllocationFormData,
    mode: 'onChange',
  })

  const currentMode = useWatch({ control: form.control, name: 'mode' })

  const formTitle = selectedAllocation ? 'Edit your Budget' : 'Set your Budget'
  const formDescription = selectedAllocation
    ? 'Update the budget amount for this allocation'
    : 'Set your budget for a category or savings goal'

  const modeOptions = [
    { label: 'Expense', value: 'expense' },
    { label: 'Savings Goal', value: 'savings' },
  ]

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
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allocation type:</FormLabel>
                  <FormControl>
                    <SelectField
                      items={modeOptions}
                      onChange={(selected) => {
                        field.onChange(selected.value)
                        form.setValue('category_id', '')
                        form.setValue('goal_id', '')
                      }}
                      value={field.value}
                      placeholder="Select type"
                      disabled={selectedAllocation !== null}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {currentMode === 'expense' && (
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What&apos;s this for?:</FormLabel>
                    <FormControl>
                      <SelectField
                        items={categoryOptions}
                        onChange={(selected) => field.onChange(selected.value)}
                        value={field.value ?? ''}
                        placeholder="Select a category"
                        disabled={selectedAllocation !== null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentMode === 'savings' && (
              <FormField
                control={form.control}
                name="goal_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Which savings goal?:</FormLabel>
                    <FormControl>
                      <SelectField
                        items={goalOptions}
                        onChange={(selected) => field.onChange(selected.value)}
                        value={field.value ?? ''}
                        placeholder="Select a goal"
                        disabled={selectedAllocation !== null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Set your limit:</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Remaining budget: ${remainingBudget.toFixed(2)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alert_enabled"
              render={({ field }) => (
                <FormItem className="mb-2 flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">
                    Stay in the loop! Enable notifications to get real-time
                    updates, reminders, and the stuff that actually matters to
                    you.
                  </FormLabel>
                </FormItem>
              )}
            />
          </FieldGroup>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </ResponsiveDialogClose>
            <Button type="submit" disabled={isPending}>
              {selectedAllocation ? 'Update' : 'Save'}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </Form>
  )
}
