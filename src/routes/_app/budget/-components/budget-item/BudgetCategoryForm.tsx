import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { budgetItemSchema } from '@/lib/schemas/budget/budget-item.schema'
import { FieldGroup } from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { SelectField } from '@/components/shared/SelectField'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/hooks/categories/use-categories'
import { toSelectOptions } from '@/lib/utils'

interface BudgetCategoryFormProps {
  isPending: boolean
  onSubmit: (data: BudgetItemFormData) => void
  selectedBudgetItem: BudgetItemFormData | null
  usedCategoryIds: Array<string>
}

export const BudgetCategoryForm = ({
  isPending,
  onSubmit,
  selectedBudgetItem,
  usedCategoryIds,
}: BudgetCategoryFormProps) => {
  const { data: categories } = useCategories()

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

  const defaultValues = useMemo(() => {
    return {
      category_id: '',
      amount: 0,
      alert_enabled: false,
    }
  }, [])

  const form = useForm<BudgetItemFormData>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (data: BudgetItemFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <DialogContent>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle className="mb-3">Set your Budget</DialogTitle>
            <DialogDescription className="sr-only">
              Set your budget for a new category
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What&apos;s this for?: </FormLabel>
                  <FormControl>
                    <SelectField
                      items={categoryOptions}
                      onChange={(selected) => field.onChange(selected.value)}
                      value={field.value}
                      placeholder="Select a category"
                      aria-label="Category"
                      aria-describedby="category-description"
                      aria-required="true"
                      aria-invalid="false"
                      aria-autocomplete="list"
                      aria-controls="category-list"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-activedescendant="category-item-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Set your limit: </FormLabel>
                  <FormControl>
                    <CurrencyInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
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
                    {' '}
                    Stay in the loop! Enable notifications to get real-time
                    updates, reminders, and the stuff that actually matters to
                    you.
                  </FormLabel>
                </FormItem>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {selectedBudgetItem ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Form>
  )
}
