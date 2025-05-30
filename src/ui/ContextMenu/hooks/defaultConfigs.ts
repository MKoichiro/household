import { defaultAnimeConfigs } from '@ui/ContextMenu/animationConfigs'
import type {
  ContextMenuConfig,
  ContextMenuProps,
  ContextMenusCommonConfig,
  Coordinate,
  DefaultSettings,
  MenuTree,
  MenuTreeWithId,
  Mode,
  PositionConfig,
  PositionStrategy,
} from '@ui/ContextMenu/types'

/**
 * @internal
 * useContextMenu の引数の position (PositionStrategy型) を useContextMenuPosition の引数(PositionConfig型)に変換
 * @param position - ユーザーから渡された位置戦略
 * @returns 位置計算用の共通設定 (PositionConfig)
 */
const normalizePosition = (position: PositionStrategy): PositionConfig => {
  const baseOffset: Coordinate = { x: 0, y: 0 }

  switch (position.type) {
    case 'custom':
      return {
        offset: baseOffset,
        customPos: position.custom ?? { top: 0, left: 0 },
        mode: {
          main: 'custom',
          sub: position.customRelativity && position.customRelativity === 'windowTopLeft' ? 'window' : 'document',
        },
      }
    case 'anchor':
      return {
        anchorRelativity: position.anchorRelativity ?? 'none',
        offset: position.offset ?? baseOffset,
        mode: { main: 'anchor' },
      }
    case 'clicked':
      return {
        cursorRelativity: position.cursorRelativity ?? 'topLeft',
        offset: position.offset ?? baseOffset,
        mode: { main: 'clicked', sub: position.clicked },
      }
    default:
      // 理論上到達し得ない。開発時に型を変えたりしたときとかのために。
      throw new Error('Invalid position type')
  }
}

function cloneAndAssignId(items: MenuTree[]): MenuTreeWithId[] {
  return items.map((item) => {
    const copy: MenuTreeWithId = {
      ...item,
      id: item.id ?? crypto.randomUUID(),
      children: item.children ? cloneAndAssignId(item.children) : undefined,
    }
    return copy
  })
}

function collect(items: MenuTree[]) {
  const allIds: string[] = []
  items.forEach((i) => {
    allIds.push(i.id!)
    if (i.children) collect(i.children)
  })
  return allIds
}

const defaults: Partial<ContextMenuProps> & Partial<ContextMenuConfig> = {
  animeConfigs: defaultAnimeConfigs,
  autoIcon: false,
  toLeft: true,
  zIndex: 1000,
  open: false,
  position: { type: 'clicked', clicked: 'window' },
  subMenuPosition: {
    strategy: 'parentTop',
  },
}

/**
 * orDefault
 * @description
 *   raw → common → defaults の順に ContextMenuConfig の各プロパティを解決するユーティリティ。
 *
 * @param common ContextMenuCommonConfig | undefined - 共通設定値
 * @returns
 */
export const orDefault = (common?: ContextMenusCommonConfig): DefaultSettings => ({
  menuTree: (raw?: ContextMenuConfig['menuTree']) => {
    const src = raw ?? common?.menuTree
    if (!src) throw new Error('menuTree is required')

    // 存在性の保証
    const cloned = cloneAndAssignId(src)

    // 一意性の保証
    // すべてのメニューの ID をフラットに配列にしてから、重複を検出
    const allIds = collect(cloned)
    const dup = allIds.filter((id, i) => allIds.indexOf(id) !== i)
    if (dup.length) {
      throw new Error(`Duplicate ContextMenu IDs found: ${[...new Set(dup)].join(', ')}`)
    }

    return cloned
  },
  animeConfigs: (raw?: ContextMenuConfig['animeConfigs']) => raw || common?.animeConfigs || defaults.animeConfigs!,
  autoIcon: (raw?: ContextMenuConfig['autoIcon']) => raw ?? common?.autoIcon ?? defaults.autoIcon!,
  toLeft: (raw?: ContextMenuConfig['direction']) => {
    if (raw === 'left') return true
    if (raw === 'right') return false
    if (common?.direction === 'left') return true
    if (common?.direction === 'right') return false
    return defaults.toLeft!
  },
  // shouldFix: (mode: Mode) => mode.main === 'clicked' && mode.sub === 'window',
  shouldFix: (mode: Mode) =>
    (mode.main === 'clicked' && mode.sub === 'window') || (mode.main === 'custom' && mode.sub === 'window'),
  zIndex: (raw?: ContextMenuConfig['zIndex']) => raw || common?.zIndex || defaults.zIndex!,
  open: (raw?: ContextMenuConfig['open']) => raw ?? common?.open ?? defaults.open!,
  position: (raw?: ContextMenuConfig['position']) => normalizePosition(raw || common?.position || defaults.position!),
  subMenuPosition: (raw?: ContextMenuConfig['subMenuPosition']) =>
    raw || common?.subMenuPosition || defaults.subMenuPosition!,
  closeOnClickAway: () => common?.closeOnClickAway ?? defaults.closeOnClickAway!,
})
