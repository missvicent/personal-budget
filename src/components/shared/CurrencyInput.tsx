import { DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface CurrencyInputProps {
  id: string
  label: string
  min: number
  placeholder: string
  step: number
  type: string
  value: number
  onChange: (value: number) => void
}
export const CurrencyInput = ({
  id,
  label,
  min,
  placeholder,
  step,
  type,
  value,
  onChange,
}: CurrencyInputProps) => (
  <div className="w-full max-w-sm space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        className="bg-background pl-9"
        id={id}
        min={min}
        placeholder={placeholder}
        step={step}
        type={type}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  </div>
)
