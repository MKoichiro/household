import {
  createRef,
  CSSProperties,
  memo,
  ReactNode,
  RefObject,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { AnimatePresence } from 'framer-motion'
import MotionContext from './MotionContext'
import MenuContent from './MenuContent'
import { AnimeConfigs, defaultAnimeConfigs } from './animationConfigs'
import { CoordinateOrigin, MenuUl } from './styled'
import { MenuTree } from './types'

interface MenuItem {
  id: string
  display: ReactNode
  hasChildren: boolean
  open: boolean
  autoIcon: boolean
  dividerAfter: boolean
}

interface NestedProps {
  menuTree: MenuTree[]
  animeConfigs: AnimeConfigs
  toLeft: boolean
  autoIconBulk: boolean
}

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

const Nested = memo(({ menuTree, animeConfigs = defaultAnimeConfigs, toLeft, autoIconBulk }: NestedProps) => {
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
  const refs = useRef<Record<string, RefObject<HTMLLIElement | null> | undefined>>({})
  useLayoutEffect(() => {
    // createRef は副作用
    childrenHasChildren.forEach((item) => {
      if (!refs.current[item.id]) refs.current[item.id] = createRef<HTMLLIElement | null>()
    })
  }, [childrenHasChildren])

  // ヘルパー
  const getOffsetTop = (id: string) => refs.current[id]?.current?.offsetTop ?? 0
  const openOnly = (id: string) => dispatch({ id, type: 'openOnly' })
  const closeBelowChildren = () => dispatch({ type: 'closeAll' })
  // 子Nested は childrenHasChildren を元にレンダーするが、子Nested が開いているかの情報は menuItems 側にあるので、id で open を取得する関数を用意
  const getOpen = (id: string) => menuItems.find((item) => item.id === id)?.open ?? false
  const additionalStyle = (id: string): CSSProperties => {
    const common: CSSProperties = {
      position: 'absolute',
      top: `${getOffsetTop(id)}px`,
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
      <MenuUl className="context-menu menu-list">
        {menuItems.map((item) => (
          <MenuContent
            id={item.id}
            ref={refs.current[item.id]}
            key={item.id}
            content={item.display}
            hasChildren={item.hasChildren}
            onMouseEnter={handleToggleByMouseEnter(item)}
            onClick={handleToggleByClick(item)}
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
                  animeConfigs={animeConfigs}
                  toLeft={toLeft}
                  style={additionalStyle(children.id)}
                >
                  <Nested
                    menuTree={children.children!}
                    animeConfigs={animeConfigs}
                    toLeft={toLeft}
                    autoIconBulk={autoIconBulk}
                  />
                </MotionContext>
              ))}
          </AnimatePresence>
        </CoordinateOrigin>
      )}
    </>
  )
})
Nested.displayName = 'Nested'

export default Nested
