import type { PortalEntry } from '@shared/hooks/useContexts'

export const DEFAULT_ENTRIES: PortalEntry[] = [
  // タブレット以下でのTransactionのメニュー
  { name: 'half-modal', dataPortal: 'half-modal' },
  // タブレット以下でのTransactionのメニュー
  { name: 'modal', dataPortal: 'portal-root' },
  { name: 'notification', dataPortal: 'notification-pad' },
  { name: 'context-menu', dataPortal: 'context-menu' },

  // 追加する場合はこの下に...
  // { name: '???', dataPortal: '???' },
]
