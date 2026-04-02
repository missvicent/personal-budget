import * as React from 'react'
import { DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'

export interface CurrencyInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  value: number
  onChange: (value: number) => void
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(({ value, onChange, className, ...rest }, ref) => (
  <div className="relative">
    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
    <Input
      inputMode="decimal"
      ref={ref}
      className={`dark:bg-input/30 bg-white pl-9 ${className ?? ''}`}
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      {...rest}
    />
  </div>
))

CurrencyInput.displayName = 'CurrencyInput'
