export const useCategoriesQueryKeys = () => {
  return {
    categories: () => ['categories'],
    category: (id: string) => ['categories', id],
  }
}
