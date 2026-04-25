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
    <ToggleGroup type="single" value={value} onValueChange={onValueChange}>
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
