export interface Category {
  color: string
  created_at: string
  display_order: number
  icon: string
  id: string
  is_system: boolean
  name: string
  parent_id: string | null
  category_type: 'income' | 'expense'
  updated_at: string
  user_id: string
}
