import { ReactNode, useState } from 'react'
import { NotificationContext } from '../hooks/useContexts'

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('')

  const value = {
    message,
    setMessage,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export default NotificationProvider
