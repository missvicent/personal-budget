import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OnboardingStepper } from '../onboarding-stepper'

describe('OnboardingStepper', () => {
  it('renders the three step labels', () => {
    render(<OnboardingStepper currentStep={2} />)
    expect(screen.getByText('Create a budget')).toBeInTheDocument()
    expect(screen.getByText('Add allocations')).toBeInTheDocument()
    expect(screen.getByText('Track expenses')).toBeInTheDocument()
  })

  it('marks previous steps as completed and the current step as current', () => {
    render(<OnboardingStepper currentStep={2} />)
    const list = screen.getByRole('list', { name: /onboarding steps/i })
    const items = list.querySelectorAll('li')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveAttribute('data-status', 'complete')
    expect(items[1]).toHaveAttribute('data-status', 'current')
    expect(items[2]).toHaveAttribute('data-status', 'upcoming')
  })

  it('marks all earlier steps complete when currentStep is 3', () => {
    render(<OnboardingStepper currentStep={3} />)
    const list = screen.getByRole('list', { name: /onboarding steps/i })
    const items = list.querySelectorAll('li')
    expect(items[0]).toHaveAttribute('data-status', 'complete')
    expect(items[1]).toHaveAttribute('data-status', 'complete')
    expect(items[2]).toHaveAttribute('data-status', 'current')
  })
})
