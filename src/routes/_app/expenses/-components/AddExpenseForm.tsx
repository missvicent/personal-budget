import { useState } from 'react'
import type { Category } from '@/types/database.types'
import { SelectField } from '@/components/common/SelectField'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toSelectOptions } from '@/lib/utils'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { DatePickerInput } from '@/components/shared/DatepickerInput'

interface AddExpenseFormProps {
  categories: Array<Category>
  onSubmit: (data: any) => void
}

export const AddExpenseForm = ({
  categories,
  onSubmit,
}: AddExpenseFormProps) => {
  const categoryOptions =
    categories.length > 0
      ? toSelectOptions(
          { label: 'Select Category', value: 'all' },
          categories,
          (c) => `${c.icon} ${c.name}`,
          (c) => c.id,
        )
      : []

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData)
    onSubmit(data)
  }

  const handleDateChange = (date: Date) => {
    console.log(date)
  }

  const handleCategoryChange = (value: { label: string; value: string }) => {
    console.log(value)
  }

  const handleAmountChange = (value: number) => {
    console.log(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <CurrencyInput
              id="amount"
              label="Amount"
              min={0}
              onChange={handleAmountChange}
              placeholder="0.00"
              step={0.01}
              type="number"
            />
          </Field>
          <Field>
            <Label htmlFor="category">Category</Label>
            <SelectField
              items={categoryOptions}
              onChange={handleCategoryChange}
              placeholder="Select Category"
            />
          </Field>
          <Field>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="What did you spend on?"
            />
          </Field>
          <Field>
            <DatePickerInput
              id="date"
              label="Date"
              placeholder="Select Date"
              onChange={handleDateChange}
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="flex flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} className="w-full">
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  )
}
