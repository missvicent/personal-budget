import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Account, CreateAccount } from '@/types/database.types'
import { accountService } from '@/services/account.service'
import { useSupabase } from '@/contexts/SupabaseContext'

export const queryKeys = {
  accounts: () => ['accounts'],
  account: (id: string) => ['accounts', id],
  accountWithTransactions: (id: string) => ['accounts', id, 'transactions'],
}

export const useAccounts = () => {
  const supabase = useSupabase()
  return useQuery({
    queryKey: queryKeys.accounts(),
    queryFn: () => accountService.getAll(supabase),
  })
}

export const useAccount = (id: string) => {
  const supabase = useSupabase()
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => accountService.getById(id, supabase),
  })
}

export const useCreateAccount = () => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (account: CreateAccount) =>
      accountService.create(account, supabase),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.accounts(), (old: Array<Account>) => [
        ...old,
        data,
      ])
    },
  })
}

export const useUpdateAccount = (id: string, account: Account) => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => accountService.update(id, account, supabase),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.account(id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.account(id) })
    },
  })
}

export const useDeleteAccount = (id: string) => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => accountService.delete(id, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts() })
      queryClient.removeQueries({ queryKey: queryKeys.account(id) })
    },
  })
}
