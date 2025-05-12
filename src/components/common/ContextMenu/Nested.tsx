import { CSSProperties, useMemo, useReducer, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import MotionContext from './MotionContext'
import MenuContent from './MenuContent'
import { defaultAnimeConfigs } from './animationConfigs'
import { CoordinateOrigin, MenuUl } from './styled'
import { MenuItem, NestedProps } from './types'
import { keyEventCreator } from '../../../shared/utils/a11y'

const reducer = (state: MenuItem[], action: { id?: string; type: 'openOnly' | 'closeAll' }) => {
  switch (action.type) {
    case 'openOnly':
      return state.map((item) => ({ ...item, open: item.id === action.id }))
    case 'closeAll':
      return state.map((item) => ({ ...item, open: false }))
    default:
      throw new Error(`Unknown action type: ${action.type as string}`)
  }
}

const Nested = ({
  menuTree,
  animeConfig = defaultAnimeConfigs.sub,
  toLeft,
  autoIconBulk,
  subMenuPosition,
}: NestedProps) => {
  // reducer 管理するステートは子Nested 以下の情報を切り捨てたシャローな設計とすることで、再帰性による冗長化を回避する。
  const initialState = useMemo(() => {
    return menuTree.map((item) => ({
      id: item.id,
      display: item.display,
      autoIcon: !!item.autoIcon,
      hasChildren: !!item.children,
      open: !!item.open,
      dividerAfter: !!item.dividerAfter,
    })) as MenuItem[]
  }, [menuTree])
  const [menuItems, dispatch] = useReducer(reducer, initialState)

  // 「子を持つ子」をフィルター
  const childrenHasChildren = useMemo(() => menuTree.filter((item) => item.children), [menuTree])

  // 子Nested を持つ親側の li を記録。その offsetTop を子Nested 表示時の y 座標のオフセット値とする。
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const refCallbacks = Object.fromEntries(
    childrenHasChildren.map(({ id }) => [
      id,
      (el: HTMLElement | null) => {
        if (el) refs.current[id] = el
        else delete refs.current[id]
      },
    ])
  ) as Record<string, (el: HTMLElement | null) => void>

  // ヘルパー
  const getOffsetTop = (id: string) => refs.current[id]?.offsetTop ?? 0
  const subMenuPositionStyle = (id: string): Pick<CSSProperties, 'top' | 'transform'> => {
    const { strategy, offsetY } = subMenuPosition
    switch (strategy) {
      case 'absoluteTop':
        return { top: 0, transform: 'none' }
      case 'parentTop':
        return { top: getOffsetTop(id) + (offsetY ?? 0), transform: 'none' }
      case 'parentCenter':
        return {
          top: getOffsetTop(id) + (offsetY ?? 0) - (refs.current[id]?.offsetHeight ?? 0) / 2,
          transform: 'none',
        }
      default:
        throw new Error(`Unknown strategy: ${strategy as string}`)
    }
  }
  const openOnly = (id: string) => dispatch({ id, type: 'openOnly' })
  const closeBelowChildren = () => dispatch({ type: 'closeAll' })
  // 子Nested は childrenHasChildren を元にレンダーするが、子Nested が開いているかの情報は menuItems 側にあるので、id で open を取得する関数を用意
  const getOpen = (id: string) => menuItems.find((item) => item.id === id)?.open ?? false
  const additionalStyle = (id: string): CSSProperties => {
    const common: CSSProperties = {
      position: 'absolute',
      ...subMenuPositionStyle(id),
    }
    return toLeft ? { ...common, right: 0 } : { ...common, left: 0 }
  }

  // ハンドラー
  const handleToggleByMouseEnter = (item: MenuItem) => {
    if (item.hasChildren) {
      return () => openOnly(item.id)
    } else if (menuItems.some((menuItem) => menuItem.open)) {
      return () => closeBelowChildren()
    }
    return () => {}
  }

  const handleToggleByClick = (item: MenuItem) => {
    if (item.hasChildren && menuItems.every((menuItem) => !menuItem.open)) {
      return () => openOnly(item.id)
    } else if (menuItems.some((menuItem) => menuItem.open)) {
      return () => closeBelowChildren()
    }
    return () => {}
  }

  return (
    <>
      <MenuUl className="context-menu menu-list" role="menu">
        {menuItems.map((item) => (
          <MenuContent
            id={item.id}
            ref={refCallbacks[item.id]}
            key={item.id}
            content={item.display}
            includeButton={item.includeButton}
            hasChildren={item.hasChildren}
            onMouseEnter={handleToggleByMouseEnter(item)}
            onClick={handleToggleByClick(item)}
            onKeyDown={keyEventCreator({ enter: handleToggleByClick(item), escape: closeBelowChildren })}
            autoIcon={item.autoIcon || autoIconBulk} // autoIcon は個別指定を優先する
            dividerAfter={item.dividerAfter}
          />
        ))}
      </MenuUl>

      {/* 子を持つ子に対して再帰的にレンダー */}
      {childrenHasChildren.length > 0 && ( // ループ末尾の空 CoordinateOrigin のレンダーを回避
        <CoordinateOrigin>
          <AnimatePresence>
            {childrenHasChildren
              .filter((children) => getOpen(children.id)) // open のみを条件付きレンダリング（アニメーションのトリガー）
              .map((children) => (
                <MotionContext
                  key={children.id}
                  id={children.id}
                  animeConfig={animeConfig}
                  toLeft={toLeft}
                  style={additionalStyle(children.id)}
                >
                  <Nested
                    menuTree={children.children!}
                    animeConfig={animeConfig}
                    toLeft={toLeft}
                    autoIconBulk={autoIconBulk}
                    subMenuPosition={subMenuPosition}
                  />
                </MotionContext>
              ))}
          </AnimatePresence>
        </CoordinateOrigin>
      )}
    </>
  )
}

export default Nested
