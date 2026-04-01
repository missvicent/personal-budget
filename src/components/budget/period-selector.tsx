import { PeriodOption } from './period-option'

interface PeriodSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export const PeriodSelector = ({
  value,
  onValueChange,
}: PeriodSelectorProps) => {
  return (
    <PeriodOption
      value={value}
      onValueChange={onValueChange}
      options={[
        { label: 'Monthly', value: 'monthly', subtitle: 'Already active' },
        { label: 'Yearly', value: 'yearly', subtitle: 'Already active' },
      ]}
    />
  )
}
