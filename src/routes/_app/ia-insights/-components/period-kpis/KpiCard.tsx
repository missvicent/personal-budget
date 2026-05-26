import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type KpiCardProps = {
  label: string
  value: ReactNode
  subText?: ReactNode
  viz?: ReactNode
  isLoading?: boolean
}

export const KpiCard = ({
  label,
  value,
  subText,
  viz,
  isLoading = false,
}: KpiCardProps) => {
  return (
    <Card className="w-full shadow-none">
      <CardContent className="flex flex-col gap-2 p-4">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </span>

        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <span className="text-3xl font-semibold">{value}</span>
        )}

        {isLoading ? (
          <Skeleton className="h-3 w-32" />
        ) : (
          subText && <div className="text-xs">{subText}</div>
        )}

        {isLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          viz && <div className="mt-1 h-9 w-full">{viz}</div>
        )}
      </CardContent>
    </Card>
  )
}
