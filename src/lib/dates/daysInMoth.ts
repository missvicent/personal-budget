import { isLeapYear } from './isLeapYear'

const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export const daysInMonth = (year: number, month: number): number => {
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}`)
  }
  if (month === 2 && isLeapYear(year)) return 29
  return DAYS_IN_MONTH[month]
}
