import { useReducer, useMemo, useState } from 'react'

import positionCalculators from '@components/common/ContextMenu/positionCalculators'
import type {
  Coordinate,
  IdOpenMap,
  IdOpenMapAction,
  PositionStyle,
  PositionStyles,
  PositionStylesAction,
  UseContextMenuStatesArgs,
  UseContextMenuStatesReturns,
} from '@components/common/ContextMenu/types'

import { orDefault } from './defaultConfigs'

/** IdOpenMap を更新する reducer */
const idOpenReducer = (state: IdOpenMap, action: IdOpenMapAction): IdOpenMap => {
  switch (action.type) {
    case 'OPEN':
      if (state[action.id]) return state
      return { ...state, [action.id]: true }

    case 'CLOSE':
      if (!state[action.id]) return state
      return { ...state, [action.id]: false }

    case 'CLOSE_ALL':
      if (!Object.values(state).some((v) => v)) return state
      return Object.fromEntries(Object.keys(state).map((id) => [id, false])) as IdOpenMap

    case 'CONTROLLED_OPEN': {
      // 自分だけ true の新しい状態を生成
      const next = Object.fromEntries(Object.keys(state).map((key) => [key, key === action.id])) as IdOpenMap
      // prev と同じならそのまま返して再レンダリング抑制
      const isSame = Object.keys(next).every((key) => state[key] === next[key])
      return isSame ? state : next
    }

    case 'TOGGLE':
      // prev を使ってトグルのみ
      return { ...state, [action.id]: !state[action.id] }

    case 'CONTROLLED_TOGGLE': {
      // 「閉じているなら他を閉じて開く」「開いているなら全閉じ」
      const next = (
        state[action.id]
          ? Object.fromEntries(Object.keys(state).map((key) => [key, false]))
          : Object.fromEntries(Object.keys(state).map((key) => [key, key === action.id]))
      ) as IdOpenMap
      // prev と同じならそのまま返して再レンダリング抑制
      const isSame = Object.keys(next).every((key) => state[key] === next[key])
      return isSame ? state : next
    }

    case 'SYNC_CONFIGS': {
      // configs の増減に合わせて state を再構築
      const next = Object.fromEntries(action.ids.map((id) => [id, state[id] ?? false])) as IdOpenMap
      // 完全一致なら prev を返す
      const same = action.ids.length === Object.keys(state).length && action.ids.every((id) => state[id] === next[id])
      return same ? state : next
    }

    default:
      return state
  }
}

const positionStylesReducer = (state: PositionStyles, action: PositionStylesAction): PositionStyles => {
  switch (action.type) {
    case 'CUSTOM':
      return { ...state, [action.id]: action.customPos }
    case 'CLICK': {
      const { id, normCoord, offset, cursorRelativity, clickMode, anchorRect } = action
      const { clicked, addOffset, relativityToTransform } = positionCalculators
      const coord = clicked[clickMode](normCoord, anchorRect)
      const { x: left, y: top } = addOffset(coord, offset)
      const transform = relativityToTransform(cursorRelativity)
      return { ...state, [id]: { top, left, transform } }
    }
    case 'ANCHOR': {
      const { id, offset, anchorRelativity, anchorRect } = action
      const { anchor, addOffset, relativityToTransform } = positionCalculators
      const coord = anchorRelativity ? anchor[anchorRelativity](anchorRect) : anchor.none(anchorRect)
      const { x: left, y: top } = addOffset(coord, offset)
      const transform = relativityToTransform(anchorRelativity)
      return { ...state, [id]: { top, left, transform } }
    }
    default:
      throw new Error(`Unknown action type: ${(action as PositionStylesAction).type}`)
  }
}

/**
 * @internal
 * コンテキストメニューで扱うステートを管理するフック。
 *
 * @param configs - コンテキストメニューの設定配列
 * @param positionConfigs - コンテキストメニューの位置関連の設定
 * @param commonConfig - 共通のコンテキストメニュー設定
 * @returns idOpenMap, positionStyles, normCoords, idOpenDispatch, positionStylesDispatch, setNormCoords
 */
const useContextMenuStates = ({
  configs,
  positionConfigs,
  commonConfig,
}: UseContextMenuStatesArgs): UseContextMenuStatesReturns => {
  // 初期状態をメモ化
  const idOpenInit = useMemo<IdOpenMap>(() => {
    return Object.fromEntries(configs.map(({ id, open }) => [id, orDefault(commonConfig).open(open)])) as IdOpenMap
  }, [configs, commonConfig])

  const [idOpenMap, idOpenDispatch] = useReducer(idOpenReducer, idOpenInit)

  // PositionStyle: 最終的な絶対座標を CSSProperties で保持
  const defaultPos: PositionStyle = {
    top: 0,
    left: 0,
    right: 'auto',
    bottom: 'auto',
    transform: 'none',
  }
  const positionStylesInit: PositionStyles = Object.fromEntries(
    Object.keys(positionConfigs).map((id) => [id, defaultPos])
  ) as PositionStyles
  const [positionStyles, positionStylesDispatch] = useReducer(positionStylesReducer, positionStylesInit)

  // normCoords: clickModeで使用、window、または anchorRef 要素内での正規化座標（0 ~ 1 の座標）を保持
  // 開くごとに更新し、リサイズで保存させるべき値
  const [normCoords, setNormCoords] = useState<Record<string, Coordinate>>({})

  return {
    idOpenMap,
    positionStyles,
    normCoords,
    idOpenDispatch,
    positionStylesDispatch,
    setNormCoords,
  }
}

export default useContextMenuStates
