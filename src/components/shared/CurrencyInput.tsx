import { DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface CurrencyInputProps {
  label: string
  id: string
  min: number
  placeholder: string
  step: number
  type: string
  onChange: (value: number) => void
}
export const CurrencyInput = ({
  label,
  id,
  min,
  placeholder,
  step,
  type,
  onChange,
}: CurrencyInputProps) => (
  <div className="w-full max-w-sm space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-background pl-9"
        id={id}
        min={min}
        placeholder={placeholder}
        step={step}
        type={type}
      />
    </div>
  </div>
)
