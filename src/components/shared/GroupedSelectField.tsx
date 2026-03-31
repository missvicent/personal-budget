import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemWithDescription,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SelectOptionItem {
  label: string
  value: string
  disabled?: boolean
  description?: string
}

export interface SelectOptionGroup {
  label: string
  items: Array<SelectOptionItem>
}

export interface GroupedSelectFieldProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SelectTrigger>,
  'value' | 'onChange'
> {
  placeholder?: string
  groups: Array<SelectOptionGroup>
  value: string
  onChange: (value: SelectOptionItem) => void
}

export const GroupedSelectField = ({
  groups,
  value,
  onChange,
  placeholder,
  ...triggerProps
}: GroupedSelectFieldProps) => {
  const allItems = groups.flatMap((group) => group.items)

  const handleChange = (v: string) => {
    const selected = allItems.find((item) => item.value === v)
    if (selected) onChange(selected)
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger {...triggerProps}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-94 overflow-y-auto">
        {groups.map((group, groupIndex) => (
          <React.Fragment key={group.label}>
            {groupIndex > 0 && <SelectSeparator />}
            <SelectGroup>
              <SelectLabel>{group.label}</SelectLabel>
              {group.items.map((item) =>
                item.description ? (
                  <SelectItemWithDescription
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    description={item.description}
                  >
                    {item.label}
                  </SelectItemWithDescription>
                ) : (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </SelectItem>
                ),
              )}
            </SelectGroup>
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}
