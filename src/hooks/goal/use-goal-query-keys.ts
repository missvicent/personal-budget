export const useGoalQueryKeys = () => {
  return {
    goals: () => ['goals'],
    goal: (id: string) => ['goals', id],
  }
}
