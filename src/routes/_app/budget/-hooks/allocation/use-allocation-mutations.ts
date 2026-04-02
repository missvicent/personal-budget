import { useCreateAllocation } from '@/hooks/allocation/use-allocation-create'
import { useDeleteAllocation } from '@/hooks/allocation/use-allocation-delete'
import { useUpdateAllocation } from '@/hooks/allocation/use-allocation-update'

export const useAllocationMutations = () => {
  const { mutate: createAllocation, isPending: isCreating } =
    useCreateAllocation()
  const { mutate: deleteAllocation, isPending: isDeleting } =
    useDeleteAllocation()
  const { mutate: updateAllocation, isPending: isUpdating } =
    useUpdateAllocation()
  return {
    createAllocation,
    deleteAllocation,
    updateAllocation,
    isCreating,
    isDeleting,
    isUpdating,
  }
}
