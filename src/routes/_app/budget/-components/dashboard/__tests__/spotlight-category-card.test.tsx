import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SpotlightCategoryCard } from '../spotlight-category-card'
import type { SpotlightCategory } from '@/routes/_app/budget/-hooks/dashboard/types'

const outlier: SpotlightCategory = {
  mode: 'outlier',
  id: 'a1',
  name: 'Dining',
  icon: '🍔',
  color: '#dc2626',
  amountSpent: 320,
  amountBudget: 200,
  overshoot: 120,
}

const topSpender: SpotlightCategory = {
  mode: 'top-spender',
  id: 'a2',
  name: 'Groceries',
  icon: '🛒',
  color: '#064E3B',
  amountSpent: 180,
  amountBudget: 500,
  overshoot: -320,
}

describe('SpotlightCategoryCard', () => {
  it('renders an empty placeholder when spotlight is null', () => {
    render(<SpotlightCategoryCard spotlight={null} />)

    expect(screen.getByText(/spotlight/i)).toBeInTheDocument()
    expect(screen.getByText(/no categories yet/i)).toBeInTheDocument()
  })

  it('renders the outlier mode with "Over in {name}" header and overshoot amount', () => {
    render(<SpotlightCategoryCard spotlight={outlier} />)

    expect(screen.getByText(/over in/i)).toBeInTheDocument()
    expect(screen.getByText('Dining')).toBeInTheDocument()
    expect(screen.getByText('+$120.00')).toBeInTheDocument()
    expect(screen.getByText(/over \$200\.00/i)).toBeInTheDocument()
  })

  it('renders the top-spender mode with "Top" header and spent amount', () => {
    render(<SpotlightCategoryCard spotlight={topSpender} />)

    expect(screen.getByText(/^top$/i)).toBeInTheDocument()
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('$180.00')).toBeInTheDocument()
    expect(screen.getByText(/of \$500\.00/i)).toBeInTheDocument()
  })
})
