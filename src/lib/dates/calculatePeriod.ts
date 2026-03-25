import { addMonths, addYears } from 'date-fns'

export const calculatePeriod = (
  startDate: Date,
  period: 'monthly' | 'yearly',
) => {
  // Operate on UTC calendar parts to avoid local timezone shifting the date
  const utcLocal = new Date(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate(),
  )
  const result =
    period === 'monthly' ? addMonths(utcLocal, 1) : addYears(utcLocal, 1)
  return new Date(
    Date.UTC(result.getFullYear(), result.getMonth(), result.getDate()),
  )
}
