import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BudgetCategoryCard } from '@/components/shared'

export interface BudgetOverviewProps {
  currentMonth: string
  categories: Array<BudgetOverViewByCategory>
}
export interface BudgetOverViewByCategory {
  id: string
  Icon: ComponentType<LucideProps>
  category: string
  color: string
  amountSpent: number
  amountBudget: number
}

export const BudgetOverview = (budgetOverview: BudgetOverviewProps) => {
  const { currentMonth, categories } = budgetOverview
  return (
    <Card className="w-full gap-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Budget Overview</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {currentMonth}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-120 overflow-y-auto pt-4">
        {categories.map((c) => (
          <BudgetCategoryCard
            key={c.id}
            category={c.category}
            Icon={c.Icon}
            amountSpent={c.amountSpent}
            amountBudget={c.amountBudget}
            color={c.color}
          />
        ))}
      </CardContent>
    </Card>
  )
}
