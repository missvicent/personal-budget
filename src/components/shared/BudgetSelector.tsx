import { SelectLabel } from '@radix-ui/react-select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { BudgetSelectorItem } from './BudgetSelectorItem'

interface SelectOptionItem {
  color?: string
  description?: string
  disabled?: boolean
  icon?: string
  label: string
  value: string
}

interface SelectOptionGroup {
  groupLabel: string
  items: Array<SelectOptionItem>
}

interface BudgetSelectorProps {
  disabled?: boolean
  items: Array<SelectOptionGroup>
  onChange: (value: string) => void
  value: string
}

export const BudgetSelector = ({
  value,
  onChange,
  disabled,
  items,
  ...triggerProps
}: BudgetSelectorProps) => {
  const handleChange = (v: string) => {
    onChange(v)
  }

  const selectedItem = items
    .flatMap((group) => group.items)
    .find((item) => item.value === value)

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger {...triggerProps}>
        <SelectValue placeholder="Select a budget">
          <BudgetSelectorItem
            label={selectedItem?.label || ''}
            description=""
            color={selectedItem?.color || ''}
            icon={selectedItem?.icon || ''}
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-94 overflow-y-auto">
        {items.map((group, index) => (
          <SelectGroup key={group.groupLabel}>
            <SelectLabel className="p-2 pb-0">{group.groupLabel}</SelectLabel>
            {group.items.map((item) => (
              <SelectItem
                className="pr-2 [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1"
                disabled={item.disabled}
                key={item.value}
                value={item.value}
              >
                <BudgetSelectorItem
                  label={item.label}
                  description={item.description || ''}
                  color={item.color || ''}
                  icon={item.icon || ''}
                />
              </SelectItem>
            ))}

            {index < items.length - 1 && <SelectSeparator />}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
