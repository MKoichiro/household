import { useMotionValue, useAnimationFrame, animate } from 'framer-motion'
import type { MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useResizeObserver } from '@shared/hooks/useResizeObserver'

import { defaults } from './constants'
import type { TriggerType, UseFlowingTextArg, UseFlowingTextReturn } from './types'

const useFlowingText = ({
  animeDuration,
  pxPerSec = defaults.pxPerSec,
  autoEnd,
  initializeDuration = defaults.initializeDuration,
  spacerWidth = defaults.spacerWidth,
  trigger = defaults.trigger,
  flowAfter,
  onStart,
  onStop,
  onReset,
  ...rest
}: UseFlowingTextArg): UseFlowingTextReturn => {
  // FlowingText の状態を管理するカスタムフック
  const [isFlowing, setIsFlowing] = useState(false) // アニメーション再生中か停止中か
  const [isDirty, setIsDirty] = useState(false) // x 座標が 0 かどうか
  const x = useMotionValue(0)
  const dummyWidthRef = useRef<HTMLElement>(null)
  const containerWidthRef = useRef<HTMLDivElement>(null)

  const flowAfterTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const autoEndTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const autoEndCounterRef = useRef<number>(0)
  const cleanup = () => {
    autoEndCounterRef.current = 0
    clearTimeout(flowAfterTimerRef.current!)
    clearTimeout(autoEndTimerRef.current!)
  }

  // 要素のリサイズの度に各種 width を更新
  // NOTE: 返り値（containerWidth など）は、useResizeObserver 内部でステート管理されている
  const containerWidth = useResizeObserver(containerWidthRef, (e) => e.clientWidth, { initialValue: 0, delay: 50 })
  const { singleWidth, distanceToMove } = useResizeObserver(
    dummyWidthRef,
    (e) => {
      const singleWidth = e.scrollWidth
      const distanceToMove = e.scrollWidth + spacerWidth // 1 周期分の移動距離
      return { singleWidth, distanceToMove }
    },
    { initialValue: { singleWidth: 0, distanceToMove: 0 }, delay: 50 }
  )

  // オーバーフロー判定
  const isOverflow = singleWidth > containerWidth

  // ループアニメーションの定義
  useAnimationFrame((_, delta) => {
    if (!isFlowing || !isOverflow) return
    let next: number
    const speed = animeDuration ? distanceToMove / animeDuration : pxPerSec // pxPerSec より animeDuration を優先して速度 [px/s] を決定
    const deltaSec = delta / 1000 // ms → s 変換
    next = x.get() - speed * deltaSec // 速度分だけ進める
    // 末尾到達時
    if (next <= -distanceToMove) {
      next = 0 // x 初期化

      // 自動終了処理: "loop"
      autoEndCounterRef.current++
      // 指定回数に到達したらステート初期化、（x 座標リセットは共通処理。）
      if (autoEnd?.loop && autoEndCounterRef.current >= autoEnd.loop) {
        reset(false)
      }
    }

    x.set(next)
  })

  // 再生・一時停止・初期化ヘルパー
  const reset = (playAnime: boolean = true) => {
    onReset?.()
    setIsFlowing(false)
    setIsDirty(false)

    // リセットアニメーションを定義 & 再生
    if (playAnime) animate(x, 0, { duration: initializeDuration / 1000 })

    cleanup()
  }
  const start = () => {
    onStart?.()
    setIsFlowing(true)
    setIsDirty(true)

    // 自動終了処理: "timer"
    if (autoEnd?.timer) autoEndTimerRef.current = setTimeout(reset, autoEnd?.timer * 1000)
  }
  const stop = () => {
    onStop?.()
    if (x.get() !== 0) {
      setIsDirty(true)
    } else {
      // リセットボタンを押した後の mouseLeave で呼ばれる場合
      setIsDirty(false)
    }
    setIsFlowing(false)
  }

  // ハンドラー、またはハンドラー生成関数
  // Click, trigger が異なる場合にはバインドすらしないようにカリー化
  const createClick = (trigger: TriggerType) => {
    if (trigger !== 'click') return undefined
    return () => {
      if (isFlowing) {
        stop()
      } else {
        start()
      }
    }
  }
  // Hover, trigger が異なる場合にはバインドすらしないようにカリー化
  const createMouseEnter = (trigger: TriggerType) => {
    if (trigger !== 'hover') return undefined
    return () => {
      if (flowAfter) {
        flowAfterTimerRef.current = setTimeout(start, flowAfter)
      } else {
        start()
      }
    }
  }
  const createMouseLeave = (trigger: TriggerType) => {
    if (trigger !== 'hover') return undefined
    return () => {
      stop()
      // NOTE: 遅延スタートが未遂ならキャンセル
      // flowAfter が未遂の場合、stop() した後に、遅延スタートが走り結局 start() してしまうので、タイマーもクリアする
      clearTimeout(flowAfterTimerRef.current!)
    }
  }

  // Reset
  const handleReset = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation() // Root 要素の Click に埋もれるのを回避
    reset()
  }

  // アンマウント時
  useEffect(() => {
    return () => {
      x.stop()
      cleanup()
    }
  }, [x])

  return {
    ...rest,
    isDirty,
    x,
    containerWidthRef,
    dummyWidthRef,
    isOverflow,
    spacerWidth,
    handleReset,
    handleClick: createClick(trigger),
    handleMouseEnter: createMouseEnter(trigger),
    handleMouseLeave: createMouseLeave(trigger),
  }
}

export default useFlowingText
