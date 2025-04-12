import { ReactNode, useState } from 'react'
import { NotificationContext, NotificationProps } from '../hooks/useContexts'
import { Alert, Snackbar } from '@mui/material'

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('')

  const handleNotificationClose = () => {
    setMessage('')
  }

  const Notification = ({ severity }: NotificationProps) => {
    return (
      <>
        {message && (
          <Snackbar sx={{}} open autoHideDuration={3000} onClose={handleNotificationClose}>
            <Alert severity={severity} onClose={handleNotificationClose}>
              {message}
            </Alert>
          </Snackbar>
        )}
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
