import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { OnboardingStepper } from './onboarding-stepper'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type BudgetOnboardingEmptyStateProps = {
  budgetId: string
}

export const BudgetOnboardingEmptyState = ({
  budgetId,
}: BudgetOnboardingEmptyStateProps) => (
  <div className="flex min-h-[60vh] items-center justify-center p-4 md:p-8">
    <Card className="w-full max-w-2xl">
      <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center md:px-10 md:py-12">
        <div className="flex flex-col items-center gap-2">
          <span aria-hidden="true" className="text-4xl">
            🎉
          </span>
          <h2 className="text-2xl font-semibold">Your budget is ready!</h2>
          <p className="text-muted-foreground max-w-md text-sm">
            Here&rsquo;s how the app works in three quick steps. Allocations let
            you decide how much to spend in each category; expenses count toward
            them.
          </p>
        </div>

        <OnboardingStepper currentStep={2} />

        <Button asChild size="lg">
          <Link to="/budget/$budgetId/allocations" params={{ budgetId }}>
            Add your first allocation
            <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </div>
)
