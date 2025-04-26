import { useEffect, useRef, createRef, RefObject, useReducer, useMemo } from 'react'
import { useResizeObservers } from './useResizeObserver'
import { v4 as uuidv4 } from 'uuid'

/* ------------------------------------------------------------------
 *  複数 Accordion
 * ---------------------------------------------------------------- */
export type AccordionsDefaultType = Record<string, boolean> // { id: boolean }
type AccordionCurrentType = { open: boolean; height: number }
type AccordionsMap = Record<string, AccordionCurrentType> // { id: { open: boolean; height: number } }

/* ---------- 初期変換 ---------- */
// { id: boolean } から { id: { open: boolean; height: number } } に変換
const initializer = (defaultStates: AccordionsDefaultType): AccordionsMap =>
  Object.fromEntries(Object.entries(defaultStates).map(([id, open]) => [id, { open, height: 0 }])) as AccordionsMap

/* ---------- アクション ---------- */
type Action =
  | { type: 'SET_HEIGHT'; id: string; height: number }
  | { type: 'TOGGLE'; id: string }
  | { type: 'OPEN'; id: string }
  | { type: 'CLOSE'; id: string }
  | { type: 'CONTROLLED_TOGGLE'; id: string }

const reducer = (s: AccordionsMap, a: Action): AccordionsMap => {
  switch (a.type) {
    case 'SET_HEIGHT':
      return { ...s, [a.id]: { ...s[a.id], height: a.height } }
    case 'TOGGLE':
      return { ...s, [a.id]: { ...s[a.id], open: !s[a.id].open } }
    case 'OPEN':
      return { ...s, [a.id]: { ...s[a.id], open: true } }
    case 'CLOSE':
      return { ...s, [a.id]: { ...s[a.id], open: false } }
    case 'CONTROLLED_TOGGLE': {
      const next = Object.fromEntries(
        Object.entries(s).map(([id, item]) => [id, { ...item, open: false }])
      ) as AccordionsMap
      next[a.id].open = !s[a.id].open
      return next
    }
    default:
      return s
  }
}

/* ---------- メイン Hook ---------- */
export const useAccordions = (defaultStates: AccordionsDefaultType, OBSERVER_DELAY = 30) => {
  const [acc, dispatch] = useReducer(reducer, defaultStates, initializer)

  // 依存関係の準備
  // 使用側で、メモ化が施されていないオブジェクトで定義されると、
  // defaultStatesの参照はレンダリング毎に変わり無限ループ。文字列化しておく。
  const ids = useMemo(() => Object.keys(defaultStates), [defaultStates])
  const idKey = ids.join(',')

  /* refs */
  // refs.current: { id: RefObject<HTMLDivElement | null> }
  const refs = useRef<Record<string, RefObject<HTMLDivElement | null>>>({})
  ids.forEach((id) => {
    if (!refs.current[id]) refs.current[id] = createRef<HTMLDivElement | null>()
  })

  /* ResizeObserver */
  // 自作フックで全要素のスクロール高さだけを取得
  const heights = useResizeObservers(refs.current, (el) => el.scrollHeight, {
    delay: OBSERVER_DELAY,
    initialValues: {},
  })

  useEffect(() => {
    ids.forEach((id) => {
      const newH = heights[id]
      if (typeof newH === 'number' && newH !== acc[id].height) {
        dispatch({ type: 'SET_HEIGHT', id, height: newH })
      }
    })
    // heights が変わるたび走る。
  }, [heights, idKey])

  /* id 安全チェック */
  const ensure = (id: string) => {
    if (!(id in acc)) throw new Error(`useAccordions: id "${id}" は存在しません`)
    return id
  }

  /* return */
  return {
    contentRefs: refs.current, // ref map
    accordions: acc, // open & height 両方参照可
    toggle: (id: string) => () => dispatch({ type: 'TOGGLE', id: ensure(id) }),
    open: (id: string) => () => dispatch({ type: 'OPEN', id: ensure(id) }),
    close: (id: string) => () => dispatch({ type: 'CLOSE', id: ensure(id) }),
    controlledToggle: (id: string) => () => dispatch({ type: 'CONTROLLED_TOGGLE', id: ensure(id) }),
  }
}

/* ------------------------------------------------------------------
 *  単一 Accordion
 * ---------------------------------------------------------------- */
export const useAccordion = (defaultState: boolean = false) => {
  const idRef = useRef(uuidv4())
  const { contentRefs, accordions, toggle, open, close } = useAccordions({ [idRef.current]: defaultState })
  return {
    contentRef: contentRefs[idRef.current],
    isOpen: accordions[idRef.current].open,
    contentHeight: accordions[idRef.current].height,
    toggle: () => toggle(idRef.current)(),
    open: () => open(idRef.current)(),
    close: () => close(idRef.current)(),
  }
}
