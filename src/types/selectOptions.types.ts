export interface SelectOptionGroup {
  groupLabel: string
  items: Array<SelectOptionItem>
}

export interface SelectOptionItem {
  color: string
  description: string
  icon: string
  label: string
  selectedOptionLabel: string
  value: string
}
