import { PlusIcon } from 'lucide-react'

interface CreateCardProps {
  children: React.ReactNode
  onClick: () => void
}

export const CreateCard = ({ children, onClick }: CreateCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-sidebar hover:border-primary/50 focus-visible:ring-ring mt-3 flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-12 focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="group-hover:bg-primary/20 rounded-md border p-2 transition-transform group-hover:scale-130 group-hover:border-transparent">
          <PlusIcon className="text-muted-foreground group-hover:text-primary size-4" />
        </div>
        {children}
      </div>
    </button>
  )
}
