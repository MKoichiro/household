import { useEffect } from 'react'
import { useNotification } from '../../hooks/useContexts'
import useTimer from '../../hooks/useTimer'
import { Alert, CircularProgress, Snackbar, Stack, Typography } from '@mui/material'

// 通知表示用コンポーネント
const Notification = () => {
  const { notification, handleNotificationClose } = useNotification()
  const delay = 200
  const autoHideDuration = notification.timer
  // autoHideDurationがundefinedまたは0以下の場合は無制限表示
  const isInfinite = autoHideDuration === undefined || autoHideDuration <= 0
  const step = autoHideDuration && (delay / autoHideDuration) * 100
  const { count, start, kill } = useTimer({
    init: 100,
    step,
    type: 'decrement',
    delay,
    startNow: false, // 初期状態ではタイマーを動かさない
  })

  useEffect(() => {
    if (isInfinite) return // 無制限表示ならタイマーは作動させない
    if (notification.message) {
      start()
    } else {
      kill()
    }
  }, [isInfinite, notification.message, start, kill, autoHideDuration])

  return (
    <>
      <Snackbar open={!!notification.message} autoHideDuration={autoHideDuration} onClose={handleNotificationClose}>
        <Alert severity={notification.severity} onClose={handleNotificationClose}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="inherit">
              {notification.message}
            </Typography>
            {!isInfinite && <CircularProgress color="secondary" size="1rem" variant="determinate" value={count} />}
          </Stack>
        </Alert>
      </Snackbar>
    </>
  )
}

export default Notification
