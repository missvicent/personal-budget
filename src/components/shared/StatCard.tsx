import { Card, CardContent, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  amountSpent: number
  additionalDescription: string
  title: string
  percentage?: number
  badgeType?: 'positive' | 'negative'
}
export const StatCard = ({
  title,
  percentage,
  badgeType,
  amountSpent,
  additionalDescription,
}: StatCardProps) => {
  const badgeColor =
    badgeType === 'positive'
      ? 'text-green-500 bg-green-500/10'
      : 'text-red-500 bg-red-500/10'
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <p className="text-base font-semibold uppercase">{title}</p>
        {percentage && (
          <Badge
            variant="outline"
            className={cn(badgeColor, 'border-0 px-3 py-1')}
          >
            <p className="text-base">{percentage}%</p>
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-3xl font-bold">${amountSpent}</p>
        <p className="text-muted-foreground text-xs">{additionalDescription}</p>
      </CardContent>
    </Card>
  )
}
