import { useEffect, useReducer, useState, RefObject, MouseEventHandler, useCallback } from 'react'
import { AnchorRelativity, ClickMode, Coordinate, CursorRelativity, Mode, PosStyle } from '../types'
import { debounce } from '../../../../shared/utils/debounce'
import { addOffset, calcClickModePos, posCalcs, toTransform } from '../positionCalculator'
import { useResizeEffect } from '../../../../shared/hooks/useResizeEffects'

type PosAction =
  | { type: 'CUSTOM'; customPos: PosStyle }
  | {
      type: 'CLICK'
      norm: Coordinate
      offset: Coordinate
      cursorRelativity?: CursorRelativity
      clickMode: ClickMode
      anchorRect?: DOMRect
    }
  | { type: 'ANCHOR'; offset: Coordinate; anchorRelativity?: AnchorRelativity; anchorRect: DOMRect }

const reducer = (_state: PosStyle, action: PosAction): PosStyle => {
  switch (action.type) {
    case 'CUSTOM':
      return action.customPos

    case 'CLICK': {
      const { norm, offset, cursorRelativity, clickMode, anchorRect } = action
      const coord = calcClickModePos(norm, clickMode, anchorRect)
      const { x: left, y: top } = addOffset(coord, offset)
      return { top, left, transform: toTransform(cursorRelativity) }
    }

    case 'ANCHOR': {
      const { offset, anchorRelativity, anchorRect } = action
      const coord = anchorRelativity ? posCalcs[anchorRelativity](anchorRect) : posCalcs.none(anchorRect)
      const { x: left, y: top } = addOffset(coord, offset)
      return { top, left, transform: toTransform(anchorRelativity) }
    }
  }
}

type UseContextMenuPositionArgs<T extends HTMLElement> = {
  customPos?: PosStyle
  mode: Mode
  offset: Coordinate
  cursorRelativity?: CursorRelativity
  anchorRelativity?: AnchorRelativity
  anchorRef: RefObject<T | null>
}

type UseContextMenuPositionReturn = {
  posStyle: PosStyle
  setPosition: MouseEventHandler<unknown>
}

export const useContextMenuPosition = <T extends HTMLElement>(
  args: UseContextMenuPositionArgs<T>
): UseContextMenuPositionReturn => {
  const { customPos, mode, offset, cursorRelativity, anchorRelativity, anchorRef } = args

  // 最終的な絶対座標を CSSProperties で保持
  const [posStyle, dispatch] = useReducer(reducer, {
    top: 0,
    left: 0,
    right: 'auto',
    bottom: 'auto',
    transform: 'none',
  })
  // clickModeで使用、window、または anchorRef 要素内での正規化座標（%単位の座標）を保持
  const [normCoord, setNormCoord] = useState<Coordinate | undefined>(undefined)

  const dispatchCustom = () => {
    if (!customPos) {
      if (import.meta.env.MODE !== 'production') {
        console.warn('customPos is undefined, but dispatchCustom is called')
      }
      return
    }
    dispatch({ type: 'CUSTOM', customPos })
  }

  const dispatchClick = useCallback(
    (normCoord: Coordinate) => {
      if (mode.main !== 'clicked') {
        if (import.meta.env.MODE !== 'production') {
          console.warn('normCoord is undefined or mode is not clicked, but dispatchClick is called')
        }
        return
      }
      const { sub: clickMode } = mode
      const anchorRect = anchorRef.current?.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0)
      dispatch({
        type: 'CLICK',
        norm: normCoord,
        offset,
        cursorRelativity,
        clickMode,
        anchorRect,
      })
    },
    [mode, offset, cursorRelativity, anchorRef]
  )

  const dispatchAnchor = useCallback(() => {
    if (!anchorRef.current) {
      if (import.meta.env.MODE !== 'production') {
        console.warn('anchorRef is undefined, but dispatchAnchor is called')
      }
      return
    }
    const anchorRect = anchorRef.current.getBoundingClientRect()
    dispatch({
      type: 'ANCHOR',
      offset,
      anchorRelativity,
      anchorRect,
    })
  }, [offset, anchorRelativity, anchorRef])

  const setPositionCustom: MouseEventHandler<unknown> = (_e) => dispatchCustom()
  const setPositionClickAnchor: MouseEventHandler<unknown> = (e) => {
    if (!anchorRef.current) return
    const anchorRect = anchorRef.current.getBoundingClientRect()
    const normCoord = {
      y: (e.clientY - anchorRect.top) / anchorRect.height,
      x: (e.clientX - anchorRect.left) / anchorRect.width,
    }
    dispatchClick(normCoord)
    setNormCoord(normCoord)
  }
  const setPositionClickWin: MouseEventHandler<unknown> = (e) => {
    const normCoord = {
      y: (e.pageY - window.scrollY) / window.innerHeight,
      x: (e.pageX - window.scrollX) / window.innerWidth,
    }
    dispatchClick(normCoord)
    setNormCoord(normCoord)
  }
  const setPositionClickDoc: MouseEventHandler<unknown> = (e) => {
    const normCoord = {
      y: (e.pageY - window.scrollY) / window.innerHeight,
      x: (e.pageX - window.scrollX) / window.innerWidth,
    }
    dispatchClick(normCoord)
    setNormCoord(normCoord)
  }
  const setPositionAnchor: MouseEventHandler<unknown> = (_e) => dispatchAnchor()

  // クリックモードのresizeイベントリスナー
  useEffect(() => {
    if (mode.main !== 'clicked') return

    // リサイズ時に、normCoord を再計算する
    const onResize = debounce(() => {
      if (!normCoord) return
      dispatchClick(normCoord)
    }, 50)

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [mode.main, dispatchClick, normCoord])

  // アンカーモードのresizeイベントリスナー
  useEffect(() => {
    if (mode.main !== 'anchor') return

    const onResize = debounce(() => {
      dispatchAnchor()
    }, 50)

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [dispatchAnchor, mode.main])

  // アンカーモードの場合には、anchorRef 要素のサイズ変化を監視
  useResizeEffect(anchorRef, dispatchAnchor)

  // 呼び出し側に返す関数をモードごとに切り替え
  switch (mode.main) {
    case 'custom':
      return { posStyle, setPosition: setPositionCustom }
    case 'clicked':
      switch (mode.sub) {
        case 'anchor':
          return { posStyle, setPosition: setPositionClickAnchor }
        case 'window':
          return { posStyle, setPosition: setPositionClickWin }
        case 'document':
          return { posStyle, setPosition: setPositionClickDoc }
        default:
          return { posStyle, setPosition: setPositionClickDoc }
      }
    case 'anchor':
      return { posStyle, setPosition: setPositionAnchor }
    default:
      return { posStyle, setPosition: setPositionCustom }
  }
}
