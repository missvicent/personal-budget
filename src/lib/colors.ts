import type { CSSProperties } from 'react'

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
