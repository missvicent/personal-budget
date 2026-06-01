import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = {
  number: 1 | 2 | 3
  label: string
}

const STEPS: ReadonlyArray<Step> = [
  { number: 1, label: 'Create a budget' },
  { number: 2, label: 'Add allocations' },
  { number: 3, label: 'Track expenses' },
]

type Status = 'complete' | 'current' | 'upcoming'

const statusFor = (step: number, current: number): Status => {
  if (step < current) return 'complete'
  if (step === current) return 'current'
  return 'upcoming'
}

type OnboardingStepperProps = {
  currentStep: 1 | 2 | 3
}

export const OnboardingStepper = ({ currentStep }: OnboardingStepperProps) => (
  <ol
    aria-label="Onboarding steps"
    className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
  >
    {STEPS.map((step) => {
      const status = statusFor(step.number, currentStep)
      return (
        <li
          key={step.number}
          data-status={status}
          className="flex items-center gap-3 sm:flex-col sm:gap-2 sm:text-center"
        >
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium',
              status === 'complete' &&
                'border-primary bg-primary text-primary-foreground',
              status === 'current' &&
                'border-primary text-primary bg-primary/10',
              status === 'upcoming' && 'border-muted text-muted-foreground',
            )}
          >
            {status === 'complete' ? (
              <CheckIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              step.number
            )}
          </span>
          <span
            className={cn(
              'text-sm',
              status === 'upcoming'
                ? 'text-muted-foreground'
                : 'text-foreground',
            )}
          >
            {step.label}
          </span>
        </li>
      )
    })}
  </ol>
)
