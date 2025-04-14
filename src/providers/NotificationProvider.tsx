// リダイレクト処理を行うコンポーネントで、リダイレクト処理時にsetMessageでメッセージをセット。
// リダイレクト先コンポーネントにNotificationコンポーネントを配置することで、
// 通知を表示することができる。

import { ReactNode, useEffect, useState } from 'react'
import { NotificationContext, NotificationProps } from '../hooks/useContexts'
import { Alert, CircularProgress, Snackbar, Stack, Typography } from '@mui/material'
import useTimer from '../hooks/useTimer'

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('')

  const handleNotificationClose = () => {
    setMessage('')
  }

  // 通知表示用コンポーネント
  const Notification = ({ severity, autoHideDuration = undefined }: NotificationProps) => {
    const delay = 200
    // autoHideDurationがundefinedまたは0以下の場合は無制限表示
    const isIndefinite = autoHideDuration === undefined || autoHideDuration <= 0
    const step = !isIndefinite ? (delay / 1000 / autoHideDuration) * 100 * 1000 : undefined
    const { count, start, kill } = useTimer({
      init: 100,
      step,
      type: 'decrement',
      delay,
      startNow: false, // (デフォルト値だがわかりやすさのため明示)
    })

    useEffect(() => {
      if (isIndefinite) return // タイマーを作動させない
      if (message) {
        start()
      } else {
        kill()
      }
      // messageの有無でタイマー制動するので必要。Notificationの外側だが、この場合実害はないので無視。
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message, start, kill, autoHideDuration])

    return (
      <>
        <Snackbar open={!!message} autoHideDuration={autoHideDuration} onClose={handleNotificationClose}>
          <Alert severity={severity} onClose={handleNotificationClose}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="inherit">
                {message}
              </Typography>
              {!isIndefinite && <CircularProgress color="secondary" size="1rem" variant="determinate" value={count} />}
            </Stack>
          </Alert>
        </Snackbar>
      </>
    )
  }

  const value = {
    message,
    setMessage,
    handleNotificationClose,
    Notification,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export default NotificationProvider
