import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export type AdviceVariant = 'burn_rate' | 'outlier' | 'pattern' | 'opportunity'

const VARIANT_STYLES: Record<AdviceVariant, { label: string; dot: string }> = {
  burn_rate: { label: 'BURN RATE', dot: 'bg-orange-500' },
  outlier: { label: 'OUTLIER', dot: 'bg-red-500' },
  pattern: { label: 'PATTERN', dot: 'bg-purple-500' },
  opportunity: { label: 'OPPORTUNITY', dot: 'bg-green-500' },
}

export type AdviceCardProps = {
  variant: AdviceVariant
  title?: string | null
  body: string | null
  badge?: string | null
  isLoading: boolean
}

export const AdviceCard = ({
  variant,
  title,
  body,
  badge,
  isLoading,
}: AdviceCardProps) => {
  const { label, dot } = VARIANT_STYLES[variant]

  return (
    <Card className="w-full shadow-none">
      <CardContent className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={cn('size-1.5 rounded-full', dot)} />
            <span className="text-content-foreground text-[10px] font-bold tracking-wider">
              {label}
            </span>
          </div>
          {badge && (
            <span className="text-muted-foreground text-xs font-medium">
              {badge}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-1.5">
            {title && (
              <p className="text-content-foreground text-sm leading-snug font-semibold">
                {title}
              </p>
            )}
            <p className="text-muted-foreground text-xs leading-relaxed">
              {body && body.length > 0 ? body : 'No data detected'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
