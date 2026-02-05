import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SelectFieldProps {
  placeholder?: string
  items: Array<{ label: string; value: string }>
  value: string
  onChange: (value: { label: string; value: string }) => void
}

export const SelectField = ({
  items,
  value,
  onChange,
  placeholder,
}: SelectFieldProps) => {
  const handleChange = (v: string) => {
    const selected = items.find((item) => item.value === v)
    if (selected) onChange(selected)
  }

  return (
    <Select value={value || undefined} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-94 overflow-y-auto">
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
