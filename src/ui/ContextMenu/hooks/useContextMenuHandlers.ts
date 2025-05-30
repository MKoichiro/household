import type { MouseEventHandler, MouseEvent } from 'react'
import { useCallback } from 'react'

import type {
  Coordinate,
  PositionStyle,
  UseContextMenuHandlersArgs,
  UseContextMenuHandlersReturns,
} from '@ui/ContextMenu/types'
import { withFalsyGuard } from '@shared/utils/withFalsyGuard'

/**
 * @internal
 * コンテキストメニューの位置を決定するためのハンドラをまとめたフック。
 *
 * @param positionConfigs - 各コンテキストメニューの位置設定
 * @param anchorsRef - 各コンテキストメニューのアンカー要素の ref
 * @param positionStylesDispatch - 位置スタイルを更新するためのディスパッチャー
 * @param setNormCoords - 正規化された座標を更新するための関数
 * @param idOpenDispatch - コンテキストメニューの開閉状態を更新するためのディスパッチャー
 * @returns 各種ハンドラと位置計算関数
 */
const useContextMenuHandlers = ({
  positionConfigs: configs,
  anchorsRef,
  positionStylesDispatch,
  setNormCoords,
  idOpenDispatch,
}: UseContextMenuHandlersArgs): UseContextMenuHandlersReturns => {
  // 各メインモードに対応するディスパッチャー（デバッグ処理付き）
  const dispatchCustomPosition = (id: string) => {
    withFalsyGuard<PositionStyle, void>({
      checkFalsy: { customPos: configs[id].customPos }, // customPos が falsy なら警告して早期リターン
      orDo: (customPos) => positionStylesDispatch({ id, type: 'CUSTOM', customPos }), // truthy が確認できたら dispatch
    })
  }
  const dispatchClickPosition = (id: string, normCoord: Coordinate) => {
    if (configs[id].mode.main !== 'clicked') {
      if (import.meta.env.MODE !== 'production') {
        console.warn('normCoord is undefined or mode is not clicked, but dispatchClickPosition is called')
      }
      return
    }
    const {
      offset,
      cursorRelativity,
      mode: { sub: clickMode },
    } = configs[id]
    const anchorRect = anchorsRef.current[id]?.getBoundingClientRect()
    positionStylesDispatch({ id, type: 'CLICK', normCoord, offset, cursorRelativity, clickMode, anchorRect })
  }
  const dispatchAnchorPosition = (id: string) => {
    const { offset, anchorRelativity } = configs[id]
    withFalsyGuard<DOMRect, void>({
      checkFalsy: { anchorRect: anchorsRef.current[id]?.getBoundingClientRect() },
      orDo: (anchorRect) => {
        positionStylesDispatch({ id, type: 'ANCHOR', offset, anchorRelativity, anchorRect })
      },
    })
  }

  // モードに応じて位置を決定する関数を返す
  const applyPosition = (id: string): MouseEventHandler<unknown> => {
    const { main: mode } = configs[id].mode
    switch (mode) {
      case 'custom':
        return (_e) => dispatchCustomPosition(id)
      case 'clicked':
        switch (configs[id].mode.sub) {
          case 'anchor':
            return (e) => {
              if (configs[id].mode.main !== 'clicked') return
              const anchorRect = anchorsRef.current[id]?.getBoundingClientRect()
              if (!anchorRect) return
              const normCoord = {
                y: (e.clientY - anchorRect.top) / anchorRect.height,
                x: (e.clientX - anchorRect.left) / anchorRect.width,
              }
              dispatchClickPosition(id, normCoord)
              setNormCoords((prev) => ({ ...prev, [id]: normCoord }))
            }
          case 'window':
          case 'document':
            return (e) => {
              if (configs[id].mode.main !== 'clicked') return
              const normCoord = {
                y: (e.pageY - window.scrollY) / window.innerHeight,
                x: (e.pageX - window.scrollX) / window.innerWidth,
              }
              dispatchClickPosition(id, normCoord)
              setNormCoords((prev) => ({ ...prev, [id]: normCoord }))
            }
          default:
            throw new Error('Invalid clicked mode')
        }
      case 'anchor':
        return (_e) => dispatchAnchorPosition(id)
      default:
        throw new Error('Invalid mode')
    }
  }

  // 配布するイベントハンドラ、参照安定かのためメモ化。
  /** 1. 単純に開く */
  const handleOpen = useCallback(
    (id: string) => (e: MouseEvent<unknown>) => {
      idOpenDispatch({ type: 'OPEN', id })
      applyPosition(id)(e) // 位置計算は applyPosition に任せる
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  /** 2. 単純に閉じる */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClose = useCallback((id: string) => () => idOpenDispatch({ type: 'CLOSE', id }), [])
  /** 3. 全て閉じる */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCloseAll = useCallback(() => idOpenDispatch({ type: 'CLOSE_ALL' }), [])
  /** 4. 他を閉じて開く */
  const controlledOpen = useCallback(
    (id: string) => (e: MouseEvent<unknown>) => {
      idOpenDispatch({ type: 'CONTROLLED_OPEN', id })
      applyPosition(id)(e)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  /** 5. トグル */
  const handleToggle = useCallback(
    (id: string) => (e: MouseEvent<unknown>) => {
      idOpenDispatch({ type: 'TOGGLE', id })
      applyPosition(id)(e)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  /** 6. 他を閉じてトグル */
  const controlledToggle = useCallback(
    (id: string) => (e: MouseEvent<unknown>) => {
      idOpenDispatch({ type: 'CONTROLLED_TOGGLE', id })
      applyPosition(id)(e)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return {
    dispatchClickPosition,
    dispatchAnchorPosition,
    handleOpen,
    handleClose,
    handleCloseAll,
    controlledOpen,
    handleToggle,
    controlledToggle,
  }
}

export default useContextMenuHandlers
