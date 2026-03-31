import { parseISO } from 'date-fns'

import { Link } from '@tanstack/react-router'

import { useBudgetItemDisplay } from '../../-hooks/use-budget-item-display'
import { BudgetCardBadges } from '../budget-card/BudgetCardBadges'
import { BudgetCardProgress } from '../budget-card/BudgetCardProgress'
import { BudgetCardActions } from '../budget-card/BudgetCardActions'
import type { BudgetOverview } from '@/types/database.types'
import { formatDateRange, formatYear } from '@/lib/dates/formatDate'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export interface BudgetItemProps {
  budget: BudgetOverview
  onEdit: (budget: BudgetOverview) => void
  onDelete: (budget_id: string) => void
}

export const BudgetItem = ({ budget, onEdit, onDelete }: BudgetItemProps) => {
  const { budget_name, budget_amount, start_date, end_date, total_spent } =
    budget
  const { progressValue, status, badges, daysLeft } =
    useBudgetItemDisplay(budget)

  const url = `/budget/${budget.budget_id}`

  return (
    <Link to={url}>
      <Card className="group h-full backdrop-blur-sm">
        <CardHeader className="py-2">
          <CardTitle className="text-lg font-bold">{budget_name}</CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            {formatYear(parseISO(start_date))}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col px-6">
          <span className="text-muted-foreground dark:text-card-text-secondary mb-3 text-sm">
            {formatDateRange(parseISO(start_date), parseISO(end_date ?? ''))}
          </span>
          <BudgetCardBadges badges={badges} />
          <BudgetCardProgress
            totalSpent={total_spent}
            budgetAmount={budget_amount}
            progressValue={progressValue}
            status={status}
          />
          <div className="flex items-center gap-2">
            <div className="flex w-1/2 flex-col items-center">
              <span className="text-foreground dark:text-card-text-primary w-full text-lg font-bold">
                {daysLeft}
              </span>
              <span className="text-muted-foreground dark:text-card-text-muted w-full text-xs">
                days left
              </span>
            </div>
            <BudgetCardActions
              onEdit={() => onEdit(budget)}
              onDelete={() => onDelete(budget.budget_id)}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
