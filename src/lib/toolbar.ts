import type { ToolbarMeta } from '@/routes/__root'

export const staticToolbarMeta = (meta: ToolbarMeta) => () => ({
  toolbarMeta: meta,
})
