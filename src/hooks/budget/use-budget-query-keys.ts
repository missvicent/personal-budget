export const useBudgetQueryKeys = () => {
  return {
    budgets: () => ['budgets'],
    allocation: (id: string) => ['budgets', 'allocations', id],
    overview: () => ['budgets', 'overview'],
  }
}
