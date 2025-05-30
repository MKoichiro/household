// コンテキストメニュー（windows 右クリックのような UI）のルートメニューのコンポーネント
// NOTE: 外部の依存関係
// - framer-motion: アニメーションライブラリ(必須)
// - @mui/icons-material: アイコン部分のみ。
// - styled 関数

import { AnimatePresence } from 'framer-motion'

import { usePortal } from '@shared/hooks/useContexts'

import MotionContext from './MotionContext'
import Nested from './Nested'
import { ContextMenuRoot } from './styled'
import type { ContextMenuProps } from './types'

const ContextMenu = ({
  className,
  id,
  animeConfigs,
  open,
  menuTree,
  autoIcon: autoIconBulk,
  rootRef,
  toLeft,
  positionStyle,
  subMenuPosition,
  shouldFix,
  zIndex,
  style,
}: ContextMenuProps) => {
  const portalRenderer = usePortal('context-menu')

  return (
    <>
      {portalRenderer(
        <AnimatePresence>
          {open && (
            <ContextMenuRoot
              className={`context-menu-root ${className ?? ''}`}
              ref={rootRef}
              $pos={positionStyle}
              $fixed={shouldFix}
              $zIndex={zIndex}
              style={{ ...style }}
            >
              <MotionContext id={id} animeConfig={animeConfigs.root} toLeft={toLeft}>
                <Nested
                  menuTree={menuTree}
                  animeConfig={animeConfigs.sub}
                  toLeft={toLeft}
                  autoIconBulk={autoIconBulk}
                  subMenuPosition={subMenuPosition}
                />
              </MotionContext>
            </ContextMenuRoot>
          )}
        </AnimatePresence>
      )}
    </>
  )
}

export default ContextMenu
