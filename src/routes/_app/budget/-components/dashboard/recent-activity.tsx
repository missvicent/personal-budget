import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseItem } from '@/components/shared/ExpenseItem'
import { Separator } from '@/components/ui/separator'

export interface RecentActivityItem {
  amount: number
  category: string
  color: string
  date: string
  icon: string
  id: string
  title: string
}

export interface RecentActivityProps {
  recentActivity: Array<RecentActivityItem>
}

export const RecentActivity = ({ recentActivity }: RecentActivityProps) => {
  return (
    <Card className="w-full gap-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Last Transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="h-120 overflow-y-auto pt-4">
        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground text-base">
              No recent activity
            </p>
          </div>
        ) : (
          recentActivity.map((c, index) => (
            <div key={c.id}>
              {index > 0 && <Separator />}
              <ExpenseItem
                amount={c.amount}
                category={c.category}
                color={c.color}
                icon={c.icon}
                title={c.title}
              >
                <div className="flex items-center gap-2">
                  <ExpenseItem.Icon />
                  <ExpenseItem.Details>
                    <ExpenseItem.Meta>&bull; {c.date}</ExpenseItem.Meta>
                  </ExpenseItem.Details>
                </div>
                <ExpenseItem.Amount />
              </ExpenseItem>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
