import { useMemo } from 'react'
import { cva } from 'class-variance-authority'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { BudgetSelectorItem } from './BudgetSelectorItem'
import { cn } from '@/lib/utils'

const selectItemVariants = cva(
  'pr-2 cursor-pointer mb-0.5 group-hover:[&>span:first-child]:block [&>span:first-child]:hidden [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1',
  {
    variants: {
      selected: {
        true: 'bg-primary/10',
        false: '',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
)

interface SelectOptionItem {
  color?: string
  description?: string
  disabled?: boolean
  selectedOptionLabel?: string
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
  triggerProps?: React.ComponentProps<typeof SelectTrigger>
}

export const BudgetSelector = ({
  value,
  onChange,
  disabled,
  items,
  triggerProps,
}: BudgetSelectorProps) => {
  const selectedItem = useMemo(
    () =>
      items
        .flatMap((group) => group.items)
        .find((item) => item.value === value),
    [items, value],
  )

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="rounded-full" {...triggerProps}>
        <SelectValue placeholder="Select a budget">
          <BudgetSelectorItem
            label={selectedItem?.label ?? ''}
            description={selectedItem?.selectedOptionLabel ?? ''}
            color={selectedItem?.color ?? ''}
            icon={selectedItem?.icon ?? ''}
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-94 overflow-y-auto">
        {items.map((group, index) => (
          <SelectGroup key={group.groupLabel}>
            <SelectLabel className="mb-2 p-2 pb-0">
              {group.groupLabel}
            </SelectLabel>
            {group.items.map((item) => (
              <SelectItem
                className={cn(
                  selectItemVariants({ selected: item.value === value }),
                )}
                disabled={item.disabled}
                key={item.value}
                value={item.value}
              >
                <BudgetSelectorItem
                  label={item.label}
                  description={item.description ?? ''}
                  color={item.color ?? ''}
                  icon={item.icon ?? ''}
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
