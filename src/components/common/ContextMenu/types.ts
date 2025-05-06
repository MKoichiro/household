import { CSSProperties, ReactNode } from 'react'

// 単一のメニュー項目を表す型
export interface MenuTree {
  id: string
  /* メニューに表示するモノ */
  display: ReactNode
  /* children を持つ MenuTreeの場合に、展開示唆のための ">" アイコンを自動付与するかどうかの個別指定。ContextMenuOriginから一括指定も可能 */
  autoIcon?: boolean
  /* 子メニュー（あれば） */
  children?: MenuTree[]
  /* ネストされた children オブジェクトで true とする場合は先祖すべても open を指定すること。 */
  open?: boolean
  /* divider を直後に表示する指定 */
  dividerAfter?: boolean
}

export type AnchorRelativity =
  | 'none'
  | 'innerCenter'
  | 'innerTopCenter'
  | 'innerRightCenter'
  | 'innerBottomCenter'
  | 'innerLeftCenter'
  | 'innerTopLeftCorner'
  | 'innerTopRightCorner'
  | 'innerBottomLeftCorner'
  | 'innerBottomRightCorner'
  | 'outerTopLeft'
  | 'outerTopCenter'
  | 'outerTopRight'
  | 'outerRightTop'
  | 'outerRightCenter'
  | 'outerRightBottom'
  | 'outerBottomLeft'
  | 'outerBottomCenter'
  | 'outerBottomRight'
  | 'outerLeftTop'
  | 'outerLeftCenter'
  | 'outerLeftBottom'
  | 'outerTopLeftCorner'
  | 'outerTopRightCorner'
  | 'outerBottomLeftCorner'
  | 'outerBottomRightCorner'
  | 'boundaryTop'
  | 'boundaryRight'
  | 'boundaryBottom'
  | 'boundaryLeft'

export type CursorRelativity =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'rightCenter'
  | 'bottomRight'
  | 'bottomCenter'
  | 'bottomLeft'
  | 'leftCenter'
  | 'center'

export type PosStyle = Partial<Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom' | 'transform'>>

export interface Coordinate {
  x: number
  y: number
}

export type ClickMode = 'window' | 'document' | 'anchor'

export type Mode = { main: 'custom' } | { main: 'clicked'; sub: ClickMode } | { main: 'anchor' }
