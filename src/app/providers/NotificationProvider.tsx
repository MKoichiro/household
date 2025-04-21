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

  const notify = {
    login: {
      ok: () => addNotification({ severity: 'success', message: 'ログインしました！', timer: 6000 }),
      ng: () => addNotification({ severity: 'error', message: 'ログインに失敗しました。再度お試しください。' }),
    },
    signup: {
      ok: () =>
        addNotification({
          severity: 'warning',
          message:
            'まだ完了していません。ご入力いただいたメールアドレス宛てに確認メールを送信しました。ご確認ください。',
        }),
      ng: () => addNotification({ severity: 'error', message: 'アカウント作成に失敗しました。再度お試しください。' }),
    },
    verifyEmail: {
      ok: () => addNotification({ severity: 'info', message: '確認メールを再送信しました。メールをご確認ください。' }),
      ng: () =>
        addNotification({
          severity: 'error',
          message: '確認メールの再送信に失敗しました。時間をおいて再度お試しください。',
        }),
    },
    logout: {
      ok: () => addNotification({ severity: 'info', message: 'ログアウトしました！', timer: 6000 }),
      ng: () => addNotification({ severity: 'error', message: 'ログアウトに失敗しました。再度お試しください。' }),
    },
    updateDisplayName: {
      ok: () => addNotification({ severity: 'success', message: 'ユーザー名を変更しました！', timer: 6000 }),
      ng: () => addNotification({ severity: 'error', message: 'ユーザー名の変更に失敗しました。再度お試しください。' }),
    },
  }

  const value = {
    notify,
    notifications,
    addNotification,
    removeNotification,
    removeAllNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export default NotificationProvider
