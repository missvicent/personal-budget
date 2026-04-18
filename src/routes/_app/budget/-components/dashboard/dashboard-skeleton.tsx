import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const StatSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <Skeleton className="h-4 w-24" />
    </CardHeader>
    <CardContent>
      <Skeleton className="mb-6 h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </CardContent>
  </Card>
)

const SpotlightCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-3">
      <Skeleton className="h-7 w-7 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="mb-2 h-7 w-24" />
      <Skeleton className="h-3 w-28" />
    </CardContent>
  </Card>
)

const WidgetSkeleton = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader>
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-2 h-3 w-24" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[18rem] w-full" />
    </CardContent>
  </Card>
)

export const DashboardSkeleton = () => (
  <div className="min-h-screen p-8">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatSkeleton />
      <StatSkeleton />
      <StatSkeleton />
      <SpotlightCardSkeleton />
    </div>
    <div className="mt-4 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-2">
      <WidgetSkeleton />
      <WidgetSkeleton />
    </div>
    <div className="mt-4 md:mt-8">
      <WidgetSkeleton />
    </div>
  </div>
)
