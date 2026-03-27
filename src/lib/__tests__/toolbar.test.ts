import { describe, expect, it } from 'vitest'
import { staticToolbarMeta } from '../toolbar'

describe('staticToolbarMeta', () => {
  it('returns a function that produces { toolbarMeta } with the given meta', () => {
    const meta = {
      title: 'Test Page',
      description: 'A test description',
      balance: { label: 'Balance', value: '$0.00' },
    }

    const beforeLoad = staticToolbarMeta(meta)
    const result = beforeLoad()

    expect(result).toEqual({ toolbarMeta: meta })
  })

  it('works without optional fields', () => {
    const meta = { title: 'Minimal Page' }

    const beforeLoad = staticToolbarMeta(meta)
    const result = beforeLoad()

    expect(result).toEqual({ toolbarMeta: { title: 'Minimal Page' } })
  })
})
