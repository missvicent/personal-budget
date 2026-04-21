import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface PeriodRangeSelectorProps {
  options: Array<{ label: string; value: string }>
  value: string
  onValueChange: (value: string) => void
}

export const PeriodRangeSelector = ({
  options,
  value,
  onValueChange,
}: PeriodRangeSelectorProps) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={onValueChange}
      className="w-full"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="flex-1"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
