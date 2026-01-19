import type { Category } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const categoriesService = {
  getAll: async (supabase: SupabaseClient): Promise<Array<Category>> => {
    const { data, error } = await supabase.from('categories').select('*')

    if (error) throw error
    return data
  },
  getTree: async (supabase: SupabaseClient): Promise<Array<Category>> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) throw error

    const parentCategories = data.filter((c) => !c.parent_id)
    return parentCategories.map((parent) => ({
      ...parent,
      children: data.filter((c) => c.parent_id === parent.id),
    }))
  },
  create: async (
    category: Omit<Category, 'id' | 'created_at' | 'user_id'>,
    supabase: SupabaseClient,
  ): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, is_system: false })
      .select()
      .single()
    if (error) throw error
    return data
  },
  update: async (
    id: string,
    category: Partial<Omit<Category, 'id' | 'created_at' | 'user_id'>>,
    supabase: SupabaseClient,
  ): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
  delete: async (id: string, supabase: SupabaseClient): Promise<void> => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  },
}
