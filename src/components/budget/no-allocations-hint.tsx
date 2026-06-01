import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, InfoIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type NoAllocationsHintProps = {
  budgetId: string
}

export const NoAllocationsHint = ({ budgetId }: NoAllocationsHintProps) => (
  <Card>
    <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
      <InfoIcon
        className="text-muted-foreground h-5 w-5 shrink-0"
        aria-hidden="true"
      />
      <div className="flex-1">
        <p className="text-foreground text-sm font-medium">
          You need an allocation before you can log expenses.
        </p>
        <p className="text-muted-foreground text-sm">
          Allocations tell each expense which category to count toward.
        </p>
      </div>
      <Button asChild variant="default">
        <Link to="/budget/$budgetId/allocations" params={{ budgetId }}>
          Set up allocations
          <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </CardContent>
  </Card>
)
