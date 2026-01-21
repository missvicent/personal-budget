import { cn } from '@/lib/utils'

export interface IconCardProps {
  title: string
  icon: React.ReactNode
  onClick?: () => void
}

export const IconCard = ({ title, icon, onClick }: IconCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick?.()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex flex-col items-center justify-center gap-2 transition-all duration-300',
        'cursor-pointer rounded-xl p-4 select-none',
        'border-2 border-gray-200 dark:border-purple-900/50',
        'bg-white text-black hover:bg-gray-50',
        'dark:bg-[#1a1525] dark:text-white dark:hover:bg-[#251d35]',
        'hover:scale-105 hover:shadow-md',
      )}
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-sm">{title}</div>
    </div>
  )
}
