import { Card, CardContent, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
import { currencyFormatter, percentFormatter } from '@/lib/format'
import { spendingColors } from '@/lib/colors'

export interface StatCardProps {
  additionalDescription: string
  amountSpent?: number
  badgeType?: 'positive' | 'negative'
  percentage?: number
  symbol: string
  title: string
  tone?: 'warning'
}

export const StatCard = ({
  additionalDescription,
  amountSpent,
  badgeType,
  percentage,
  symbol,
  title,
  tone,
}: StatCardProps) => {
  const colors =
    badgeType === 'positive'
      ? spendingColors['under-budget']
      : spendingColors['over-budget']
  const badgeColor = `${colors.text} ${colors.bg}`

  const formattedAmount =
    symbol === '%'
      ? percentFormatter.format(percentage ?? 0)
      : currencyFormatter.format(amountSpent ?? 0)

  const showBadge = percentage !== undefined && badgeType !== undefined

  return (
    <Card className={cn(tone === 'warning' && 'border-destructive border-l-4')}>
      <CardHeader className="flex flex-row items-center justify-between">
        <p className="text-base font-semibold uppercase">{title}</p>
        {showBadge && (
          <Badge
            variant="outline"
            className={cn(badgeColor, 'border-0 px-3 py-1')}
          >
            <p className="font-mono text-base">{percentage}%</p>
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="mb-6 font-mono text-3xl font-bold">{formattedAmount}</p>
        <p className="text-muted-foreground text-xs">{additionalDescription}</p>
      </CardContent>
    </Card>
  )
}
