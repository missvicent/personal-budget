import type {
  PaginatedResponse,
  Transaction,
  TransactionFilters,
  TransactionWithCategory,
} from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const transactionsService = {
  getAll: async (
    supabase: SupabaseClient,
    filters: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> => {
    const {
      accountId,
      categoryId,
      type,
      startDate,
      endDate,
      page = 1,
      pageSize = 50,
    } = filters

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    const query = supabase
      .from('transactions')
      .select(
        `
        *,
        account:accounts(id, name, color),
        category:categories(id, name, icon, color)
        `,
        { count: 'exact' },
      )
      .order('transaction_date', { ascending: false })
      .range(from, to)

    if (accountId) query.eq('account_id', accountId)
    if (categoryId) query.eq('category_id', categoryId)
    if (type) query.eq('type', type)
    if (startDate) query.gte('transaction_date', startDate)
    if (endDate) query.lte('transaction_date', endDate)

    const { data, error, count } = await query
    if (error) throw new Error(`Failed to fetch transactions: ${error.message}`)

    return {
      data: data as Array<Transaction>,
      hasMore: (count ?? 0) > to + 1,
      total: count ?? 0,
    }
  },
  create: async (
    transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
    supabase: SupabaseClient,
  ): Promise<Transaction> => {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single()
    if (error) throw new Error(`Failed to create transaction: ${error.message}`)
    return data
  },
  delete: async (id: string, supabase: SupabaseClient): Promise<void> => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete transaction: ${error.message}`)
  },
  update: async (
    id: string,
    transaction: Partial<Transaction & { id: string }>,
    supabase: SupabaseClient,
  ): Promise<Transaction> => {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(`Failed to update transaction: ${error.message}`)
    return data
  },

  getTransactionsWithCategories: async (
    supabase: SupabaseClient,
    budgetId: string,
  ): Promise<Array<TransactionWithCategory>> => {
    const { data, error } = await supabase
      .rpc('get_transactions_with_categories', { p_budget_id: budgetId })
      .in('category_type', ['expense', 'general'])
      .order('transaction_date', { ascending: false })
    if (error)
      throw new Error(
        `Failed to fetch transactions with categories: ${error.message}`,
      )
    return data as Array<TransactionWithCategory>
  },
}
