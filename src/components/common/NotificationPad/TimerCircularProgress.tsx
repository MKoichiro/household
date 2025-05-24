import { CircularProgress, CircularProgressProps } from '@mui/material'
import useTimer from '../../../shared/hooks/useTimer'

type TimerCircularProgressProps = Omit<CircularProgressProps, 'value'> & {
  duration: number
}

const TimerCircularProgress = ({ duration, ...props }: TimerCircularProgressProps) => {
  const delay = 200
  const step = duration <= 0 ? undefined : (delay / duration) * 100
  const { count } = useTimer({ init: 100, step, type: 'decrement', delay, startNow: true })

  return <CircularProgress {...props} value={count >= 0 ? count : 0} />
}

export default TimerCircularProgress
