import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export type Account = Tables<'accounts'>
export type CreateAccount = TablesInsert<'accounts'>
export type UpdateAccount = TablesUpdate<'accounts'>
