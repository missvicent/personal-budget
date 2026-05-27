import { useClerk } from '@clerk/clerk-react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useApiMutation } from '../api/use-api-mutation'
import { deleteAccountService } from '@/services/delete-account.service'

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  return useApiMutation(
    async (api) => {
      await deleteAccountService.delete(api)
      await signOut()
      queryClient.clear()
      navigate({ to: '/' })
    },
    {
      onError: (error: Error) => {
        toast.error(error.message)
      },
    },
  )
}
