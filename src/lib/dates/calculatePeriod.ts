import { daysInMonth } from './daysInMoth'

export const calculatePeriod = (
  startDate: Date,
  unit: 'monthly' | 'yearly',
) => {
  let y = startDate.getFullYear()
  let m = startDate.getMonth() + 1
  const d = startDate.getDate()

  if (unit === 'monthly') {
    m += 1
    if (m > 12) {
      ;((m = 1), (y += 1))
    }
  }

  if (unit === 'yearly') {
    y += 1
  }

  const clampedDay = Math.min(d, daysInMonth(y, m))
  return new Date(y, m - 1, clampedDay)
}
