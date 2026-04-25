import { AnomalyRow } from './AnomalyRow'
import type { Anomaly } from '@/types/insights.types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const TopOutliners = ({ anomalies }: { anomalies: Array<Anomaly> }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-start">
          <CardTitle className="text-content-foreground flex items-start gap-2">
            <span className="text-base">Top Outliners</span>
            <span className="text-sm">flagged by AI</span>
          </CardTitle>
          <CardDescription>
            Transactions that broke the typical pattern for this budget
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View all transactions
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-border flex flex-col divide-y">
          {anomalies.map((anomaly) => (
            <AnomalyRow key={anomaly.id} anomaly={anomaly} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
