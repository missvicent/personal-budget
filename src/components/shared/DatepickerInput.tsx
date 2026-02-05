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

export interface DatePickerInputProps {
  id: string
  placeholder: string
  value: Date | undefined
  onChange: (date: Date) => void
}

export function DatePickerInput({
  id,
  placeholder,
  value,
  onChange,
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [dateValue, setDateValue] = React.useState(formatDate(date))

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
    <InputGroup>
      <InputGroupInput
        id={id}
        value={dateValue}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
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
}
