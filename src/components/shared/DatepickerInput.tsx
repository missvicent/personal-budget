'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export interface DatePickerInputProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'id' | 'value' | 'onChange' | 'onBlur'
> {
  id: string
  placeholder: string
  value: Date | undefined
  onBlur?: () => void
  onChange: (date: Date) => void
}

export const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  DatePickerInputProps
>(function DatePickerInput(
  { id, placeholder, value, onBlur, onChange, ...groupProps },
  ref,
) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [dateValue, setDateValue] = React.useState(formatDate(value))

  React.useEffect(() => {
    setDate(value)
    setDateValue(formatDate(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setDateValue(v)
    const dv = new Date(v)
    if (isValidDate(dv)) {
      setDate(dv)
      onChange(dv)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const handleSelect = (v: Date | undefined) => {
    if (!v) return
    setDate(v)
    setDateValue(formatDate(v))
    onChange(v)
    setOpen(false)
  }

  return (
    <InputGroup {...groupProps}>
      <InputGroupInput
        ref={ref}
        id={id}
        value={dateValue}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-label="Select date"
        aria-describedby="select-date-description"
        aria-required="true"
        aria-invalid="false"
        aria-autocomplete="list"
        aria-controls="select-date-list"
        aria-expanded="false"
        aria-haspopup="true"
        aria-activedescendant="select-date-item-0"
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              id="date-picker"
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
            >
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              style={{ '--cell-size': '3rem' } as React.CSSProperties}
              mode="single"
              selected={date}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
})
