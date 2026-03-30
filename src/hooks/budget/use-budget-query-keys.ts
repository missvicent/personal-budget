export const useBudgetQueryKeys = () => {
  return {
    budgets: () => ['budgets'],
    budgetItem: (id: string) => ['budgets', 'items', id],
    overview: () => ['budgets', 'overview'],
  }
}
