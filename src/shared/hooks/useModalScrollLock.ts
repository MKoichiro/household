import { useCallback, useEffect, useState } from 'react'
import { debounce } from '../utils/debounce'

/**
 * モーダル展開時に背景のスクロールを抑制するカスタムフック
 * css で body に overflow: hidden を付与することも考えられるが、ページトップにスクロールバックされるため js で制御
 * @param isOpen モーダルが開いているかどうか
 * @returns overflowableRef をセットするための関数
 */
export const useModalScrollLock = (isOpen: boolean) => {
  // 依存配列に含めるため、useState で管理
  const [overflowable, setOverflowable] = useState<HTMLElement | null>(null)
  // HTMLElement を許容するために callback で配布
  const setOverflowableRef = useCallback((el: HTMLElement | null) => setOverflowable(el), [])
  // add, remove 間で参照安定化のためにメモ化
  const prevent = useCallback((e: Event) => e.preventDefault(), [])
  const revive = useCallback((e: Event) => e.stopPropagation(), [])

  useEffect(() => {
    const adminEvents = () => {
      // 全解除
      window.removeEventListener('touchmove', prevent)
      window.removeEventListener('wheel', prevent)
      if (overflowable) {
        overflowable.removeEventListener('touchmove', revive)
        overflowable.removeEventListener('wheel', revive)
      }

      // overflowable: これが存在していればモーダルがマウントされている。isOpen: モーダルが開いている。
      if (isOpen && overflowable) {
        // 背景 のスクロール禁止
        window.addEventListener('touchmove', prevent, { passive: false })
        window.addEventListener('wheel', prevent, { passive: false })

        // overflowable にオーバーフローがあればスクロール受付を復活
        if (overflowable.scrollHeight > overflowable.clientHeight) {
          overflowable.addEventListener('touchmove', revive, { passive: false })
          overflowable.addEventListener('wheel', revive, { passive: false })
        }
      }
    }

    // 初回実行
    adminEvents()

    // windowとoverflowable のリサイズ時に再実行
    const debounced = debounce(adminEvents, 50)
    const ro = new ResizeObserver(debounced)
    window.addEventListener('resize', debounced)
    if (overflowable) ro.observe(overflowable)

    return () => {
      window.removeEventListener('resize', debounced)
      window.removeEventListener('touchmove', prevent)
      window.removeEventListener('wheel', prevent)
      if (overflowable) {
        overflowable.removeEventListener('touchmove', prevent)
        overflowable.removeEventListener('wheel', prevent)
      }
      ro.disconnect()
    }
    // prevent, revive は安定化しているうえ、これらの変動で再実行する必要はないため
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, overflowable])

  return {
    /** オーバーフローを起こし、スクロール可能な状態になりうる要素の ref をセットする ref callback */
    setOverflowableRef,
  }
}
