import { useCallback, useMemo } from 'react'
import { useCreateBudgetItem } from './use-budget-item-create'
import type { Category } from '@/types/database.types'
import type { BudgetWithProgress } from '@/types/budget.types'
import type {
  SelectOptionGroup,
  SelectOptionItem,
} from '@/components/shared/GroupedSelectField'

export const useBudgetCategorySelect = (
  budgetId: string,
  categories: Array<Category>,
  budgetItems: Array<BudgetWithProgress>,
) => {
  const { mutateAsync: createBudgetItem } = useCreateBudgetItem()

  const budgetedCategoryIds = useMemo(
    () => new Set(budgetItems.map((bi) => bi.category_id)),
    [budgetItems],
  )

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.category_type === 'expense'),
    [categories],
  )

  const groups: Array<SelectOptionGroup> = useMemo(() => {
    const budgeted = expenseCategories.filter((c) =>
      budgetedCategoryIds.has(c.id),
    )
    const unbudgeted = expenseCategories.filter(
      (c) => !budgetedCategoryIds.has(c.id),
    )

    const result: Array<SelectOptionGroup> = []

    if (budgeted.length > 0) {
      result.push({
        label: 'Budgeted Categories',
        items: budgeted.map((c) => ({
          label: `${c.icon} ${c.name}`,
          value: c.id,
        })),
      })
    }

    if (unbudgeted.length > 0) {
      result.push({
        label: 'Other Categories',
        items: unbudgeted.map((c) => ({
          label: `${c.icon} ${c.name}`,
          value: c.id,
          description:
            'Will create a new budget category — edit later to set a limit',
        })),
      })
    }

    return result
  }, [expenseCategories, budgetedCategoryIds])

  const onCategorySelect = useCallback((selected: SelectOptionItem): string => {
    return selected.value
  }, [])

  const ensureBudgetItem = useCallback(
    async (categoryId: string, amount: number) => {
      if (!budgetedCategoryIds.has(categoryId)) {
        await createBudgetItem({
          budget_id: budgetId,
          category_id: categoryId,
          amount,
          alert_enabled: false,
          alert_threshold: 0,
        })
      }
    },
    [budgetId, budgetedCategoryIds, createBudgetItem],
  )

  return { groups, onCategorySelect, ensureBudgetItem }
}
