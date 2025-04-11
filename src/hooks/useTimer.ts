import { useEffect, useState } from 'react'

type TimerType = 'increment' | 'decrement'

type TimerOptions = {
  init?: number
  type?: TimerType
  delay?: number
}

const useTimer = ({ init = 0, type = 'increment', delay = 1000 }: TimerOptions = {}) => {
  const [count, setCount] = useState(init)
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | number | null>(null)

  useEffect(() => {
    const id = setInterval(() => {
      if (type === 'increment') {
        setCount(prev => prev + 1)
      } else {
        setCount(prev => prev - 1)
      }
    }, delay)

    setIntervalId(id)

    // クリーンアップ: コンポーネントがアンマウントされるとタイマーをクリア
    return () => clearInterval(id)
  }, [type, delay])

  return { count, intervalId }
}

export default useTimer
