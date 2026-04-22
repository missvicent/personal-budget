import { Brain, OctagonAlert } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { currencyFormatter } from '@/lib/format'

export interface InsightsSummaryStats {
  totalSpending: number
  totalIncome: number
  totalExpenses: number
  totalNet: number
}

const STATS = [
  { key: 'totalSpending', label: 'Total Spending' },
  { key: 'totalIncome', label: 'Total Income' },
  { key: 'totalExpenses', label: 'Total Expenses' },
  { key: 'totalNet', label: 'Net' },
] as const satisfies ReadonlyArray<{
  key: keyof InsightsSummaryStats
  label: string
}>

const handleWhyThese = () => {
  toast.success(
    'These Insights are picked by ranking by magnitude, recency and user pin story.',
    { position: 'bottom-right', duration: 5000 },
  )
}

export const InsightsSummary = ({
  insights,
}: {
  insights: InsightsSummaryStats
}) => {
  return (
    <Card className="w-full shadow-none">
      <CardHeader className="border-border flex flex-col items-start gap-2 border-b sm:flex-row sm:items-center">
        <Badge variant="default">
          <Brain className="h-2.5 w-2.5" />
          <span className="ml-1.5 text-xs font-medium">AI Generated</span>
        </Badge>
        <CardTitle className="text-muted-foreground/80 text-xl font-semibold">
          Insights from this period
        </CardTitle>
        <div className="sm:ml-auto">
          <Button variant="outline" size="sm" onClick={handleWhyThese}>
            <OctagonAlert className="h-2.5 w-2.5" /> Why these ?
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-4">
          {STATS.map(({ key, label }) => (
            <div
              key={key}
              className="border-border flex flex-col items-start justify-start sm:border-r sm:last:border-r-0 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0"
            >
              <div className="flex flex-col p-4">
                <span className="text-content-foreground text-sm font-medium">
                  {label}
                </span>
                <span className="text-content-foreground text-sm font-medium">
                  {currencyFormatter.format(insights[key])}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
