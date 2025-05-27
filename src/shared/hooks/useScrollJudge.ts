import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

/** モニタリング対象としきい値を指定するオプション */
interface ScrollJudgeOptions {
  /** X 方向の移動で判定するか */
  watchX?: boolean
  /** Y 方向の移動で判定するか */
  watchY?: boolean
  /** X 方向のしきい値（px） */
  thresholdX?: number
  /** Y 方向のしきい値（px） */
  thresholdY?: number
}

/**
 * タッチ操作時の移動量監視フック
 * @param ref 対象要素の ref
 * @param options 監視する軸としきい値
 * @returns isScrollingRef.current が true のときは「指定軸での移動中」と判断できる
 */
const useScrollJudge = (
  ref: RefObject<HTMLElement | null>,
  { watchX = false, watchY = true, thresholdX = 5, thresholdY = 5 }: ScrollJudgeOptions = {}
) => {
  // 移動中フラグ
  const isScrollingRef = useRef(false)
  // タッチ開始時の座標
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      if (watchX) touchStartXRef.current = e.touches[0].clientX
      if (watchY) touchStartYRef.current = e.touches[0].clientY
      isScrollingRef.current = false
    }
    const onTouchMove = (e: TouchEvent) => {
      let dx = 0,
        dy = 0
      if (watchX) dx = Math.abs(e.touches[0].clientX - touchStartXRef.current)
      if (watchY) dy = Math.abs(e.touches[0].clientY - touchStartYRef.current)
      // いずれかの軸でしきい値超えなら移動中と判断
      if ((watchX && dx > thresholdX) || (watchY && dy > thresholdY)) {
        isScrollingRef.current = true
      }
    }
    const onTouchEnd = () => {
      // 少し遅延させてフラグリセット
      setTimeout(() => (isScrollingRef.current = false), 50)
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [ref, watchX, watchY, thresholdX, thresholdY])

  return isScrollingRef
}

export default useScrollJudge
