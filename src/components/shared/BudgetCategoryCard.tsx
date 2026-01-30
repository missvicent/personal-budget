import { Progress } from '../ui/progress'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

export const CATEGORY_COLORS = [
  {
    text: 'text-purple-500',
    bg: 'bg-purple-500/20',
    progress: '[&>div]:bg-purple-500',
  },
  {
    text: 'text-blue-500',
    bg: 'bg-blue-500/20',
    progress: '[&>div]:bg-blue-500',
  },
  {
    text: 'text-green-500',
    bg: 'bg-green-500/20',
    progress: '[&>div]:bg-green-500',
  },
  {
    text: 'text-orange-500',
    bg: 'bg-orange-500/20',
    progress: '[&>div]:bg-orange-500',
  },
  {
    text: 'text-pink-500',
    bg: 'bg-pink-500/20',
    progress: '[&>div]:bg-pink-500',
  },
  {
    text: 'text-cyan-500',
    bg: 'bg-cyan-500/20',
    progress: '[&>div]:bg-cyan-500',
  },
  {
    text: 'text-amber-500',
    bg: 'bg-amber-500/20',
    progress: '[&>div]:bg-amber-500',
  },
  {
    text: 'text-rose-500',
    bg: 'bg-rose-500/20',
    progress: '[&>div]:bg-rose-500',
  },
  {
    text: 'text-indigo-500',
    bg: 'bg-indigo-500/20',
    progress: '[&>div]:bg-indigo-500',
  },
  {
    text: 'text-teal-500',
    bg: 'bg-teal-500/20',
    progress: '[&>div]:bg-teal-500',
  },
] as const

export interface BudgetCategoryCardProps {
  amountBudget: number
  amountSpent: number
  category: string
  Icon: ComponentType<LucideProps>
  colorIndex?: number
}
export const BudgetCategoryCard = ({
  Icon,
  amountSpent,
  amountBudget,
  category,
  colorIndex = 0,
}: BudgetCategoryCardProps) => {
  const progressValue = (amountSpent / amountBudget) * 100
  const color = CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length]
  return (
    <div className="w-full space-y-2 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            className={`h-10 w-10 rounded-lg p-2 ${color.text} ${color.bg}`}
          />
          <p className="text-base font-semibold uppercase">{category}</p>
        </div>
        <p className="text-muted-foreground text-sm">
          ${amountSpent}/ ${amountBudget}
        </p>
      </div>
      <Progress
        value={Math.min(progressValue, 100)}
        className={
          progressValue > 100 ? '[&>div]:bg-destructive' : color.progress
        }
      />
    </div>
  )
}
