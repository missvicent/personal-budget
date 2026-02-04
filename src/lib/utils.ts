import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export const toSelectOptions = <T>(
  defaultOption: { label: string; value: string },
  items: Array<T>,
  getLabel: (item: T) => string,
  getValue: (item: T) => string,
) => {
  return [
    defaultOption,
    ...items.map((item) => ({
      label: getLabel(item),
      value: getValue(item),
    })),
  ]
}
