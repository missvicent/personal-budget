import { Card } from '@/components/ui/card'

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
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="cursor-pointer flex-col items-center justify-center gap-2 p-4 select-none hover:scale-105"
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-sm">{title}</div>
    </Card>
  )
}
