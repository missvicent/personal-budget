import { useCreateAllocation } from '@/hooks/allocation/use-allocation-create'
import { useDeleteAllocation } from '@/hooks/allocation/use-allocation-delete'

export const useAllocationMutations = () => {
  const { mutate: createAllocation, isPending: isCreating } =
    useCreateAllocation()
  const { mutate: deleteAllocation, isPending: isDeleting } =
    useDeleteAllocation()
  return { createAllocation, deleteAllocation, isCreating, isDeleting }
}
