import { useEffect, useRef, useState } from 'react'

/**
 * useTimer フックの引数の型定義。
 */
type TimerType = {
  /** 初期カウント。デフォルトは 0。単位は delay に依存。 */
  init?: number
  /** カウントの方向、'increment' | 'decrement' */
  type?: 'increment' | 'decrement'
  /** カウントのステップ。デフォルトは 1。単位は delay に依存。 */
  step?: number
  /** カウントの更新間隔（ミリ秒）。デフォルトは 1000。 */
  delay?: number
  /** タイマーを終了する値。デフォルトは undefined */
  end?: number
  /** コンポーネントのライフサイクルをスタートとストップのトリガーにする指定。
   * マウント時にスタート、アンマウント時にuseTimerフック内ロジックによってクリーンアップ。 */
  startNow?: boolean
  /** カウントの更新時に呼び出されるコールバック関数。 */
  onCountUp?: (prevCount: number) => void
  /** カウントの更新時に呼び出されるコールバック関数。 */
  onCountDown?: (prevCount: number) => void
  /** タイマー終了時に呼び出されるコールバック関数。 */
  onEnd?: () => void
}

const useTimer = ({
  init = 0,
  step = 1,
  type = 'increment',
  delay = 1000,
  end = undefined,
  startNow = false,
  onCountUp,
  onCountDown,
  onEnd,
}: TimerType) => {
  // 0ステップと短すぎるdelayの場合にはエラーを投げる
  const isInValid = step === 0 && delay < 30
  if (isInValid) {
    throw new Error('Invalid arguments: step must not be 0 and delay must be greater than 30.')
  }

  const [isAlive, setIsAlive] = useState(startNow)
  const [isRunning, setIsRunning] = useState(startNow)
  const [count, setCount] = useState(init)
  // intervalIdはレンダリングの影響を受けないRefを使う
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // "startNow: false" または kill() 後
    if (!isAlive) return

    intervalId.current = setInterval(() => {
      if (!isRunning) return
      if (import.meta.env.DEV) console.log('timer: running')
      switch (type) {
        case 'increment':
          setCount((prev) => {
            if (typeof onCountUp === 'function') onCountUp(prev)
            if (end !== undefined && count + step >= end) {
              if (typeof onEnd === 'function') onEnd()
              kill()
              return end
            }
            return prev + step
          })
          break
        case 'decrement':
          setCount((prev) => {
            if (typeof onCountDown === 'function') onCountDown(prev)
            if (end !== undefined && prev - step <= end) {
              if (typeof onEnd === 'function') onEnd()
              kill()
              return end
            }
            return prev - step
          })
          break
        default:
          return
      }
    }, delay)

    // "startNow: true"でuseTimerを呼び出すと、終了はコンポーネントのライフサイクルにゆだねられる
    // クリーンアップ: コンポーネントがアンマウントされるとタイマーは終了
    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
      intervalId.current = null
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAlive, isRunning, type, step, delay])

  // 外部から明示的にタイマーを操作する場合のメソッド
  const start = () => {
    setIsAlive(true)
    setIsRunning(true)
  }
  const kill = () => {
    setIsAlive(false)
    setIsRunning(false)
    setCount(init)
    if (intervalId.current) clearInterval(intervalId.current)
    intervalId.current = null
  }
  const reset = () => setCount(init)
  const set = (value: number) => setCount(value)
  const stop = () => setIsRunning(false)
  const restart = () => setIsRunning(true)

  return { count, isRunning, setIsRunning, start, kill, reset, set, restart, stop }
}

export default useTimer
