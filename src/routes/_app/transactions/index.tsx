import { createFileRoute } from '@tanstack/react-router'
import { useSupabase } from '@/hooks/use-supabase'
import { useCategories } from '@/hooks/use-categories'
import { IconCard } from '@/components/shared'

export const Route = createFileRoute('/_app/transactions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const supabase = useSupabase()
  const { data: Categories } = useCategories(supabase)

  const handleClick = (categoryId: string) => {
    console.log(categoryId)
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-6">
        {Categories?.map((category) => (
          <IconCard
            key={category.id}
            title={category.name}
            icon={category.icon}
            onClick={() => handleClick(category.id)}
          />
        ))}
      </div>
    </div>
  )
}
