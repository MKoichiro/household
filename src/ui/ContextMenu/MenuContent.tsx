import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Button } from '@mui/material'
import { isValidElement } from 'react'

import { hasDescendantOf } from '@shared/utils/hasDescendantOf'

import { CoordinateRect, EventRect, Separator } from './styled'
import type { MenuContentProps } from './types'

const MenuContent = ({
  id,
  content,
  includeButton = false,
  hasChildren,
  autoIcon = false,
  dividerAfter,
  onClick: handleClick,
  onMouseEnter: handleToggle,
  onKeyDown,
  ref,
}: MenuContentProps) => {
  // HTML の <button> を含むか検出
  const hasHtmlButton = hasDescendantOf('button', content)
  const isMuiButton = isValidElement(content) && content.type === Button
  const wrapperTag = includeButton || hasHtmlButton || isMuiButton ? 'div' : 'button'

  return (
    <>
      {/* CoordinateRect は矩形情報を ref 経由で提供する。子Nested の表示位置を決定するために必要。 */}
      <CoordinateRect id={`${id}-li`} className="context-menu menu-item coordinate-rect" ref={ref} role="menuitem">
        <EventRect
          as={wrapperTag} // nested button のエラーを回避するために、content に button があれば div にする
          role="button"
          id={`${id}-event-btn-rect`}
          className="context-menu event-btn-rect"
          onClick={handleClick}
          onMouseEnter={handleToggle}
          onKeyDown={onKeyDown}
          aria-label="サブメニューの開閉"
          tabIndex={0}
        >
          <span className="context-menu event-btn-rect-content">{content}</span>
          {hasChildren && autoIcon ? <ArrowForwardIosIcon /> : null}
        </EventRect>
      </CoordinateRect>

      {/* divider の指示子があれば描画 */}
      {dividerAfter ? (
        <Separator className="context-menu menu-separator" role="separator" aria-hidden="true">
          <hr />
        </Separator>
      ) : null}
    </>
  )
}

export default MenuContent
