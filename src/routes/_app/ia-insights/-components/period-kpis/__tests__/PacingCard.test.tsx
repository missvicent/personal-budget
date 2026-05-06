import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PacingCard } from '../PacingCard'

describe('PacingCard', () => {
  it('renders rounded utilization with % suffix', () => {
    render(
      <PacingCard utilizationPct={227.4} diff={5699} isOver budget={4500} />,
    )
    expect(screen.getByText('227%')).toBeInTheDocument()
  })

  it('shows over-budget sub-text when isOver', () => {
    render(<PacingCard utilizationPct={227} diff={5699} isOver budget={4500} />)
    expect(screen.getByText(/over budget/)).toBeInTheDocument()
  })

  it('shows under-budget sub-text when not isOver', () => {
    render(
      <PacingCard
        utilizationPct={50}
        diff={500}
        isOver={false}
        budget={1000}
      />,
    )
    expect(screen.getByText(/under budget/)).toBeInTheDocument()
  })

  it('shows em-dash and hint when budget is 0', () => {
    render(<PacingCard utilizationPct={0} diff={0} isOver={false} budget={0} />)
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText(/Set a budget amount/)).toBeInTheDocument()
  })
})
