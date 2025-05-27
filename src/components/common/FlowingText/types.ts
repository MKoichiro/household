import type { MotionValue } from 'framer-motion'
import type { CSSProperties, MouseEvent, RefObject } from 'react'

export type TriggerType = 'hover' | 'click'

/**
 * FlowingText コンポーネントの props
 * useFlowingText の返り値を register で受けて、{...register} で展開して渡せば良い。
 */
export type FlowingTextProps = UseFlowingTextReturn

/**
 * 専用フックの引数、オプショナルを許容
 */
export interface UseFlowingTextArg {
  /** 現状プレーンテキストのみ想定 */
  textContent: string
  /** 固定幅は必須だが、設定方法は任意に受け付ける */
  styleWithFixedWidth: CSSProperties
  /** アニメーションの再生時間、pxPerSec より優先 */
  animeDuration?: number
  /** アニメーションの再生速度 [px/s] */
  pxPerSec?: number
  /** 終了条件。なければ無限に再生。両方指定した場合、速い条件が優先 */
  autoEnd?: {
    /** ループ回数による自動終了 */
    loop?: number
    /** 再生時間 [s] による自動終了 */
    timer?: number
  }
  /** 初期位置に戻るタイミングで再生されるアニメーションの duration [ms] */
  initializeDuration?: number
  /** 追従するコピー要素との隙間 [px] */
  spacerWidth?: number
  /** アニメーション再生のトリガー */
  trigger?: TriggerType
  /** trigger = 'hover' 選択時のみ有効。 mouseEnter -> mouseLeave を間引ける */
  flowAfter?: number
  /** リセットボタンの位置 */
  resetButton?: 'left' | 'right'
  /** start() 実行時の追加処理を受け付ける */
  onStart?: () => void
  /** stop() 実行時の追加処理を受け付ける */
  onStop?: () => void
  /** reset() 実行時の追加処理を受け付ける */
  onReset?: () => void
}

/**
 * @internal
 * 専用フックの戻り値、非オプショナルで返す
 */
export interface UseFlowingTextReturn {
  textContent: string
  styleWithFixedWidth: CSSProperties
  isDirty: boolean
  x: MotionValue<number>
  containerWidthRef: RefObject<HTMLDivElement | null>
  dummyWidthRef: RefObject<HTMLElement | null>
  isOverflow: boolean
  spacerWidth: number
  resetButton?: 'left' | 'right'
  handleReset: (e: MouseEvent<HTMLElement>) => void
  handleClick: (() => void) | undefined
  handleMouseEnter: (() => void) | undefined
  handleMouseLeave: (() => void) | undefined
}
