import { createFileRoute } from '@tanstack/react-router'
import { useTransactions } from '@/hooks/use-transactions'
import { useSupabase } from '@/hooks/use-supabase'
import { useCategories } from '@/hooks/use-categories'

export const Route = createFileRoute('/_app/transactions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const supabase = useSupabase()
  const {
    data: Categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories(supabase)
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useTransactions(supabase, {})
  console.log(Categories)
  return <div>Hello Transactions!</div>
}
