import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseItem } from '@/components/shared/ExpenseItem'
import { ExpenseItemMeta } from '@/components/shared/ExpenseItemMeta'

export interface RecentActivityByCategory {
  amountSpent: number
  category: string
  color: string
  date: string
  Icon: ComponentType<LucideProps>
  id: string
  title: string
}

export const RecentActivity = ({
  recentActivity,
}: {
  recentActivity: Array<RecentActivityByCategory>
}) => {
  return (
    <Card className="w-full gap-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Last Transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="h-120 overflow-y-auto pt-4">
        {recentActivity.map((c) => (
          <ExpenseItem
            amountSpent={c.amountSpent}
            category={c.category}
            color={c.color}
            Icon={c.Icon}
            key={c.id}
            title={c.title}
          >
            <ExpenseItemMeta> • {c.date}</ExpenseItemMeta>
          </ExpenseItem>
        ))}
      </CardContent>
    </Card>
  )
}
