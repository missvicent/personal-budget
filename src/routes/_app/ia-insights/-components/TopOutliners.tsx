import { AnomalyRow } from './AnomalyRow'
import type { ReactNode } from 'react'
import type { Anomaly } from '@/types/insights.types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  anomalies: Array<Anomaly>
  headerAction?: ReactNode
  isLoading?: boolean
}

const SKELETON_ROW_COUNT = 3

const SkeletonRow = () => (
  <div className="flex items-center gap-3 py-3">
    <Skeleton className="size-10 shrink-0 rounded-lg" />
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
    </div>
    <div className="flex shrink-0 flex-col items-end gap-1.5">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
)

export const TopOutliners = ({
  anomalies,
  headerAction,
  isLoading = false,
}: Props) => {
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
        {headerAction}
      </CardHeader>
      <CardContent>
        <div className="divide-border flex flex-col divide-y">
          {isLoading
            ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                <SkeletonRow key={i} />
              ))
            : anomalies.map((anomaly) => (
                <AnomalyRow key={anomaly.id} anomaly={anomaly} />
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
