import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group'
import { Calendar, Check } from 'lucide-react'

interface PeriodOptionProps {
  options: Array<{ label: string; value: string; subtitle?: string }>
  value: string
  onValueChange: (value: string) => void
}
export const PeriodOption = ({
  options,
  value,
  onValueChange,
}: PeriodOptionProps) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={onValueChange}
      className="flex w-full items-stretch gap-2"
    >
      {options.map((option) => (
        <ToggleGroupItem
          aria-label={option.label}
          className="group/toggle text-muted-foreground/50 hover:border-primary/30 data-[state=on]:border-primary/50 data-[state=on]:bg-primary/5 relative flex h-auto w-full cursor-pointer flex-col items-start gap-4 rounded-xl border border-white/10 p-4 transition-colors"
          key={option.value}
          value={option.value}
        >
          <div className="toggle-check bg-primary absolute top-3 right-3 flex size-5 items-center justify-center rounded-full opacity-0 transition-opacity">
            <Check className="text-primary-foreground size-3" />
          </div>
          <div className="bg-accent/20 group-hover/toggle:bg-primary/10 rounded-lg p-2">
            <Calendar className="group-hover/toggle:text-primary text-muted-foreground/50 size-4" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">{option.label} </span>
            {option.subtitle && (
              <span className="text-muted-foreground/50 text-xs">
                {option.subtitle}
              </span>
            )}
          </div>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
