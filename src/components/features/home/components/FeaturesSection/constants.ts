import type { Feature } from '../../types'

export const FEATURES: Array<Feature> = [
  {
    id: 'expense-tracking',
    title: 'Expense Tracking',
    description:
      'Manually log your expenses with ease. Categorize, tag, and keep track of every transaction in seconds.',
    status: 'available',
    icon: 'receipt',
  },
  {
    id: 'budget-management',
    title: 'Budget Management',
    description:
      'Set monthly budgets by category. Get visual indicators when you’re approaching your limits.',
    status: 'available',
    icon: 'wallet',
  },
  {
    id: 'visual-analytics',
    title: 'Visual Analytics',
    description:
      'Beautiful charts and graphs that make understanding your spending patterns effortless.',
    status: 'available',
    icon: 'chart',
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    description:
      'Smart pattern analysis and spending projections powered by AI to help you plan ahead.',
    status: 'coming-soon',
    icon: 'sparkles',
  },
]
