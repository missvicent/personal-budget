import { describe, expect, it } from 'vitest'
import { deleteAccountSchema } from '../delete-account.schema'

describe('deleteAccountSchema', () => {
  const expectedEmail = 'test@example.com'
  const schema = deleteAccountSchema(expectedEmail)

  it('accepts exact email match', () => {
    const result = schema.safeParse({ confirmEmail: expectedEmail })
    expect(result.success).toBe(true)
  })

  it('rejects different email', () => {
    const result = schema.safeParse({
      confirmEmail: 'different@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing email', () => {
    const result = schema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects empty email', () => {
    const result = schema.safeParse({ confirmEmail: '' })
    expect(result.success).toBe(false)
  })

  it('rejects email with sensitive case', () => {
    const result = schema.safeParse({ confirmEmail: 'test@EXAMPLE.com' })
    expect(result.success).toBe(true)
  })

  it('trims whitespace from email', () => {
    const result = schema.safeParse({ confirmEmail: ' test@example.com ' })
    expect(result.success).toBe(true)
  })
})
