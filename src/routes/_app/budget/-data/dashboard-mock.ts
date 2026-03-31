import type { SummaryGridProps } from '@/routes/_app/dashboard/-components/SummaryGrid'
import type { SpendingByCategoryProps } from '@/routes/_app/dashboard/-components/spending-by-category'
import type { RecentActivityItem } from '@/routes/_app/dashboard/-components/RecentActivity'

export const summaryData: SummaryGridProps['summaryData'] = [
  {
    title: 'Total Spent',
    percentage: 17.6,
    badgeType: 'positive',
    amountSpent: 581.26,
    symbol: '$',
    additionalDescription: 'Total expenses for the month',
  },
  {
    title: 'Remaining',
    percentage: 40,
    badgeType: 'positive',
    amountSpent: 3187.74,
    symbol: '$',
    additionalDescription: 'of your budget',
  },
  {
    title: 'Average Daily Spending',
    percentage: 10,
    badgeType: 'positive',
    amountSpent: 19.42,
    symbol: '$',
    additionalDescription: 'per day',
  },
  {
    title: 'Budget Used',
    percentage: 17.6,
    badgeType: 'positive',
    amountSpent: 60,
    symbol: '%',
    additionalDescription: 'On Track',
  },
]

export const budgetOverview: SpendingByCategoryProps = {
  currentMonth: 'January 2026',
  categories: [
    {
      id: '1',
      icon: '🛒',
      category: 'Food',
      amountSpent: 300,
      amountBudget: 200,
      color: '#064E3B',
    },
    {
      id: '2',
      icon: '🚗',
      category: 'Transport',
      amountSpent: 50,
      amountBudget: 100,
      color: '#064E3B',
    },
    {
      id: '3',
      icon: '🏠',
      category: 'Housing',
      amountSpent: 75,
      amountBudget: 150,
      color: '#064E3B',
    },
    {
      id: '4',
      icon: '⚡',
      category: 'Utilities',
      amountSpent: 25,
      amountBudget: 50,
      color: '#064E3B',
    },
    {
      id: '5',
      icon: '🎵',
      category: 'Entertainment',
      amountSpent: 10,
      amountBudget: 20,
      color: '#064E3B',
    },
    {
      id: '6',
      icon: '👕',
      category: 'Clothing',
      amountSpent: 10,
      amountBudget: 20,
      color: '#064E3B',
    },
    {
      id: '7',
      icon: '💼',
      category: 'Business',
      amountSpent: 10,
      amountBudget: 20,
      color: '#064E3B',
    },
  ],
}

export const recentActivity: Array<RecentActivityItem> = [
  {
    id: '1',
    amount: 100,
    category: 'Food',
    color: '#064E3B',
    date: '2026-01-01',
    icon: '🛒',
    title: 'Food',
  },
]
