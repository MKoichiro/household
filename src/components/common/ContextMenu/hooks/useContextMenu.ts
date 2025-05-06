import { useState, useRef, RefObject, MouseEventHandler } from 'react'
import { AnchorRelativity, ClickMode, Coordinate, CursorRelativity, MenuTree, Mode, PosStyle } from '../types'
import { AnimeConfigs, defaultAnimeConfigs } from '../animationConfigs'
import { useContextMenuPosition } from './useContextMenuPosition'
import useClickAway from '../../../../shared/hooks/useClickAway'
import { ContextMenuOriginProps } from '../ContextMenuOrigin'

const defaultProps = {
  animeConfigs: (rawAnimeConfigs?: AnimeConfigs) => rawAnimeConfigs ?? defaultAnimeConfigs,
  autoIcon: (rawAutoIcon?: boolean) => rawAutoIcon ?? false,
  toLeft: (rawDirection?: 'left' | 'right') => (rawDirection ? rawDirection === 'left' : true),
  shouldFix: (mode: Mode) => mode.main === 'clicked' && mode.sub === 'window',
}

// 判別可能なユニオン型（Discriminated Union Types）で定義
interface Anchor {
  type: 'anchor'
  /* アンカー要素からの相対位置を決める指定。 */
  anchorRelativity?: AnchorRelativity
  /* 計算結果からさらにずらす量。 */
  offset?: Coordinate
}
interface Clicked {
  type: 'clicked'
  /* 展開操作のクリックイベントが発生した位置にルートメニューを表示する指定。
    'window' か 'document' か基準を選択して表示できる。 */
  clicked: ClickMode
  /* 展開時に、カーソル位置をメニューのどの部分とするか */
  cursorRelativity?: CursorRelativity
  /* 計算結果からさらにずらす量。 */
  offset?: Coordinate
}
interface Custom {
  type: 'custom'
  /* anchorRef も clicked も指定しない場合、自前の CSS で document の左上基準から決定する */
  custom: PosStyle
}
type PositionStrategy = Anchor | Clicked | Custom

type PositionConfig = {
  anchorRef?: RefObject<HTMLElement | null>
  anchorRelativity?: AnchorRelativity
  cursorRelativity?: CursorRelativity
  offset: Coordinate
  customPos?: PosStyle
  mode: Mode
}

const normalizePosition = (position: PositionStrategy): PositionConfig => {
  const baseOffset: Coordinate = { x: 0, y: 0 }

  switch (position.type) {
    case 'custom':
      return {
        offset: baseOffset,
        customPos: position.custom,
        mode: { main: 'custom' },
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
      // ここは理論上到達しない
      throw new Error('Invalid position type')
  }
}

export interface ContextMenuArgs {
  id: string
  animeConfigs?: AnimeConfigs
  menuTree: MenuTree[]
  /* children を持つ MenuTreeの場合に、展開示唆のための ">" アイコンを自動付与するかどうかの一括指定。menuTreeの中でも個別に指定が可能。 */
  autoIcon?: boolean
  /* サブメニューの展開方向。デフォルトは 'left' */
  direction?: 'left' | 'right'
  /* ルートメニューの位置を決めるための指定。 */
  position: PositionStrategy
}

const useContextMenu = <T extends HTMLElement = HTMLElement>(args: ContextMenuArgs) => {
  const { id, animeConfigs, menuTree, autoIcon, direction, position } = args
  const { anchorRelativity, mode, offset, customPos, cursorRelativity } = normalizePosition(position)
  const [open, setOpen] = useState(false)
  const closeBtnRef = useRef<HTMLElement>(null)
  /* ルートメニューの初期位置の基準となる「アンカー要素」への参照。 */
  const anchorRef = useRef<T>(null)
  const rootRef = useRef<HTMLDivElement>(null) // root配下の要素のイベント
  const { posStyle, setPosition } = useContextMenuPosition<T>({
    mode,
    customPos,
    cursorRelativity,
    anchorRelativity,
    offset,
    anchorRef,
  })
  const handleClose = () => setOpen(false)
  const handleToggle: MouseEventHandler<unknown> = (e) => {
    setOpen((prev) => !prev)
    if (open) return
    setPosition(e)
    if (mode.main === 'clicked' && mode.sub !== 'anchor') {
      setPosition(e)
    }
  }

  // rootRef の配下の要素「以外」をクリックした場合にのみ、コールバックを実行
  // これにより、メニューの外側をクリックしたときにメニューを閉じることができる
  useClickAway([rootRef, closeBtnRef], handleClose)

  const register: ContextMenuOriginProps = {
    id,
    animeConfigs: defaultProps.animeConfigs(animeConfigs),
    menuTree,
    autoIcon: defaultProps.autoIcon(autoIcon),
    toLeft: defaultProps.toLeft(direction),
    rootRef,
    posStyle,
    shouldFix: defaultProps.shouldFix(mode),
    open,
  }
  return { register, anchorRef, closeBtnRef, handleToggle, handleClose }
}

export default useContextMenu
