// テキストが親要素からはみ出す場合のみに、電光掲示板のように文字を流す汎用コンポーネント
// スタート、一時停止、前回停止位置からのリスタート、初期位置へのリセットに対応
// 再レンダリング頻度は低め（アニメーション中は発生しない）なので現状メモ化はしていない。

import { CSSProperties, MouseEvent, useEffect, useRef, useState } from 'react'
import { useResizeObserver } from '../../shared/hooks/useResizeObserver'
import { motion, useMotionValue, useAnimationFrame, animate } from 'framer-motion'
import styled from '@emotion/styled'
import { alpha, css } from '@mui/material'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import { indigo, purple } from '@mui/material/colors'
import { headerNewsHeight } from '../../shared/constants/ui'

type TriggerType = 'hover' | 'click'

interface FlowingTextProps {
  textContent: string // 現状プレーンテキストのみ想定
  animeDuration?: number // アニメーション再生時間、pxPerSec より優先
  pxPerSec?: number // アニメーション再生速度 [px/s]
  // 両方指定した場合、速い条件が優先
  autoEnd?: {
    loop?: number // ループ回数による自動終了
    timer?: number // 再生時間 [s] による自動終了
  }
  initializeDuration?: number // 初期位置に戻るタイミングで再生されるアニメーションの duration [ms]
  spacerWidth?: number // 追従するコピー要素との隙間
  styleWithFixedWidth: CSSProperties // 固定幅は必須だが、設定方法は任意に受け付ける
  trigger?: TriggerType // アニメーション再生のトリガー
  flowAfter?: number // trigger = 'hover' 選択時のみ有効。 mouseEnter -> mouseLeave を間引ける
  onStart?: () => void // start() 実行時の追加処理を受け付ける。以下 2 つも同様。
  onStop?: () => void
  onReset?: () => void
}

const FlowingText = ({
  textContent,
  animeDuration,
  pxPerSec = 100,
  autoEnd,
  initializeDuration = 500,
  spacerWidth = 32,
  styleWithFixedWidth,
  trigger = 'click',
  flowAfter,
  onStart,
  onStop,
  onReset,
}: FlowingTextProps) => {
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
    if (autoEnd?.timer) {
      autoEndTimerRef.current = setTimeout(reset, autoEnd?.timer * 1000)
    }
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
    // NOTE: PC版ではhoverとクリックが同居しても問題なさそうだし、便利そう
    // 場合によってはガードを外す。
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
  const createMouseLeave = (trigger: TriggerType) => (trigger !== 'hover' ? undefined : stop)

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

  return (
    <FlowingTextRoot
      className="flowing-text-root"
      $isOverflow={isOverflow}
      style={{ ...styleWithFixedWidth }}
      onClick={createClick(trigger)}
      onMouseEnter={createMouseEnter(trigger)}
      onMouseLeave={createMouseLeave(trigger)}
    >
      <ResetButton
        className="flowing-text-reset-btn"
        type="button"
        aria-label="リセットボタン"
        $show={isDirty}
        onClick={handleReset}
      >
        <FirstPageIcon />
      </ResetButton>

      {/* 実際に動く要素 */}
      <FlowingTextContainer
        className="flowing-text-container"
        ref={containerWidthRef}
        $spacerWidth={spacerWidth}
        style={{ x }}
      >
        {/* 「オリジナル」 */}
        <FlowingTextOriginal className="flowing-text original" $isOverflow={isOverflow} $isDirty={isDirty}>
          {textContent}
        </FlowingTextOriginal>
        {/* 「コピー」: 全体が空白になるタイミングが無いように、スペーサー ＋ コピーを追従させる */}
        {isDirty && <FlowingTextCopy className="flowing-text copy">{textContent}</FlowingTextCopy>}
      </FlowingTextContainer>

      {/* 「ダミー」: width 計測用 */}
      <FlowingTextDummy className="flowing-text dummy" ref={dummyWidthRef}>
        {textContent}
      </FlowingTextDummy>
    </FlowingTextRoot>
  )
}

export default FlowingText

const FlowingTextRoot = styled.div<{ $isOverflow: boolean }>`
  overflow: hidden;
  position: relative; // リセットボタンとダミーのオフセット
  cursor: ${({ $isOverflow }) => ($isOverflow ? 'pointer' : 'auto')};
  pointer-events: ${({ $isOverflow }) => ($isOverflow ? 'auto' : 'none')};
`

const ResetButton = styled.button<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  border: none;
  cursor: pointer;
  width: ${headerNewsHeight}px;
  height: 100%;
  background: ${alpha(purple[900], 0.5)};
  color: ${indigo[900]};

  svg {
    display: block;
    width: inherit;
    height: inherit;
  }
`

// スペーサーを提供
const StyledFlowingTextContainer = styled.div<{ $spacerWidth: number }>`
  display: flex;
  margin: 0;
  padding: 0;
  gap: ${({ $spacerWidth }) => `${$spacerWidth}px`};
`
const FlowingTextContainer = motion.create(StyledFlowingTextContainer)

// オリジナル/コピー/ダミー 共通スタイル
const flowingTextCommon = css`
  padding: 0;
  margin: 0;
`
// 初期位置用、折り返し省略を表示
const ellipsis = css`
  // 親のコンテナ要素を限界幅として省略
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
`
// x 座標がノンゼロの時のスタイル
const clip = css`
  overflow: visible;
  text-overflow: clip;
  flex-shrink: 0;
`

const FlowingTextOriginal = styled.span<{ $isOverflow: boolean; $isDirty: boolean }>`
  ${flowingTextCommon}
  ${({ $isOverflow, $isDirty }) => {
    if ($isDirty) return clip
    if ($isOverflow) return ellipsis
    return ''
  }}
`
const FlowingTextCopy = styled.span`
  ${flowingTextCommon}
  ${clip}
`

const FlowingTextDummy = styled.span`
  ${flowingTextCommon}
  position: absolute;
  display: block;
  width: auto;
  white-space: nowrap;
  visibility: hidden;

  /* デバッグ用 */
  /* visibility: visible;
  background: pink;
  top: 96px; */
`
