import { useEffect, useRef, useState } from 'react'

type TimerType = {
  init?: number
  type?: 'increment' | 'decrement'
  step?: number
  delay?: number
  startNow?: boolean
}

const useTimer = ({ init = 0, step = 1, type = 'increment', delay = 1000, startNow = false }: TimerType) => {
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
      switch (type) {
        case 'increment':
          setCount((prev) => prev + step)
          break
        case 'decrement':
          setCount((prev) => prev - step)
          break
        default:
          return
      }
    }, delay)

    // "startNow: true"でuseTimerを呼び出すと、コンポーネントのライフサイクルにゆだねる
    // クリーンアップ: コンポーネントがアンマウントされるとタイマーは終了
    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
      intervalId.current = null
    }
  }, [isAlive, isRunning, type, step, delay])

  // 外部から明示的にタイマーを操作する場合
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
  const stop = () => setIsRunning(false)
  const restart = () => {
    setIsRunning(true)
  }

  return { count, isRunning, setIsRunning, start, kill, reset, restart, stop }
}

export default useTimer
