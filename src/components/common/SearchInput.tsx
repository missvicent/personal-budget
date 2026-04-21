import { SearchIcon } from 'lucide-react'
import { Field } from '../ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

export interface SearchInputProps {
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const SearchInput = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
}: SearchInputProps) => {
  return (
    <Field>
      <InputGroup className="rounded-full">
        <InputGroupInput
          id="input-group-url"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="rounded-full"
          autoComplete="off"
          aria-label="Search expenses"
          aria-describedby="search-expenses-description"
          aria-required="true"
          aria-invalid="false"
          aria-autocomplete="list"
          aria-controls="search-expenses-list"
          aria-expanded="false"
        />
        <InputGroupAddon align="inline-start" className="rounded-full">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
