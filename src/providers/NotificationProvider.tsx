import { ReactNode, useEffect, useState } from 'react'
import { NotificationContext, NotificationProps } from '../hooks/useContexts'
import { Alert, CircularProgress, Snackbar, Stack, Typography } from '@mui/material'
import useTimer from '../hooks/useTimer'


const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('')

  const handleNotificationClose = () => {
    setMessage('')
  }

  const Notification = ({ severity, autoHideDuration = 0 }: NotificationProps) => {
    // autoHideDurationが0の場合は、カウントダウンしない
    if (autoHideDuration === 0) {
      return (
        <Snackbar open={!!message} onClose={handleNotificationClose}>
          <Alert severity={severity} onClose={handleNotificationClose}>
            <Typography variant="body2" color="inherit">
              {message}
            </Typography>
          </Alert>
        </Snackbar>
      )
    }

    // それ以外の場合は、カウントダウンを開始する
    const delay = 200
    const step = delay / 1000 / autoHideDuration * 100 * 1000
    const { count, start, kill } = useTimer({ init: 100, step, type: 'decrement', delay })

    useEffect(() => {
      (message) ? start() : kill()
    }, [message])

    return (
      <>
        {/* {message && ( */}
          <Snackbar open={!!message} autoHideDuration={4000} onClose={handleNotificationClose}>
            <Alert severity={severity} onClose={handleNotificationClose}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="inherit">
                  {message}
                </Typography>
                <CircularProgress color="secondary" size='1rem' variant="determinate" value={count} />
              </Stack>
            </Alert>
          </Snackbar>
        {/* )} */}
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
