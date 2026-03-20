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
      className="group border-brand/45 text-brand hover:border-primary/50 focus-visible:ring-ring mt-1 flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed bg-white/60 p-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(124,106,240,0.12)] focus-visible:ring-2 focus-visible:outline-none dark:bg-[#7c6af0]/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(124,106,240,0.1)] dark:hover:shadow-[0_8px_32px_rgba(124,106,240,0.25),inset_0_1px_0_rgba(124,106,240,0.15)]"
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
