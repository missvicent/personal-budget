import { Link } from '@tanstack/react-router'
import { Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Reason = 'no_budgets' | 'no_transactions'

const COPY: Record<Reason, { title: string; body: string }> = {
  no_budgets: {
    title: 'Nothing to analyze yet',
    body: 'Create a budget to see AI insights about your spending.',
  },
  no_transactions: {
    title: 'Nothing to analyze in this window',
    body: 'Add transactions or pick a longer time window to see AI insights.',
  },
}

export const EmptyInsightsState = ({ reason }: { reason: Reason }) => {
  const { title, body } = COPY[reason]

  return (
    <Card className="w-full shadow-none">
      <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <Brain className="text-muted-foreground size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-content-foreground text-lg font-semibold">
            {title}
          </h3>
          <p className="text-muted-foreground max-w-sm text-sm">{body}</p>
        </div>
        {reason === 'no_budgets' && (
          <Button asChild size="sm" className="mt-2">
            <Link to="/budget">Create a budget</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
