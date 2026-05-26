import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KpiCard } from '../KpiCard'

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="SPENT" value="$100" />)
    expect(screen.getByText('SPENT')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  it('renders sub-text and viz when provided', () => {
    render(
      <KpiCard
        label="SPENT"
        value="$100"
        subText={<span>+10%</span>}
        viz={<div data-testid="viz">chart</div>}
      />,
    )
    expect(screen.getByText('+10%')).toBeInTheDocument()
    expect(screen.getByTestId('viz')).toBeInTheDocument()
  })

  it('renders skeletons when isLoading is true and hides value', () => {
    render(<KpiCard label="SPENT" value="$100" isLoading />)
    expect(screen.queryByText('$100')).not.toBeInTheDocument()
    expect(screen.getByText('SPENT')).toBeInTheDocument()
  })
})
