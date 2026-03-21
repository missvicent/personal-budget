import { addMonths, addYears } from 'date-fns'

export const calculatePeriod = (
  startDate: Date,
  period: 'monthly' | 'yearly',
) => {
  return period === 'monthly' ? addMonths(startDate, 1) : addYears(startDate, 1)
}
