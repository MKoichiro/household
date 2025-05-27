import { useCallback, useEffect, useState } from 'react'

import { debounce } from '@shared/utils/debounce'

/**
 * モーダル展開時に背景のスクロールを抑制するカスタムフック
 * css で body に overflow: hidden を付与することも考えられるが、ページトップにスクロールバックされるため js で制御
 * @param isOpen モーダルが開いているかどうか
 * @returns overflowableRef, modalBackDrop をセットするための関数
 */
export const useModalScrollLock = (isOpen: boolean) => {
  // 依存配列に含めるため、useState で管理
  const [overflowable, setOverflowable] = useState<HTMLElement | null>(null)
  const [modalBackDrop, setModalBackdrop] = useState<HTMLElement | null>(null)
  // HTMLElement を許容するために callback で配布
  const setOverflowableRef = useCallback((el: HTMLElement | null) => setOverflowable(el), [])
  const setModalBackdropRef = useCallback((el: HTMLElement | null) => setModalBackdrop(el), [])
  // add, remove 間で参照安定化のためにメモ化
  const prevent = useCallback((e: Event) => e.preventDefault(), [])
  const revive = useCallback((e: Event) => e.stopPropagation(), [])

  useEffect(() => {
    const adminEvents = () => {
      // 全解除
      if (modalBackDrop) {
        modalBackDrop.removeEventListener('touchmove', prevent)
        modalBackDrop.removeEventListener('wheel', prevent)
      }
      if (overflowable) {
        overflowable.removeEventListener('touchmove', revive)
        overflowable.removeEventListener('wheel', revive)
        overflowable.removeEventListener('touchmove', prevent)
        overflowable.removeEventListener('wheel', prevent)
      }

      // overflowable: これが存在していればモーダルがマウントされている。isOpen: モーダルが開いている。
      if (isOpen && overflowable) {
        // 背景 のスクロール禁止
        if (modalBackDrop) {
          modalBackDrop.addEventListener('touchmove', prevent, { passive: false })
          modalBackDrop.addEventListener('wheel', prevent, { passive: false })
        }

        if (overflowable.scrollHeight > overflowable.clientHeight) {
          // overflowable にオーバーフローがあればスクロール受付を復活
          overflowable.addEventListener('touchmove', revive, { passive: false })
          overflowable.addEventListener('wheel', revive, { passive: false })
        } else {
          // overflowable にオーバーフローがなければスクロール禁止
          overflowable.addEventListener('touchmove', prevent, { passive: false })
          overflowable.addEventListener('wheel', prevent, { passive: false })
        }
      }
    }

    // 初回実行
    adminEvents()

    // window と overflowable のリサイズ時にオーバーフロー判定が変化し得るので再実行
    const debounced = debounce(adminEvents, 50)
    const ro = new ResizeObserver(debounced)
    window.addEventListener('resize', debounced)
    if (overflowable) ro.observe(overflowable)

    return () => {
      window.removeEventListener('resize', debounced)
      if (modalBackDrop) {
        modalBackDrop.removeEventListener('touchmove', prevent)
        modalBackDrop.removeEventListener('wheel', prevent)
      }
      if (overflowable) {
        overflowable.removeEventListener('touchmove', prevent)
        overflowable.removeEventListener('wheel', prevent)
        overflowable.removeEventListener('touchmove', revive)
        overflowable.removeEventListener('wheel', revive)
      }
      ro.disconnect()
    }
    // prevent, revive は安定化しているうえ、これらの変動で再実行する必要はないため
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, overflowable, modalBackDrop])

  return {
    /** オーバーフローを起こし、スクロール可能な状態になりうる要素の ref をセットする ref callback */
    setOverflowableRef,
    /** モーダルの背景要素の ref をセットする ref callback */
    setModalBackdropRef,
  }
}
