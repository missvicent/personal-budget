import type { BudgetItem } from '@/types/budget.types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface BudgetItemCardProps {
  budgetItem: BudgetItem
}

export const BudgetItemCard = ({ budgetItem }: BudgetItemCardProps) => {
  console.log(budgetItem)
  const { category_name, amount } = budgetItem
  const progressValue = (amount / budgetItem.budget_amount) * 100

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col justify-between gap-2">
          <h3 className="text-lg font-semibold">{category_name}</h3>
          <Badge variant="outline">{progressValue.toFixed(2)}%</Badge>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">${amount}</p>
            <p className="text-muted-foreground text-sm">
              ${budgetItem.budget_amount}
            </p>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
