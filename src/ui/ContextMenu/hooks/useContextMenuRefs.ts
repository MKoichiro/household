import type { RefObject } from '@fullcalendar/core/preact.js'
import { useCallback, useMemo, useRef } from 'react'

import type { UseContextMenuRefsArgs, UseContextMenuRefsReturns } from '@ui/ContextMenu/types'

/**
 * @internal
 * AnchorCallbacks と RootCallbacks の共通処理をまとめた関数。
 *
 * @param storeRef - anchorsRef または rootsRef の RefObject
 * @param ids - コンテキストメニューの ID の配列
 * @returns ref callback のオブジェクト
 */
const createRefCallbacks = <T extends HTMLElement | null>(storeRef: RefObject<Record<string, T>>, ids: string[]) => {
  return Object.fromEntries(
    ids.map((id) => [
      id,
      (el: T) => {
        // current は各 storeRef で、初期値 {} とする。null にならないので非 Null アサーション
        if (el) storeRef.current![id] = el
        else delete storeRef.current![id]
      },
    ])
  )
}

/**
 * @internal
 * コンテキストメニュー用の各種 Ref と callback Ref を生成・管理するフック。
 *
 * @param ids - コンテキストメニューの ID の配列
 * @param idKey - ids の一意性を保証するためのキー
 * @returns 各種 Ref と ref callback を含むオブジェクト
 */
const useContextMenuRefs = ({ ids, idKey }: UseContextMenuRefsArgs): UseContextMenuRefsReturns => {
  // 1. Anchor: コンテキストメニューの表示位置の基準となる要素
  // NOTE: 直接 ref を配布しようとすると、型の制約がきつく汎用性が落ちるので、ref callback によって一律で HTMLElement として扱う。
  // 現状 getBoundingClientRect()しか使わないため、HTMLElement で十分。
  // anchor 要素の性質上無いと思うが、例えば HTMLButtonElement 固有の el.disabled を使おうとすると問題になるので注意。
  const anchorsRef = useRef<Record<string, HTMLElement | null>>({})
  /* eslint-disable-next-line react-hooks/exhaustive-deps */ // idKeyで十分
  const anchorCallbacks = useMemo(() => createRefCallbacks(anchorsRef, ids), [idKey])

  // 2. root: コンテキストメニューのルート要素
  const rootsRef = useRef<Record<string, HTMLDivElement | null>>({})
  /* eslint-disable-next-line react-hooks/exhaustive-deps */ // idKeyで十分
  const rootCallbacks = useMemo(() => createRefCallbacks<HTMLDivElement | null>(rootsRef, ids), [idKey])

  // 3. click away 除外リスト
  const clickAwaySetRef = useRef<Set<HTMLElement>>(new Set())
  const clickAwayCallbacks = useCallback((el: HTMLElement | null) => {
    if (el) clickAwaySetRef.current.add(el)
  }, [])

  return {
    anchorsRef,
    anchorCallbacks,
    clickAwaySetRef,
    clickAwayCallbacks,
    rootsRef,
    rootCallbacks,
  }
}

export default useContextMenuRefs
