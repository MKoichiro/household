// TODO: open stateを受け取り、イベントリスナーの登録とクリーンアップをopen stateに応じて行うことでパフォーマンスを向上できるか検討したうえで実装
// -> 複雑性が増すわり、効果が限定的なようなので、今のところ保留
// TODO: useContextMenuPosition: 命名が微妙
// -> positionStyleはステート、applyPositionは事実上その更新を担うので、usePositionStyleにするのが良いかもしれない
// コンテキストメニューの表示位置を計算するためのフック

import { useEffect, useReducer, useState, MouseEventHandler, useCallback } from 'react'
import { AnchorRelativity, ClickMode, Coordinate, CursorRelativity, Mode, PositionStyle } from '../types'
import { debounce } from '../../../../shared/utils/debounce'
import { addOffset, calcClickModePos, posCalcs, toTransform } from '../positionCalculator'
import { useResizeEffects } from '../../../../shared/hooks/useResizeEffects'

type PosAction =
  | { id: string; type: 'CUSTOM'; customPos: PositionStyle }
  | {
      id: string
      type: 'CLICK'
      norm: Coordinate
      offset: Coordinate
      cursorRelativity?: CursorRelativity
      clickMode: ClickMode
      anchorRect?: DOMRect
    }
  | { id: string; type: 'ANCHOR'; offset: Coordinate; anchorRelativity?: AnchorRelativity; anchorRect: DOMRect }

type PositionStyles = {
  [id: string]: PositionStyle
}

const reducer = (state: PositionStyles, action: PosAction): PositionStyles => {
  switch (action.type) {
    case 'CUSTOM':
      return { ...state, [action.id]: action.customPos }
    case 'CLICK': {
      const { id, norm, offset, cursorRelativity, clickMode, anchorRect } = action
      const coord = calcClickModePos(norm, clickMode, anchorRect)
      const { x: left, y: top } = addOffset(coord, offset)
      const transform = toTransform(cursorRelativity)
      return { ...state, [id]: { top, left, transform } }
    }
    case 'ANCHOR': {
      const { id, offset, anchorRelativity, anchorRect } = action
      const coord = anchorRelativity ? posCalcs[anchorRelativity](anchorRect) : posCalcs.none(anchorRect)
      const { x: left, y: top } = addOffset(coord, offset)
      const transform = toTransform(anchorRelativity)
      return { ...state, [id]: { top, left, transform } }
    }
  }
}

export type ContextMenuPositionConfigs = {
  [id: string]: {
    customPos?: PositionStyle
    mode: Mode
    offset: Coordinate
    cursorRelativity?: CursorRelativity
    anchorRelativity?: AnchorRelativity
    anchorElement: HTMLElement | null
  }
}

// TODO: UseContextMenuPositionReturn: 命名が悪い
type UseContextMenuPositionReturn = {
  [id: string]: {
    positionStyle: PositionStyle
    applyPosition: MouseEventHandler<unknown>
  }
}

export const useContextMenuPosition = (configs: ContextMenuPositionConfigs): UseContextMenuPositionReturn => {
  // PositionStyle: 最終的な絶対座標を CSSProperties で保持
  const defaultPos: PositionStyle = {
    top: 0,
    left: 0,
    right: 'auto',
    bottom: 'auto',
    transform: 'none',
  }
  const initialState: PositionStyles = Object.fromEntries(
    Object.keys(configs).map((id) => [id, defaultPos])
  ) as PositionStyles
  const [positionStyle, dispatch] = useReducer(reducer, initialState)

  // normCoords: clickModeで使用、window、または anchorRef 要素内での正規化座標（%単位の座標）を保持、リサイズで保存させる値
  const [normCoords, setNormCoords] = useState<Record<string, Coordinate> | undefined>(undefined)

  // 各メインモードに対応するディスパッチャー（デバッグ処理付き）
  const dispatchCustom = (id: string) => {
    const customPos = configs[id].customPos
    if (!customPos) {
      if (import.meta.env.MODE !== 'production') {
        console.warn('customPos is undefined, but dispatchCustom is called')
      }
      return
    }
    dispatch({ id, type: 'CUSTOM', customPos })
  }
  const dispatchClick = useCallback(
    (id: string, normCoord: Coordinate) => {
      if (configs[id].mode.main !== 'clicked') {
        if (import.meta.env.MODE !== 'production') {
          console.warn('normCoord is undefined or mode is not clicked, but dispatchClick is called')
        }
        return
      }
      const { sub: clickMode } = configs[id].mode
      dispatch({
        id,
        type: 'CLICK',
        norm: normCoord,
        offset: configs[id].offset,
        cursorRelativity: configs[id].cursorRelativity,
        clickMode,
        anchorRect: configs[id].anchorElement?.getBoundingClientRect(),
      })
    },
    [configs]
  )
  const dispatchAnchor = useCallback(
    (id: string) => {
      const rect = configs[id].anchorElement?.getBoundingClientRect()
      if (!rect) {
        if (import.meta.env.MODE !== 'production') {
          console.warn('anchorRect is undefined in dispatchAnchor')
        }
        return
      }
      dispatch({
        id,
        type: 'ANCHOR',
        offset: configs[id].offset,
        anchorRelativity: configs[id].anchorRelativity,
        anchorRect: rect,
      })
    },
    [configs]
  )

  // 位置更新関数、ディスパッチャーから追加処理がある場合は、ここで追加する
  const applyPositionCustom =
    (id: string): MouseEventHandler<unknown> =>
    (_e) =>
      dispatchCustom(id)
  const applyPositionClickAnchor =
    (id: string): MouseEventHandler<unknown> =>
    (e) => {
      if (configs[id].mode.main !== 'clicked') return
      const anchorRect = configs[id].anchorElement?.getBoundingClientRect()
      if (!anchorRect) return
      const normCoord = {
        y: (e.clientY - anchorRect.top) / anchorRect.height,
        x: (e.clientX - anchorRect.left) / anchorRect.width,
      }
      dispatchClick(id, normCoord)
      setNormCoords((prev) => ({ ...prev, [id]: normCoord }))
    }
  const applyPositionClickWin =
    (id: string): MouseEventHandler<unknown> =>
    (e) => {
      if (configs[id].mode.main !== 'clicked') return
      const normCoord = {
        y: (e.pageY - window.scrollY) / window.innerHeight,
        x: (e.pageX - window.scrollX) / window.innerWidth,
      }
      dispatchClick(id, normCoord)
      setNormCoords((prev) => ({ ...prev, [id]: normCoord }))
    }
  const applyPositionClickDoc = applyPositionClickWin
  const applyPositionAnchor =
    (id: string): MouseEventHandler<unknown> =>
    (_e) =>
      dispatchAnchor(id)

  // モードに応じて位置を決定する関数を返す
  const applyPosition = (id: string) => {
    const { main: mode } = configs[id].mode
    switch (mode) {
      case 'custom':
        return applyPositionCustom(id)
      case 'clicked':
        switch (configs[id].mode.sub) {
          case 'anchor':
            return applyPositionClickAnchor(id)
          case 'window':
            return applyPositionClickWin(id)
          case 'document':
            return applyPositionClickDoc(id)
          default:
            return applyPositionClickDoc(id)
        }
      case 'anchor':
        return applyPositionAnchor(id)
      default:
        return applyPositionCustom(id)
    }
  }

  // クリックモードのresizeイベントリスナー
  useEffect(() => {
    // クリックモードを持つ id がなければ何もしない
    const clickedIds = Object.entries(configs)
      .filter(([_id, config]) => config.mode.main === 'clicked')
      .map(([id]) => id)
    if (clickedIds.length === 0) return

    const onResize = debounce(() => {
      clickedIds.forEach((id) => {
        const coord = normCoords?.[id]
        if (coord) {
          dispatchClick(id, coord)
        }
      })
    }, 50)

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [configs, dispatchClick, normCoords])

  // アンカーモードのresizeイベントリスナー
  useEffect(() => {
    // アンカーモードの id だけ集める
    const anchorIds = Object.entries(configs)
      .filter(([_id, config]) => config.mode.main === 'anchor')
      .map(([id]) => id)
    if (anchorIds.length === 0) return

    // １つのリスナーで全 id を更新
    const onResize = debounce(() => {
      anchorIds.forEach((id) => dispatchAnchor(id))
    }, 50)

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [configs, dispatchAnchor])

  // アンカーモードの場合には、anchorElementの要素のサイズ変化を監視
  const anchorTargets = Object.fromEntries(
    Object.entries(configs)
      .filter(([, config]) => config.mode.main === 'anchor')
      .map(([id, config]) => [id, () => config.anchorElement] as const)
  ) as Record<string, () => HTMLElement | null>
  // useResizeEffects: 第一引数のRefObjectまたは要素を返す関数、第二引数は第一引数から得られる要素のリサイズで実行する副作用
  useResizeEffects(anchorTargets, (_el, id) => dispatchAnchor(id))

  return Object.fromEntries(
    Object.keys(configs).map((id) => [id, { positionStyle: positionStyle[id], applyPosition: applyPosition(id) }])
  ) as UseContextMenuPositionReturn
}
