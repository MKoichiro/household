import { Children, forwardRef, isValidElement, ReactNode } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { CoordinateRect, EventRect, Separator } from './styled'

/**
 * ReactNode のツリー中に <button> もしくは MUI Button があれば true を返す
 */
// function containsButtonElement(node: ReactNode): boolean {
//   let found = false

//   Children.forEach(node, (child) => {
//     if (found) return

//     // ReactElement かどうか
//     if (!isValidElement(child)) return

//     const type = child.type as any

//     // ネイティブの <button>
//     if (type === 'button') {
//       found = true
//       return
//     }

//     // MUI の Button コンポーネント判定 (muiName を利用)
//     if (type && type.muiName === 'Button') {
//       found = true
//       return
//     }

//     // 再帰的に子要素をチェック
//     found = containsButtonElement(child.props?.children)
//   })

//   return found
// }

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
  // ボタン要素がcontentとして渡されたときに、nested buttonのエラーが出ている問題を解決する。
  // children を持たない場合は、EventRectを置き換えて、ボタン要素を直接描画しても設計としては問題ないはず。
  // children を持つ場合には、onClickを上書きされてしまうと、childrenを表示するためのonClickが発火しないので、console.warnを出す。
  // または、onClickを統合することができるか、どうか。
  // まずはcontentがボタンかどうかの判定が必要。
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
