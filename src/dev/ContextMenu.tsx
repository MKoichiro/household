// コンテキストメニュー（windows 右クリックのような UI）の実装
// NOTE: 依存関係
// - framer-motion: アニメーションライブラリ(必須)
// - @mui/icons-material: アイコン部分のみなのでちょっと弄れば依存しない
// - @emotion/styled: styled-components の styledと 等価
// - 自作の portalProvider

// TODO: 1. dividerを挿入可能にする。
// TODO: 2. クリックした位置にメニューを表示する。

import {
  createRef,
  CSSProperties,
  forwardRef,
  memo,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import styled from '@emotion/styled'
import { usePortal } from '../shared/hooks/useContexts'

const useClickAway = (refs: (RefObject<HTMLElement | null> | undefined)[], callback: () => void) => {
  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      // refs のいずれかにも含まれない要素がクリックされた場合のみ、コールバックを実行
      if (!refs.some((ref) => ref === undefined || ref.current?.contains(e.target as Node))) {
        callback()
      }
    }
    document.addEventListener('mousedown', handleClickAway)
    return () => {
      document.removeEventListener('mousedown', handleClickAway)
    }
  }, [refs, callback])
}

// 単一のメニュー項目を表す型
export interface MenuTree {
  id: string
  /* メニューに表示するモノ */
  display: ReactNode
  /* 子メニュー（あれば） */
  children?: MenuTree[]
  /* ネストされた children オブジェクトで true とする場合は先祖すべても open を指定すること。 */
  open?: boolean
}

interface MenuItem {
  id: string
  display: ReactNode
  hasChildren: boolean
  open: boolean
}

const variants: Variants = {
  hidden: { scale: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
  animate: { scale: 1, transition: { duration: 0.2, ease: 'easeInOut' } },
}

export interface AnimeConfigs {
  variants: Variants
  initial: string
  animate: string
  exit: string
}

const defaultAnimeConfigs: AnimeConfigs = {
  variants,
  initial: 'hidden',
  animate: 'animate',
  exit: 'hidden',
}

interface MotionContextProps {
  id: string
  animeConfigs: AnimeConfigs
  toLeft: boolean
  style?: CSSProperties
  children: ReactNode
}

const MotionContext = ({ id, animeConfigs, toLeft = true, style, children }: MotionContextProps) => {
  return (
    <MotionContextBase key={id} {...animeConfigs} $toLeft={toLeft} style={style}>
      {children}
    </MotionContextBase>
  )
}

type RelativePositionStrategy =
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

type PositionStyle = Pick<CSSProperties, 'top' | 'left' | 'transform'>
type PositionCalculator = Record<RelativePositionStrategy, ((rect: DOMRect) => PositionStyle) | (() => PositionStyle)>

const positionCalculator: PositionCalculator = {
  // ■ 相対位置を指定しない場合のデフォルト位置
  none: () => ({
    top: 0,
    left: 0,
    transform: 'none',
  }),

  // ■ 内側ど真ん中
  innerCenter: (r) => ({
    top: r.top + window.scrollY + r.height / 2,
    left: r.left + window.scrollX + r.width / 2,
    transform: 'translate(-50%,-50%)',
  }),

  // ■ 内側から辺と接しながらその辺の真ん中
  innerTopCenter: (r) => ({
    top: r.top + window.scrollY,
    left: r.left + window.scrollX + r.width / 2,
    transform: 'translateX(-50%)',
  }),
  innerRightCenter: (r) => ({
    top: r.top + window.scrollY + r.height / 2,
    left: r.right + window.scrollX,
    transform: 'translate(-100%,-50%)',
  }),
  innerBottomCenter: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.left + window.scrollX + r.width / 2,
    transform: 'translate(-50%,-100%)',
  }),
  innerLeftCenter: (r) => ({
    top: r.top + window.scrollY + r.height / 2,
    left: r.left + window.scrollX,
    transform: 'translateY(-50%)',
  }),

  // ■ 対角線方向の内側コーナー
  innerTopLeftCorner: (r) => ({ top: r.top + window.scrollY, left: r.left + window.scrollX }),
  innerTopRightCorner: (r) => ({
    top: r.top + window.scrollY,
    left: r.right + window.scrollX,
    transform: 'translateX(-100%)',
  }),
  innerBottomLeftCorner: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.left + window.scrollX,
    transform: 'translateY(-100%)',
  }),
  innerBottomRightCorner: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.right + window.scrollX,
    transform: 'translate(-100%, -100%)',
  }),

  // ■ 外側から接する辺・寄せ方向
  outerTopLeft: (r) => ({ top: r.top + window.scrollY, left: r.left + window.scrollX, transform: 'translateY(-100%)' }),
  outerTopCenter: (r) => ({
    top: r.top + window.scrollY,
    left: r.left + window.scrollX + r.width / 2,
    transform: 'translate(-50%,-100%)',
  }),
  outerTopRight: (r) => ({
    top: r.top + window.scrollY,
    left: r.right + window.scrollX,
    transform: 'translate(-100%, -100%)',
  }),

  outerRightTop: (r) => ({ top: r.top + window.scrollY, left: r.right + window.scrollX, transform: 'translateX(0)' }),
  outerRightCenter: (r) => ({
    top: r.top + window.scrollY + r.height / 2,
    left: r.right + window.scrollX,
    transform: 'translateY(-50%)',
  }),
  outerRightBottom: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.right + window.scrollX,
    transform: 'translateY(-100%)',
  }),

  outerBottomRight: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.right + window.scrollX,
    transform: 'translateX(-100%)',
  }),
  outerBottomLeft: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.left + window.scrollX,
    // transform: 'translateY(0)',
  }),
  outerBottomCenter: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.left + window.scrollX + r.width / 2,
    transform: 'translateX(-50%)',
  }),

  outerLeftBottom: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.left + window.scrollX,
    transform: 'translate(-100%, -100%)',
  }),
  outerLeftCenter: (r) => ({
    top: r.top + window.scrollY + r.height / 2,
    left: r.left + window.scrollX,
    transform: 'translate(-100%,-50%)',
  }),
  outerLeftTop: (r) => ({ top: r.top + window.scrollY, left: r.left + window.scrollX, transform: 'translateX(-100%)' }),

  // ■ 対角線方向の外側コーナー
  outerTopLeftCorner: (r) => ({
    top: r.top + window.scrollY,
    left: r.left + window.scrollX,
    transform: 'translate(-100%,-100%)',
  }),
  outerTopRightCorner: (r) => ({
    top: r.top + window.scrollY,
    left: r.right + window.scrollX,
    transform: 'translateY(-100%)',
  }),
  outerBottomRightCorner: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.right + window.scrollX,
    // transform: 'translate(0,0)',
  }),
  outerBottomLeftCorner: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.left + window.scrollX,
    transform: 'translateX(-100%)',
  }),

  // ■ 辺上をまたぐ（サイズも合わせる）
  boundaryTop: (r) => ({
    top: r.top + window.scrollY,
    left: r.left + window.scrollX + r.width / 2,
    transform: 'translate(-50%,-50%)',
  }),
  boundaryRight: (r) => ({
    top: r.top + window.scrollY + r.height / 2,
    left: r.right + window.scrollX,
    transform: 'translate(-50%,-50%)',
  }),
  boundaryBottom: (r) => ({
    top: r.bottom + window.scrollY,
    left: r.left + window.scrollX + r.width / 2,
    transform: 'translate(-50%,-50%)',
  }),
  boundaryLeft: (r) => ({
    top: r.top + window.scrollY + r.height / 2,
    left: r.left + window.scrollX,
    transform: 'translate(-50%,-50%)',
  }),
}

export interface ContextMenuOriginProps {
  id?: string
  animeConfigs?: AnimeConfigs
  open: boolean
  menuTree: MenuTree[]
  /* イベント受け入れ対象に追加しないと */
  closeBtnRef?: RefObject<HTMLElement | null>
  onClose?: () => void
  /* サブメニューの展開方向。デフォルトは←方向 */
  direction?: 'left' | 'right'
  /* ルートメニューの初期位置の基準となる要素への参照。渡さない場合、画面左上に表示される。 */
  anchorRef?: RefObject<HTMLElement | null>
  /* アンカー要素からの相対位置 */
  relativePositionStrategy?: RelativePositionStrategy
  /* anchorRefを指定しない場合には、デフォルトの左上基準からの位置。anchorRefを指定した場合には、anchorRefの左上からの位置。customPosition が指定されている場合、relativePositionStrategy は無視される */
  customPosition?: PositionStyle
  /* ルート要素のスタイル。必要があれば。指定しないことを推奨。 */
  style?: CSSProperties
}

const ContextMenuOrigin = ({
  id = 'context-menu-origin',
  animeConfigs = defaultAnimeConfigs,
  open,
  menuTree,
  onClose: handleClose,
  closeBtnRef,
  direction = 'left',
  anchorRef,
  relativePositionStrategy = 'none',
  customPosition,
  style = {},
}: ContextMenuOriginProps) => {
  const rootRef = useRef<HTMLDivElement>(null) // root配下の要素のイベント
  const portalRenderer = usePortal('context-menu')
  const toLeft = direction === 'left'

  // rootRef の配下の要素「以外」をクリックした場合にのみ、コールバックを実行
  // これにより、メニューの外側をクリックしたときにメニューを閉じることができる
  useClickAway([rootRef, closeBtnRef], () => handleClose?.())

  const [pos, setPos] = useState<PositionStyle>((positionCalculator.none as () => PositionStyle)()) // 初期値は none

  // open が true になったタイミングでアンカー座標を測る
  useEffect(() => {
    if (open && anchorRef?.current) {
      if (customPosition) return // customPosition が指定されている場合、relativePositionStrategy は無視される
      const rect = anchorRef.current.getBoundingClientRect()
      const position = positionCalculator[relativePositionStrategy](rect)
      setPos(position)
    }
  }, [open, anchorRef, relativePositionStrategy, customPosition])

  return (
    <>
      {portalRenderer(
        <AnimatePresence>
          {open && (
            <ContextMenuRoot className="context-menu-root" ref={rootRef} $pos={pos} style={style}>
              <MotionContext id={id} animeConfigs={animeConfigs} toLeft={toLeft}>
                <Nested menuTree={menuTree} animeConfigs={animeConfigs} toLeft={toLeft} />
              </MotionContext>
            </ContextMenuRoot>
          )}
        </AnimatePresence>
      )}
    </>
  )
}

const ContextMenuRoot = styled.div<{ $pos: PositionStyle }>`
  pointer-events: auto;
  position: absolute;
  z-index: 3000;
  top: ${({ $pos }) => ($pos.top != null ? `${$pos.top}px` : 'auto')};
  left: ${({ $pos }) => ($pos.left != null ? `${$pos.left}px` : 'auto')};
  transform: ${({ $pos }) => $pos.transform ?? 'none'};
`

const MotionContextBase = styled(motion.div)<{ $toLeft: boolean }>`
  display: flex;
  transform-origin: ${({ $toLeft }) => ($toLeft ? 'top right' : 'top left')};
  flex-direction: ${({ $toLeft }) => ($toLeft ? 'row-reverse' : 'row')};
`

const CoordinateOrigin = styled.div`
  position: relative;
`

interface NestedProps {
  menuTree: MenuTree[]
  animeConfigs: AnimeConfigs
  toLeft: boolean
}

// 複数のアクション（toggle, open, close）に対応するリデューサー
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

const Nested = memo(({ menuTree, animeConfigs = defaultAnimeConfigs, toLeft }: NestedProps) => {
  // reducer管理するステートは子Nested以下の情報を切り捨てたシャローな設計とすることで、再帰性による冗長化を回避する。
  const initialState = useMemo(() => {
    return menuTree.map((item) => ({
      id: item.id,
      display: item.display,
      hasChildren: !!item.children,
      open: !!item.open,
    })) as MenuItem[]
  }, [menuTree])
  const [menuItems, dispatch] = useReducer(reducer, initialState)

  // 「子を持つ子」をフィルター
  const childrenHasChildren = useMemo(() => menuTree.filter((item) => item.children), [menuTree])

  // 子Nested を持つ親側の li を記録。その offsetTop を子Nested 表示時の y 座標のオフセット値とする。
  const refs = useRef<Record<string, RefObject<HTMLLIElement | null> | undefined>>({})
  childrenHasChildren.forEach((item) => {
    if (!refs.current[item.id]) refs.current[item.id] = createRef<HTMLLIElement | null>()
  })

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
  }

  const handleToggleByClick = (item: MenuItem) => {
    if (item.hasChildren && menuItems.every((menuItem) => !menuItem.open)) {
      return () => openOnly(item.id)
    } else if (menuItems.some((menuItem) => menuItem.open)) {
      return () => closeBelowChildren()
    }
  }

  return (
    <>
      <MenuUl className="context-menu menu-list">
        {menuItems.map((item) => (
          <MenuContent
            ref={refs.current[item.id]}
            key={item.id}
            content={item.display}
            hasChildren={item.hasChildren}
            onMouseEnter={handleToggleByMouseEnter(item)}
            onClick={handleToggleByClick(item)}
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
                  <Nested menuTree={children.children!} animeConfigs={animeConfigs} toLeft={toLeft} />
                </MotionContext>
              ))}
          </AnimatePresence>
        </CoordinateOrigin>
      )}
    </>
  )
})
Nested.displayName = 'Nested'

interface MenuContentProps {
  content: ReactNode
  hasChildren: boolean
  icon?: ReactNode
  onClick?: () => void
  onMouseEnter?: () => void
}

const MenuContent = forwardRef<HTMLLIElement | null, MenuContentProps>(
  ({ content, hasChildren, icon, onClick: handleClick, onMouseEnter: handleToggle }, ref?) => {
    return (
      // CoordinateRect は矩形情報を ref 経由で提供する。子Nested の表示位置を決定するために必要。
      <CoordinateRect ref={ref}>
        <EventRect className="context-menu event-rect" onClick={handleClick} onMouseEnter={handleToggle}>
          {content}
          {hasChildren ? icon ? icon : <ArrowForwardIosIcon /> : null}
        </EventRect>
      </CoordinateRect>
    )
  }
)
MenuContent.displayName = 'MenuContent'

const MenuUl = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.header.main};
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 0.25rem;
`

const CoordinateRect = styled.li`
  padding: 0;
  margin: 0;
`

const EventRect = styled.button`
  --margin-x: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1em;
  text-align: left;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem var(--margin-x);
  width: calc(100% - var(--margin-x) * 2);
  border: none;
  border-radius: 0.25rem;
  background: none;
  color: white;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  svg {
    width: 0.75em;
    height: 0.75em;
    margin-left: auto;
  }
`

export default ContextMenuOrigin
