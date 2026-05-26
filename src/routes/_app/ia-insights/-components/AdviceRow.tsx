import { AlertTriangle, Flame, Lightbulb, Repeat } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export type AdviceVariant = 'burn_rate' | 'outlier' | 'pattern' | 'opportunity'

const VARIANT_STYLES: Record<
  AdviceVariant,
  { label: string; icon: LucideIcon; iconBg: string; iconText: string }
> = {
  burn_rate: {
    label: 'Burn rate',
    icon: Flame,
    iconBg: 'bg-orange-500/10',
    iconText: 'text-orange-500',
  },
  outlier: {
    label: 'Outlier',
    icon: AlertTriangle,
    iconBg: 'bg-red-500/10',
    iconText: 'text-red-500',
  },
  pattern: {
    label: 'Pattern',
    icon: Repeat,
    iconBg: 'bg-purple-500/10',
    iconText: 'text-purple-500',
  },
  opportunity: {
    label: 'Opportunity',
    icon: Lightbulb,
    iconBg: 'bg-green-500/10',
    iconText: 'text-green-500',
  },
}

export type AdviceRowProps = {
  variant: AdviceVariant
  title?: string | null
  body: string | null
  badge?: string | null
  isLoading: boolean
}

const SkeletonBody = () => (
  <div className="flex flex-col gap-1.5">
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
  </div>
)

export const AdviceRow = ({
  variant,
  title,
  body,
  badge,
  isLoading,
}: AdviceRowProps) => {
  const { label, icon: Icon, iconBg, iconText } = VARIANT_STYLES[variant]
  const heading = title ? `${label} · ${title}` : label

  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          iconBg,
        )}
      >
        <Icon className={cn('size-4', iconText)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-content-foreground text-sm leading-snug font-semibold">
          {heading}
        </p>
        {isLoading ? (
          <SkeletonBody />
        ) : (
          <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
            {body && body.length > 0 ? body : 'No data detected'}
          </p>
        )}
      </div>

      {badge && !isLoading && (
        <span className="text-muted-foreground shrink-0 text-xs font-medium">
          {badge}
        </span>
      )}
    </div>
  )
}
