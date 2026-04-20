import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Category } from '@/types/database.types'
import type { BudgetFormData } from '@/lib/validations/budget.schema'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { budgetSchema } from '@/lib/validations/budget.schema'
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

interface BudgetCategoryFormProps {
  categories: Array<Category>
  isPending: boolean
  onSubmit: (data: BudgetFormData) => void
  open: boolean
  selectedCategory: Category | null
}

export const BudgetCategoryForm = ({
  categories,
  isPending,
  onSubmit,
  selectedCategory,
}: BudgetCategoryFormProps) => {
  const defaultValues = useMemo(() => {
    return {
      category_id: '',
      amount: 0,
      alert_enabled: false,
      period: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    }
  }, [])

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (data: BudgetFormData) => {
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
                      items={categories.map((category) => ({
                        label: category.name,
                        value: category.id,
                      }))}
                      onChange={(selected) => field.onChange(selected.value)}
                      value={field.value}
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
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How often (Optional): </FormLabel>
                  <FormControl>
                    <SelectField
                      items={['Weekly', 'Monthly', 'Yearly'].map((period) => ({
                        label: period,
                        value: period,
                      }))}
                      onChange={(selected) => field.onChange(selected.value)}
                      value={field.value || 'monthly'}
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
              {selectedCategory ? 'Edit Category' : 'Save Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Form>
  )
}
