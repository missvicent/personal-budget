import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SelectFieldProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SelectTrigger>,
    'value' | 'onChange'
  > {
  placeholder?: string
  items: Array<{ label: string; value: string; disabled?: boolean }>
  value: string
  onChange: (value: { label: string; value: string }) => void
}

export const SelectField = ({
  items,
  value,
  onChange,
  placeholder,
  disabled,
  ...triggerProps
}: SelectFieldProps) => {
  const handleChange = (v: string) => {
    const selected = items.find((item) => item.value === v)
    if (selected) onChange(selected)
  }

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger {...triggerProps}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-94 overflow-y-auto">
        <SelectGroup>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
