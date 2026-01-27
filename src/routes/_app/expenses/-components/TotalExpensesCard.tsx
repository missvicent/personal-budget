import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface TotalExpensesCardProps {
  totalExpenses: number
  totalExpensesLabel: string
  totalTransactions: string
  onAddExpense: () => void
}

export const TotalExpensesCard = ({
  totalExpenses,
  totalExpensesLabel,
  totalTransactions,
  onAddExpense,
}: TotalExpensesCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <p className="text-foreground/20 text-sm"> {totalExpensesLabel}</p>
          <p className="text-3xl font-bold">${totalExpenses}</p>
          <p className="text-foreground/50 text-xs">#{totalTransactions}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={onAddExpense}
          >
            <PlusIcon className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
