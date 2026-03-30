import { PlusIcon } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

interface CreateCardProps {
  children: React.ReactNode
  onClick: () => void
}

export const CreateCard = ({ children, onClick }: CreateCardProps) => {
  return (
    <Card variant="dashed" className="flex h-78 items-center justify-center">
      <CardContent>
        <button
          type="button"
          onClick={onClick}
          className="group mt-1 w-full cursor-pointer"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="group-hover:bg-primary/20 rounded-md border p-2 transition-transform group-hover:scale-130 group-hover:border-transparent">
              <PlusIcon className="text-muted-foreground group-hover:text-primary size-4" />
            </div>
            {children}
          </div>
        </button>
      </CardContent>
    </Card>
  )
}
