import { format } from 'date-fns'

export const formatDate = (date: Date) => {
  return format(date, 'MMMM, d')
}

export const formatDateRange = (startDate: Date, endDate: Date) => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

export const formatYear = (date: Date) => {
  return format(date, 'yyyy')
}
