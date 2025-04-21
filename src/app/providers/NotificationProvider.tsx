// リダイレクト処理を行うコンポーネントで、リダイレクト処理時にaddNotificationでメッセージをセット。
// NotificationコンポーネントをBrowserRouterの外に配置することで、ページ遷移に影響されず通知を表示することができる。

import { ReactNode, useState } from 'react'
import { NotificationContext, NotificationType } from '../../shared/hooks/useContexts'
import { v4 as uuidv4 } from 'uuid'

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])

  const addNotification = (notification: Omit<NotificationType, 'id'>) => {
    const newNotification: NotificationType = {
      ...notification,
      id: (uuidv4 as () => string)(),
    }
    setNotifications((prev) => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const removeAllNotifications = () => {
    setNotifications([])
  }

  const value = {
    notifications,
    addNotification,
    removeNotification,
    removeAllNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export default NotificationProvider
