import { RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { debounce } from '../utils/debounce'
import { v4 as uuidv4 } from 'uuid'

export function useResizeObservers<Id extends string, R>(
  refs: Record<Id, RefObject<HTMLElement | null>>,
  callback: (el: HTMLElement) => R, // 矩形情報を返すコールバック
  delay = 50
): Record<Id, R> {
  const ids = useMemo(() => Object.keys(refs) as Id[], [refs])

  // 矩形情報を格納するためのstate
  const [rects, setRects] = useState<Record<Id, R>>(
    ids.reduce(
      (acc, id) => {
        acc[id] = undefined as R
        return acc
      },
      {} as Record<Id, R>
    )
  )

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
      return
    }

    // ── 初回だけは即時に反映 ──
    const initialState: Record<Id, R> = ids.reduce(
      (acc, id) => {
        const el = refs[id].current
        if (el) acc[id] = callback(el)
        return acc
      },
      {} as Record<Id, R>
    )
    setRects(initialState)

    // ── 以降の変化はデバウンス付きで dispatch ──
    const observers = {} as Record<Id, ResizeObserver>
    const debounceCancelers: Partial<Record<Id, () => void>> = {}
    ids.forEach((id) => {
      const el = refs[id].current
      if (!el) return

      const onResize = debounce((value: R) => {
        setRects((prev) => ({ ...prev, [id]: value }))
      }, delay)
      debounceCancelers[id] = onResize.cancel

      const observer = new ResizeObserver(([entry]) => {
        if (entry.target instanceof HTMLElement) {
          onResize(callback(entry.target))
        }
      })
      observer.observe(el)
      observers[id] = observer
    })

    return () => {
      // Object.values()の返り値、
      // つまり、forEachのコールバックの引数は、型が不明になるためアサーションせざるを得ない
      Object.values(observers).forEach((observer) => (observer as ResizeObserver).disconnect())
      Object.values(debounceCancelers).forEach((cancel) => (cancel as () => void)())
    }
  }, [ids, delay])

  return rects
}

// 単一の要素を監視するためのカスタムフック
export const useResizeObserver = <R>(
  ref: RefObject<HTMLElement | null>,
  callback: (el: HTMLElement) => R,
  delay = 50
): R => {
  // useRef で一度だけキーを生成
  const idRef = useRef(`resize-${uuidv4()}`)
  const rects = useResizeObservers({ [idRef.current]: ref }, callback, delay)
  return rects[idRef.current]
}
