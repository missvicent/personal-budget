import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SpentCard } from '../SpentCard'

const daily = [
  { date: '2026-05-01', amount: 100 },
  { date: '2026-05-02', amount: 200 },
]

describe('SpentCard', () => {
  it('renders the label and big-number value', () => {
    render(
      <SpentCard actual={300} budget={1000} deltaPct={-70} daily={daily} />,
    )
    expect(screen.getByText('SPENT THIS PERIOD')).toBeInTheDocument()
    expect(screen.getByText('$300.00')).toBeInTheDocument()
  })

  it('paints the value destructive when over budget', () => {
    render(
      <SpentCard actual={1500} budget={1000} deltaPct={50} daily={daily} />,
    )
    const value = screen.getByText('$1,500.00')
    expect(value.className).toContain('text-destructive')
  })

  it('hides the delta line when budget is 0', () => {
    render(<SpentCard actual={300} budget={0} deltaPct={0} daily={daily} />)
    expect(screen.queryByText(/vs/)).not.toBeInTheDocument()
  })

  it('renders the budget reference when budget > 0', () => {
    render(
      <SpentCard actual={1500} budget={1000} deltaPct={50} daily={daily} />,
    )
    expect(screen.getByText(/vs \$1,000\.00 budget/)).toBeInTheDocument()
  })
})
