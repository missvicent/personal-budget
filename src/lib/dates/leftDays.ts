import { differenceInCalendarDays } from 'date-fns'

export const leftDays = (endDate: Date) => {
  return Math.max(0, differenceInCalendarDays(endDate, new Date()))
}
