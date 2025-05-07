import { RefObject, useLayoutEffect, useMemo, useRef } from 'react'
import { debounce } from '../utils/debounce'

type ResizeEffectOptions = {
  /** デフォルト 50ms */
  delay?: number
}

type Target<T> = RefObject<T | null> | ((el?: T) => T | null)

/**
 * 複数の RefObject を受け取り、
 * それぞれの要素がリサイズされるたびに onResize(el, id) を呼び出します。
 */
export function useResizeEffects<Id extends string>(
  targets: Record<Id, Target<HTMLElement>>,
  onResize: (el: HTMLElement, id: Id) => void,
  options?: ResizeEffectOptions
): void {
  const { delay = 50 } = options || {}

  // refs のキー一覧をソートして文字列化 → 変化を検知
  const keyString = useMemo(() => Object.keys(targets).sort().join(','), [targets])
  const ids = useMemo(() => keyString.split(',') as Id[], [keyString])

  // 最新のコールバックを参照できるよう Ref に保持
  const callbackRef = useRef(onResize)
  useLayoutEffect(() => {
    callbackRef.current = onResize
  }, [onResize])

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return

    const observers: Partial<Record<Id, ResizeObserver>> = {}
    const cancelers: Partial<Record<Id, () => void>> = {}

    ids.forEach((id) => {
      // const el = refs[id]?.current
      const el = typeof targets[id] === 'function' ? targets[id]() : targets[id].current
      if (!el) return

      // デバウンス付きハンドラ
      const debounced = debounce((target: HTMLElement) => {
        callbackRef.current(target, id)
      }, delay)
      cancelers[id] = debounced.cancel

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target instanceof HTMLElement) {
            debounced(entry.target)
          }
        }
      })
      observer.observe(el)
      observers[id] = observer
    })

    return () => {
      // クリーンアップ
      Object.values(observers).forEach((observer) => (observer as ResizeObserver).disconnect())
      Object.values(cancelers).forEach((cancel) => (cancel as () => void)())
    }
    // refs[id]?.current の変化も検知する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    keyString,
    delay,
    ...ids.map((id) => {
      const target = targets[id]
      return typeof target === 'function' ? target() : target.current
    }),
  ])
}

/**
 * 単一要素用のラッパー。
 * 内部で useResizeEffects を呼び出します。
 */
export function useResizeEffect<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onResize: (el: T) => void,
  options?: ResizeEffectOptions
): void {
  useResizeEffects(
    { single: ref } as Record<'single', RefObject<T | null>>,
    (el) => {
      onResize(el as T)
    },
    options
  )
}
