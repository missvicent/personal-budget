import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface TimeRangeSelectorProps {
  options: Array<{ label: string; value: string }>
  value: string
  onValueChange: (value: string) => void
}

export const TimeRangeSelector = ({
  options,
  value,
  onValueChange,
}: TimeRangeSelectorProps) => {
  return (
    <ToggleGroup
      type="single"
      shape="segmented"
      variant="outline"
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
