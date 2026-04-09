import { toast } from 'sonner'

import { useAllocationMutations } from './use-allocation-mutations'
import type { BudgetWithProgress } from '@/types/budget.types'
import type { AllocationFormData } from '@/lib/schemas/budget/allocation.schema'
import { toAllocationPayload } from '@/lib/schemas/budget/allocation.schema'

export const useAllocationHandlers = (
  selectedAllocation: BudgetWithProgress | null,
  onSuccess: () => void,
) => {
  const mutations = useAllocationMutations()

  const handleSubmit = (data: AllocationFormData) => {
    if (selectedAllocation) {
      const { id, ...payload } = toAllocationPayload(data)
      mutations.updateAllocation(
        { id: selectedAllocation.allocation_id, ...payload },
        {
          onSuccess: () => {
            toast.success('Allocation updated successfully')
            onSuccess()
          },
        },
      )
    } else {
      mutations.createAllocation(toAllocationPayload(data), {
        onSuccess: () => {
          toast.success('Allocation created successfully')
          onSuccess()
        },
      })
    }
  }

  return {
    handleSubmit,
    isPending: mutations.isCreating || mutations.isUpdating,
  }
}
