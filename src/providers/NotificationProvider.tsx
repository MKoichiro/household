// リダイレクト処理を行うコンポーネントで、リダイレクト処理時にsetNotificationでメッセージをセット。
// NotificationコンポーネントをBrowserRouterの外に配置することで、ページ遷移に影響されず通知を表示することができる。

import { ReactNode, useState } from 'react'
import { NotificationContext, NotificationType } from '../hooks/useContexts'
import { AlertColor } from '@mui/material'

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const initialState = {
    message: '',
    severity: 'info' as AlertColor,
    timer: undefined,
  }
  const [notification, setNotification] = useState<NotificationType>(initialState)

  const handleNotificationClose = () => {
    setNotification(initialState)
  }

  const value = {
    notification,
    setNotification,
    handleNotificationClose,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export default NotificationProvider
