import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BudgetCategoryCard } from '@/components/shared'

export interface BudgetOverviewProps {
  currentMonth: string
  categories: Array<BudgetOverViewByCategory>
}
export interface BudgetOverViewByCategory {
  Icon: ComponentType<LucideProps>
  category: string
  amountSpent: number
  amountBudget: number
}

export const BudgetOverview = (budgetOverview: BudgetOverviewProps) => {
  const { currentMonth, categories } = budgetOverview
  return (
    <Card className="my-8 w-full gap-4">
      <CardHeader>
        <CardTitle>
          <p className="text-lg font-bold">Budget Overview</p>
          <p className="text-muted-foreground text-sm">{currentMonth}</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {categories.map((c, index) => (
          <BudgetCategoryCard
            key={c.category}
            category={c.category}
            Icon={c.Icon}
            amountSpent={c.amountSpent}
            amountBudget={c.amountBudget}
            colorIndex={index}
          />
        ))}
      </CardContent>
    </Card>
  )
}
