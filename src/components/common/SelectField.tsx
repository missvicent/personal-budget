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
  onChange: (value: { label: string; value: string }) => void
}

export const SelectField = ({ items, onChange }: SelectFieldProps) => {
  const handleChange = (value: string) => {
    const selected = items.find((item) => item.value === value)
    if (selected) onChange(selected)
  }

  return (
    <Select defaultValue={items[0]?.value} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue />
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
