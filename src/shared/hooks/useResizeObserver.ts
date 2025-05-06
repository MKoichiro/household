import { RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { debounce } from '../utils/debounce'
import { v4 as uuidv4 } from 'uuid'

// DOM要素のrefとその要素に対する任意のコールバックを受け取り、
// その返り値をstateとして保持するカスタムフック

// Objectオブジェクトのメソッドの返り値は、型が不明になるため適宜アサーションしている

// ステート管理せずに、副作用のみをコールバックで扱うことも可能だが、その場合不要なステート管理を行うことになるため、
// このカスタムフックを使用するのはもはやミニマムな実装ではなくなる。

type OptionsType<Id extends string, R> = {
  delay?: number
  // initialValues: Record<Id, R>
  initialValues?: Partial<Record<Id, R>>
}

export function useResizeObservers<Id extends string, R>(
  refs: Record<Id, RefObject<HTMLElement | null>>,
  callback: (el: HTMLElement) => R = (el) => el.getBoundingClientRect() as R, // 何らかの矩形情報を返す関数。あくまで例。基本的には用途を絞り上書きして使用すること。
  options: OptionsType<Id, R> = {}
): Record<Id, R> {
  const { delay = 50, initialValues } = options

  // refs のキー一覧をソートして文字列化。変化のLayoutEffectのトリガー。
  const keyString = Object.keys(refs).sort().join(',')

  // keyString から id 配列を再生成
  const ids = useMemo(() => keyString.split(',') as Id[], [keyString])

  // 依存配列の代替手段。onResizeで最新のコールバックの参照を保証
  const callbackRef = useRef(callback)
  useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // 矩形情報を格納するためのstate
  // const [rects, setRects] = useState<Record<Id, R>>(
  //   ids.reduce(
  //     (acc, id) => {
  //       acc[id] = initialValues[id]
  //       return acc
  //     },
  //     {} as Record<Id, R>
  //   )
  // )
  const [rects, setRects] = useState<Record<Id, R>>(() => {
    const initial: Partial<Record<Id, R>> = {}
    ids.forEach((id) => {
      if (initialValues?.[id] !== undefined) {
        // 初期値が渡されていればそれを使う
        initial[id] = initialValues[id]!
      } else {
        // なければコールバックの結果で補完
        const el = refs[id]?.current
        if (el) {
          initial[id] = callback(el)
        }
      }
    })
    return initial as Record<Id, R>
  })

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return

    // ── デバウンス付きで dispatch ──
    const observers = {} as Record<Id, ResizeObserver>
    const debounceCancelers: Partial<Record<Id, () => void>> = {}
    ids.forEach((id) => {
      const el = refs[id]?.current
      if (!el) return

      // 更新処理
      const dispatch = (value: R) => {
        // 「非プリミティブ型でもディープに比較し、変更が無ければ早期リターン」
        // という処置は考慮すべきだが、比較コストとsetRectsのコスト比較も必要なので、現状あえて比較は行わない。
        setRects((prev) => ({ ...prev, [id]: value }))
      }

      // 初回とマウント時は手動で更新
      const initial = callbackRef.current(el)
      dispatch(initial)

      // 初回またはマウント以降は、リサイズ時に更新
      const onResize = debounce(dispatch, delay)
      const observer = new ResizeObserver(([entry]) => {
        if (entry.target instanceof HTMLElement) onResize(callbackRef.current(entry.target))
      })
      observer.observe(el)

      // クリーンアップ用オブジェクトにプッシュ
      debounceCancelers[id] = onResize.cancel
      observers[id] = observer
    })

    return () => {
      Object.values(observers).forEach((observer) => (observer as ResizeObserver).disconnect())
      Object.values(debounceCancelers).forEach((cancel) => (cancel as () => void)())
    }

    // ids, refsの変化は、keyStringの変化に集約される
    // callbackは無限ループとなるため、最新のコールバックは依存配列ではなくrefで管理済み。
    // また、refsをフラット化して依存させることで、初回実行時に未マウントであってもマウント後に、確実に再実行できる
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyString, delay, ...ids.map((id) => refs[id]?.current)])

  return rects
}

// 単一の要素を監視するためのカスタムフック
export const useResizeObserver = <R>(
  ref: RefObject<HTMLElement | null>,
  callback: (el: HTMLElement) => R = (el) => el.getBoundingClientRect() as R,
  options: { delay?: number; initialValue?: R } = {}
): R => {
  // 一意なIDを生成
  const id = useRef(`resize-${uuidv4()}`).current
  // 複数要素版フックを呼び出し
  const rects = useResizeObservers<typeof id, R>({ [id]: ref }, callback, {
    ...options,
    initialValues: { [id]: options.initialValue },
  })

  return rects[id]
}

// 使用例
// 1. 特定の要素のサイズをリサイズに関して動的に取得
//   const divRef = useRef<HTMLDivElement | null>(null)
//   const size = useResizeObserver(divRef, el => ({
//     width: el.offsetWidth,
//     height: el.offsetHeight,
//   }))

// 2. overflowの有無をリサイズに関して動的に取得
//   const divRef = useRef<HTMLDivElement | null>(null)
//   // コールバックは、通常のベストプラクティス通り、状況によってインラインで書くことはさけて、適宜メモ化すること。
//   const { isOverflow } = useResizeObserver(divRef, el => ({
//     isOverflow: el.scrollWidth > el.clientWidth,
//   }))
