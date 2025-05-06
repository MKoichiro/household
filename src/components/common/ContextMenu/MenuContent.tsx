import { forwardRef, ReactNode } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { CoordinateRect, EventRect, Separator } from './styled'

interface MenuContentProps {
  id: string
  content: ReactNode
  hasChildren: boolean
  autoIcon: boolean
  dividerAfter: boolean
  onClick?: () => void
  onMouseEnter?: () => void
}

const MenuContent = forwardRef<HTMLLIElement | null, MenuContentProps>(
  (
    { id, content, hasChildren, autoIcon = false, dividerAfter, onClick: handleClick, onMouseEnter: handleToggle },
    ref?
  ) => {
    return (
      <>
        {/* CoordinateRect は矩形情報を ref 経由で提供する。子Nested の表示位置を決定するために必要。 */}
        <CoordinateRect id={`${id}-li`} className="context-menu menu-item coordinate-rect" ref={ref}>
          <EventRect
            id={`${id}-event-btn-rect`}
            className="context-menu event-btn-rect"
            onClick={handleClick}
            onMouseEnter={handleToggle}
          >
            {content}
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
)
MenuContent.displayName = 'MenuContent'

export default MenuContent
