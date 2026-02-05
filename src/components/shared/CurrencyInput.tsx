import { DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'

export interface CurrencyInputProps {
  id: string
  min: number
  placeholder: string
  step: number
  type: string
  value: number
  onChange: (value: number) => void
}
export const CurrencyInput = ({
  id,
  min,
  placeholder,
  step,
  type,
  value,
  onChange,
}: CurrencyInputProps) => (
  <div className="relative">
    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
    <Input
      className="bg-background pl-9"
      id={id}
      min={min}
      placeholder={placeholder}
      step={step}
      type={type}
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
)
