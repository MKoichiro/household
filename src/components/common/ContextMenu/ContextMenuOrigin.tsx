// コンテキストメニュー（windows 右クリックのような UI）のルートメニューのコンポーネント
// NOTE: 依存関係
// - framer-motion: アニメーションライブラリ(必須)
// - @mui/icons-material: アイコン部分のみなのでちょっと弄れば依存しない
// - @emotion/styled: styled-components の styled と等価
// - 自作の portalProvider

// TODO: 1. button要素がdisplayで渡されたときに、nested buttonのエラーが出ている問題を解決する。
// TODO: 2. スタイルを使用者が決められるようにする。classNameを付与しているので十分（？）

import { CSSProperties, RefObject } from 'react'
import { usePortal } from '../../../shared/hooks/useContexts'
import { AnimatePresence } from 'framer-motion'
import MotionContext from './MotionContext'
import Nested from './Nested'
import { AnimeConfigs } from './animationConfigs'
import { ContextMenuRoot } from './styled'
import { MenuTree, PosStyle } from './types'

export interface ContextMenuOriginProps {
  id: string
  animeConfigs: AnimeConfigs
  open: boolean
  menuTree: MenuTree[]
  /* children を持つ MenuTreeの場合に、展開示唆のための ">" アイコンを自動付与するかどうかの一括指定。menuTreeの中でも個別に指定が可能。 */
  autoIcon: boolean
  rootRef: RefObject<HTMLDivElement | null>
  /* サブメニューの展開方向。 */
  toLeft: boolean
  /* ポジション制御のための CSSProperties。 */
  posStyle: PosStyle
  /* position: fixed か position: absolute か。clicked かつ 'window' の場合に true */
  shouldFix: boolean
  /* ルート要素のスタイル。必要があれば。基本は className ベースでの適用を推奨。 */
  style?: CSSProperties
}

const ContextMenuOrigin = ({
  id,
  animeConfigs,
  open,
  menuTree,
  autoIcon: autoIconBulk,
  rootRef,
  toLeft,
  posStyle,
  shouldFix,
  style,
}: ContextMenuOriginProps) => {
  const portalRenderer = usePortal('context-menu')

  return (
    <>
      {portalRenderer(
        <AnimatePresence>
          {open && (
            <ContextMenuRoot
              className="context-menu-root"
              ref={rootRef}
              $pos={posStyle}
              $fixed={shouldFix}
              style={{ ...style }}
            >
              <MotionContext id={id} animeConfigs={animeConfigs} toLeft={toLeft}>
                <Nested menuTree={menuTree} animeConfigs={animeConfigs} toLeft={toLeft} autoIconBulk={autoIconBulk} />
              </MotionContext>
            </ContextMenuRoot>
          )}
        </AnimatePresence>
      )}
    </>
  )
}

export default ContextMenuOrigin
