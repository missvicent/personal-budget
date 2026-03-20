import type { CSSProperties } from 'react'

// Badge color types
export type LifecycleStatus = 'active' | 'ended'
export type PeriodType = 'monthly' | 'yearly'
export type SpendingStatus = 'under-budget' | 'near-limit' | 'over-budget'

export type BadgeColor = { text: string; bg: string; border: string }

export const lifecycleColors: Record<LifecycleStatus, BadgeColor> = {
  active: {
    text: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400',
  },
  ended: {
    text: 'text-amber-500',
    bg: 'bg-amber-500/8',
    border: 'border-amber-600',
  },
}

export const periodColors: Record<PeriodType, BadgeColor> = {
  monthly: {
    text: 'text-[#7c6af0]',
    bg: 'bg-[#7c6af0]/12',
    border: 'border-[#a89ff5]',
  },
  yearly: {
    text: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400',
  },
}

export const spendingColors: Record<SpendingStatus, BadgeColor> = {
  'under-budget': {
    text: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500',
  },
  'near-limit': {
    text: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500',
  },
  'over-budget': {
    text: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500',
  },
}

export function getSpendingStatus(
  spent: number,
  budget: number,
): SpendingStatus {
  const ratio = budget > 0 ? spent / budget : 0
  if (ratio > 1) return 'over-budget'
  if (ratio >= 0.8) return 'near-limit'
  return 'under-budget'
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '')
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

export function getCategoryStyles(hex: string): {
  text: CSSProperties
  bg: CSSProperties
  progress: CSSProperties
} {
  const { r, g, b } = hexToRgb(hex)

  return {
    text: { color: hex },
    bg: { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)` },
    progress: { backgroundColor: hex },
  }
}
